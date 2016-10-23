const FigureObject = require('./FigureObject.js');

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
  }

  getColorData() {
    return this.imageData.data;
  }

  restoreOriginalImageData() {
    this.imageData.data.forEach((elem, index, arr) => {
      arr[index] = this.originalColorData[index];
    });
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

  calculateImageFigures() {
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

    this._calculateFigures();
  }

  _calculateFigures() {
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

    this._createFiguresObjects(this.figuresObjects, uniqAreas);
    this._calculateFiguresParams(this.figuresObjects, this.pixelMatrix, areasCount);
  }

  _createFiguresObjects(figuresObjects, uniqAreas) {
    uniqAreas.forEach((area) => {
      figuresObjects.push(new FigureObject(area));
    });
  }

  _calculateFiguresParams(figuresObjects, pixelMatrix, areasCount) {

    figuresObjects.forEach((figure) => {
      figure.square = areasCount[figure.area];
    });

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
  }
};
