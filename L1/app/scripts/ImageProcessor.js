module.exports = class ImageProcessor {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.imageData = this.context.getImageData(0, 0, this.canvas.width,  this.canvas.height);
    this.colorData = this.imageData.data;
  }

  applyMinFilter() {

    let imageWidth = this.canvas.width,
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
          let currentPixelIndex = pixelIndex + rawOffset * imageWidth * 4 + pixelOffset * 4;
          if(currentPixelIndex >= 0 && (currentPixelIndex + 4) <= originalColorData.length) {
              redChannel.push(originalColorData[currentPixelIndex]);
              greenChannel.push(originalColorData[currentPixelIndex + 1]);
              blueChannel.push(originalColorData[currentPixelIndex + 2]);
          }
        }
      }

      this.colorData[pixelIndex] = redChannel.sort(function(a, b) {
        return a - b;
      })[0];

      this.colorData[pixelIndex + 1] = greenChannel.sort(function(a, b) {
        return a - b;
      })[0];

      this.colorData[pixelIndex + 2] = blueChannel.sort(function(a, b) {
        return a - b;
      })[0];
    }

    this.context.putImageData(this.imageData, 0, 0);
  }
};
