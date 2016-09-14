module.exports = class ImageProcessor {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.imageData = this.context.getImageData(0, 0, this.canvas.width,  this.canvas.height);
    this.colorData = this.imageData.data;
  }

  applyMinFilter() {

    let pixelNeibhours,
        sortedNeibhours,
        imageWidth = this.canvas.width,
        originalColorData = this.colorData.slice(),
        redChannel,
        greenChannel,
        blueChannel;

    for (let pixelIndex = 0; pixelIndex < originalColorData.length; pixelIndex += 4) {
      redChannel = [];
      greenChannel = [];
      blueChannel = [];

      for(let rawOffset = -1; rawOffset < 2; rawOffset++) {
        for(let pixelOffset = -1; pixelOffset < 2; pixelOffset++) {
          for(let colorOffset = 0; colorOffset < 3; colorOffset++) {
            let colorIndex = pixelIndex + imageWidth * rawOffset + pixelOffset + colorOffset;
            if(colorIndex >= 0) {
              switch(colorOffset) {
                case 0:
                  redChannel.push(originalColorData[colorIndex]);
                  break;
                case 1:
                  greenChannel.push(originalColorData[colorIndex]);
                  break;
                case 2:
                  blueChannel.push(originalColorData[colorIndex]);
                  break;
              }
            } else {
              redChannel.push(0);
              greenChannel.push(0);
              blueChannel.push(0);
            }
          }
        }
      }


      if((pixelIndex - 1) >= 0) {
        this.colorData[pixelIndex - 1] = redChannel.sort(function(a, b) {
          return a - b;
        })[0];
      }

      this.colorData[pixelIndex] = greenChannel.sort(function(a, b) {
        return a - b;
      })[0];

      if(pixelIndex + 1 < this.colorData.length) {
        this.colorData[pixelIndex + 1] = blueChannel.sort(function(a, b) {
          return a - b;
        })[0];
      }
    }

    this.context.putImageData(this.imageData, 0, 0);
  }

  applyMaxFilter() {

  }

  applyMinMaxFilter() {

  }

  redrawImage() {

  }
};
