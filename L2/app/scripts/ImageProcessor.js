module.exports = class ImageProcessor {
  constructor(canvas) {
    this.canvas = canvas;
    this.imageHeight = canvas.height;
    this.imageWidth = canvas.width;
    this.context = this.canvas.getContext('2d');
    this.imageData = this.context.getImageData(0, 0, this.canvas.width,  this.canvas.height);
    this.originalColorData = this.imageData.data.slice();
    this.pictureMatrix = [];
    this.maxColor = 0;
  }

  getColorData() {
    return this.imageData.data;
  }

  restoreOriginalImageData() {
    this.imageData.data.forEach((elem, index, arr) => {
      arr[index] = this.originalColorData[index];
    });
  }

  getBinarizedImage(binarizingLimit) {
    let imageData = this.imageData,
        colorData = this.imageData.data;

    for(let i = 0; i < colorData.length; i += 4) {
      let pixelValue = (colorData[i] + colorData[i + 1] + colorData[i + 2]) / 3;
      if(pixelValue <= binarizingLimit) {
        colorData[i] = colorData[i + 1] = colorData[i + 2] = 0;
        this.pictureMatrix.push(0);
      } else {
        colorData[i] = colorData[i + 1] = colorData[i + 2] = 255;
        this.pictureMatrix.push(1);
      }
    }
    return imageData;
  }

  colorObjects(definitionStep) {
    let maxNumber = 0,
        colorNumber = 1;

    const colorData = this.imageData.data;

    for(let stringIndex = definitionStep; stringIndex < this.imageHeight - definitionStep; stringIndex++) {
      for(let pixelIndex = definitionStep; pixelIndex < this.imageWidth - definitionStep; pixelIndex++) {
        let currentPixel = this.pictureMatrix[stringIndex * this.imageWidth + pixelIndex];
        if(currentPixel !== 0) {
          maxNumber = currentPixel;

          for(let defPixString = stringIndex - definitionStep; defPixString < (stringIndex + definitionStep + 1); defPixString++) {
            for(let defPixIndex = pixelIndex - definitionStep; defPixIndex < (pixelIndex + definitionStep + 1); defPixIndex++) {
              let defPixel = this.pictureMatrix[definitionString * this.imageWidth + definitionPixel];
              if(defPixel > maxNumber) {
                maxNumber = defPixel;
              }
            }
          }

          colorNumber++;
          for(let defPixString = stringIndex - definitionStep; defPixString < (stringIndex + definitionStep + 1); defPixString++) {
            for(let defPixIndex = pixelIndex - definitionStep; defPixIndex < (pixelIndex + definitionStep + 1); defPixIndex++) {
              let defPixel = this.pictureMatrix[defPixString * this.imageWidth + defPixIndex];
              if(defPixel !== 0) {
                if(maxNumber === 1) {
                  this.pictureMatrix[defPixString * this.imageWidth + defPixIndex] = colorNumber;
                } else {
                  this.pictureMatrix[definitionString * this.imageWidth + defPixIndex] = maxNumber;
                }
              }
            }
          }

          if(colorNumber > this.maxColor) {
            this.maxColor = colorNumber;
          }
        }
      }
    }
  }
};
