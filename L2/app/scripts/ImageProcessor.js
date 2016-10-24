const FigureObject = require('./FigureObject.js'),
      Cluster = require('./Cluster.js'),
      figuresSquareLimit = 400,
      firstColor = [0, 204, 0],
      secondColor = [255, 153, 0];

module.exports = class ImageProcessor {
  constructor(canvas) {
    this.canvas = canvas;
    this.imageHeight = canvas.height;
    this.imageWidth = canvas.width;
    this.context = this.canvas.getContext('2d');
    this.imageData = this.context.getImageData(0, 0, this.canvas.width,  this.canvas.height);
    this.originalColorData = this.imageData.data.slice();
    this.pixelMatrix = [];
    this.figuresObjects = [];
    this.firstCluster = {};
    this.secondCluster = {};
  }

  binarizeImage(binarizingLimit) {
    let imageData = this.imageData,
        colorData = this.imageData.data;

    this.pixelMatrix = [];

    for(let i = 0; i < colorData.length; i += 4) {
      let pixelValue = (colorData[i] + colorData[i + 1] + colorData[i + 2]) / 3;
      if(pixelValue <= binarizingLimit) {
        colorData[i] = colorData[i + 1] = colorData[i + 2] = 0;
        this.pixelMatrix.push({
          color: 0,
          area: 0
        });
      } else {
        colorData[i] = colorData[i + 1] = colorData[i + 2] = 255;
        this.pixelMatrix.push({
          color: 1,
          area: 0
        });
      }
    }
    return imageData;
  }

  restoreOriginalImageData() {
    this.imageData.data.forEach((elem, index, arr) => {
      arr[index] = this.originalColorData[index];
    });
  }

  calculateImageFigures() {
    this._detectFiguresAreas();

    let uniqAreas = new Set(),
        areasCount = {};

    for(let stringIndex = 1; stringIndex < this.imageHeight; stringIndex++) {
      for(let pixelIndex = 1; pixelIndex < this.imageWidth; pixelIndex++) {
        let currentPixel = this.pixelMatrix[stringIndex * this.imageWidth + pixelIndex];
        if (currentPixel.area !== 0) {
          uniqAreas.add(currentPixel.area);
          if(!areasCount[currentPixel.area]) {
            areasCount[currentPixel.area] = 0;
          }
          areasCount[currentPixel.area]++;
        }
      }
    }

    this.figuresObjects = this._createFiguresObjects(uniqAreas);
    this._calculateFiguresParams(this.figuresObjects, this.pixelMatrix, areasCount);
    this._clusterAnalysis(this.figuresObjects);
  }

  _detectFiguresAreas() {
    let colorNumber = 0,
        pixelMatrix = this.pixelMatrix;

    for(let stringIndex = 1; stringIndex < this.imageHeight; stringIndex++) {
      for(let pixelIndex = 1; pixelIndex < this.imageWidth; pixelIndex++) {
        if(pixelMatrix[stringIndex * this.imageWidth + pixelIndex].color !== 0) {
          let prevStringPixel = pixelMatrix[(stringIndex - 1) * this.imageWidth + pixelIndex],
              prevPixel = pixelMatrix[stringIndex * this.imageWidth + pixelIndex - 1],
              currentPixel = pixelMatrix[stringIndex * this.imageWidth + pixelIndex];

          if(prevPixel.area === 0 && prevStringPixel.area === 0) {
            colorNumber++;
            currentPixel.area = colorNumber;
          } else if(prevStringPixel.area === prevPixel.area && prevPixel.area !== 0) {
            currentPixel.area = prevStringPixel.area;
          } else if(prevStringPixel.area !== 0 && prevPixel.area !== 0 && prevPixel.area !== prevStringPixel.area) {
            currentPixel.area = prevStringPixel.area;

            for(let defPixStringIndex = 1; defPixStringIndex <= stringIndex; defPixStringIndex++) {
              for(let defPixIndex = 1; defPixIndex < this.imageWidth; defPixIndex++) {
                if(defPixStringIndex === stringIndex && defPixIndex === pixelIndex) {
                  break;
                }
                let defCurrentPixel = pixelMatrix[defPixStringIndex * this.imageWidth + defPixIndex];
                if(defCurrentPixel.area === prevPixel.area) {
                  defCurrentPixel.area = prevStringPixel.area;
                }
              }
            }
          } else if(prevPixel.area !== 0) {
            currentPixel.area = prevPixel.area;
          } else if(prevStringPixel.area !==0) {
            currentPixel.area = prevStringPixel.area;
          }
        }
      }
    }
  }

  _excludeSmallFigures(figuresObjects, squareLimit) {
    return figuresObjects.filter((figure) => {
      return figure.square >= squareLimit;
    });
  }

  _createFiguresObjects(uniqAreas) {
    let figuresObjects = [];
    uniqAreas.forEach((area) => {
      figuresObjects.push(new FigureObject(area));
    });
    return figuresObjects;
  }

  _calculateFiguresParams(figuresObjects, pixelMatrix, areasCount) {
    figuresObjects.forEach((figure) => {
      figure.square = areasCount[figure.area];
    });

    this.figuresObjects = this._excludeSmallFigures(this.figuresObjects, figuresSquareLimit);

    for(let stringIndex = 1; stringIndex < this.imageHeight - 1; stringIndex++) {
      for(let pixelIndex = 1; pixelIndex < this.imageWidth - 1; pixelIndex++) {
        let prevStringPixel = pixelMatrix[(stringIndex - 1) * this.imageWidth + pixelIndex],
            prevPixel = pixelMatrix[stringIndex * this.imageWidth + pixelIndex - 1],
            nextStringPixel = pixelMatrix[(stringIndex + 1) * this.imageWidth + pixelIndex],
            nextPixel = pixelMatrix[stringIndex * this.imageWidth + pixelIndex + 1],
            currentPixel = pixelMatrix[stringIndex * this.imageWidth + pixelIndex];

        if(currentPixel.area !== 0) {
          figuresObjects.forEach((figure) => {
              if(figure.area === currentPixel.area) {
                if(prevPixel.area === 0 || prevStringPixel.area === 0 || nextPixel.area === 0 || nextStringPixel.area === 0) {
                  figure.perimeter++;
                }

                figure.verticalDimensions += stringIndex;
                figure.horizontalDimensions += pixelIndex;
              }
          });
        }
      }
    }

    figuresObjects.forEach((figure) => {
      figure.density = +(Math.pow(figure.perimeter, 2) / figure.square).toFixed(2);
      figure.staticMomentX = +(figure.horizontalDimensions / figure.square).toFixed(2);
      figure.staticMomentY = +(figure.verticalDimensions / figure.square).toFixed(2);
    });

    this._calculateFiguresProlongation(figuresObjects, pixelMatrix);
  }

  _calculateFiguresProlongation(figuresObjects, pixelMatrix) {
    for(let stringIndex = 1; stringIndex < this.imageHeight - 1; stringIndex++) {
      for(let pixelIndex = 1; pixelIndex < this.imageWidth - 1; pixelIndex++) {
        let currentPixel = pixelMatrix[stringIndex * this.imageWidth + pixelIndex];
        if(currentPixel.area !== 0) {
          figuresObjects.forEach((figure) => {
            if(currentPixel.area === figure.area) {
              figure.m20 += Math.pow((pixelIndex - figure.staticMomentX), 2);
              figure.m02 += Math.pow((stringIndex - figure.staticMomentY), 2);
              figure.m11 += (stringIndex - figure.staticMomentY) * (pixelIndex - figure.staticMomentX);
            }
          });
        }
      }
    }

    figuresObjects.forEach((figure) => {
      debugger;
      figure.elongation = ((figure.m20 + figure.m02 + Math.sqrt(Math.pow(figure.m20 - figure.m02, 2)) + 4 * Math.pow(figure.m11, 2)) /
                          (figure.m20 + figure.m02 - Math.sqrt(Math.pow(figure.m20 - figure.m02, 2)) + 4 * Math.pow(figure.m11, 2)));
    });
  }

  _clusterAnalysis(figuresObjects) {
    let firstCluster = new Cluster(0, 0, 0),
        secondCluster = new Cluster(1000, 1000, 1000);

    figuresObjects.forEach((figure) => {
      let firstDistanse = this._calculateDistanse(firstCluster, figure),
          secondDistanse = this._calculateDistanse(secondCluster, figure);

      if(firstDistanse <= secondDistanse) {
        this._addFigureToCluster(firstCluster, figure);
      } else {
        this._addFigureToCluster(secondCluster, figure);
      }
    });

    this.firstCluster = firstCluster;
    this.secondCluster = secondCluster;
  }

  _addFigureToCluster(cluster, figure) {
    cluster.figures.push(figure);
    cluster.perimeters.push(figure.perimeter);
    cluster.squares.push(figure.square);
    cluster.densities.push(figure.density);
  }

  _calculateDistanse(cluster, figure) {
    let clusterCurrentPoint = cluster.currentPoint;
    return Math.pow(
      Math.pow(clusterCurrentPoint.square - figure.square, 2) +
      Math.pow(clusterCurrentPoint.perimeter - figure.perimeter, 2) +
      Math.pow(clusterCurrentPoint.density - figure.density, 2),
    0.5);
  }

  colorObjects() {
    let imageData = this.imageData,
        colorData = this.imageData.data;

    for(let stringIndex = 1; stringIndex < this.imageHeight; stringIndex++) {
      for(let pixelIndex = 1; pixelIndex < this.imageWidth; pixelIndex++) {
        let currentPixel = this.pixelMatrix[stringIndex * this.imageWidth + pixelIndex],
            colorIndex = (stringIndex * this.imageWidth + pixelIndex) * 4;

        if (currentPixel.area !== 0) {
          this.firstCluster.figures.forEach((figure) => {
            if(currentPixel.area === figure.area) {
              this._colorPixel(colorData, colorIndex, firstColor);
            }
          });

          this.secondCluster.figures.forEach((figure) => {
            if(currentPixel.area === figure.area) {
              this._colorPixel(colorData, colorIndex, secondColor);
            }
          });
        }
      }
    }
    return imageData;
  }

  _colorPixel(colorData, colorIndex, endColor) {
    colorData[colorIndex] = endColor[0];
    colorData[colorIndex + 1] = endColor[1];
    colorData[colorIndex + 2] = endColor[2];
  }
};
