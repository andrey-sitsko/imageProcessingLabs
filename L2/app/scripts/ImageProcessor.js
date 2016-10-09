const ImageObject = require('./ImageObject.js');

module.exports = class ImageProcessor {
  constructor(canvas) {
    this.canvas = canvas;
    this.imageHeight = canvas.height;
    this.imageWidth = canvas.width;
    this.context = this.canvas.getContext('2d');
    this.imageData = this.context.getImageData(0, 0, this.canvas.width,  this.canvas.height);
    this.originalColorData = this.imageData.data.slice();
    this.pixelMatrix = [];
    this.imageObjects = [];
  }

  resetValues() {
    this.pixelMatrix = [];
    this.imageObjects = [];
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

  colorObjects() {
    let colorNumber = 0,
        pixelMatrix = this.pixelMatrix;

    for(let stringIndex = 1; stringIndex < this.imageHeight; stringIndex++) {
      for(let pixelIndex = 1; pixelIndex < this.imageWidth; pixelIndex++) {
        if(pixelMatrix[stringIndex * this.imageWidth + pixelIndex].color !== 0) {
          let prevStringPixel = pixelMatrix[(stringIndex - 1) * this.imageWidth + pixelIndex],
              prevPixel = pixelMatrix[stringIndex * this.imageWidth + pixelIndex - 1];

          if(prevPixel.area === 0 && prevStringPixel.area === 0) {
            //console.log(g);
            debugger;
            colorNumber++;
            pixelMatrix[stringIndex * this.imageWidth + pixelIndex].area = colorNumber;
          } else if(prevPixel.area === prevStringPixel.area && prevPixel.area !== 0) {
            pixelMatrix[stringIndex * this.imageWidth + pixelIndex].area = prevStringPixel.area;
          } else if(prevStringPixel.area !== 0 && prevPixel.area !== 0 && prevPixel.area !== prevStringPixel.area) {
            pixelMatrix[stringIndex * this.imageWidth + pixelIndex].area = prevStringPixel.area;

            for(let defPixStringIndex = 1; defPixStringIndex <= stringIndex; defPixStringIndex++) {
              for(let defPixIndex = 1; defPixIndex < this.imageWidth; defPixIndex++) {
                if(defPixStringIndex === stringIndex && defPixIndex === pixelIndex) {
                  break;
                }
                if(pixelMatrix[stringIndex * this.imageWidth + pixelIndex].area === prevPixel.area) {
                  pixelMatrix[stringIndex * this.imageWidth + pixelIndex].area = prevStringPixel.area;
                }
              }
            }
          } else if(prevPixel.area !== 0) {
            pixelMatrix[stringIndex * this.imageWidth + pixelIndex].area = prevPixel.area;
          } else if(prevStringPixel.area !==0) {
            pixelMatrix[stringIndex * this.imageWidth + pixelIndex].area = prevStringPixel.area;
          }
        }
      }
    }
    console.log(colorNumber);
    //this.createImageObjects();
  }

  createImageObjects() {
    for(let i = 0; i < this.imageHeight; i++) {
      for(let j = 0; j < this.imageWidth; j++) {
        let pixel = this.pixelMatrix[i * this.imageWidth + j];
        this.imageObjects.push(new ImageObject(pixel));
      }
    }
  }
};
