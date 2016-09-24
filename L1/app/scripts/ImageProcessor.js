module.exports = class ImageProcessor {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.imageData = this.context.getImageData(0, 0, this.canvas.width,  this.canvas.height);
    this.originalColorData = this.imageData.data.slice();
  }

  applyMinFilter() {

    let imageWidth = this.canvas.width,
        currentColorData = this.imageData.data.slice(),
        imageColorData = this.imageData.data,
        redChannel,
        greenChannel,
        blueChannel;

    for (let pixelIndex = 0; pixelIndex < currentColorData.length; pixelIndex += 4) {
      redChannel = [];
      greenChannel = [];
      blueChannel = [];

      for(let rawOffset = -1; rawOffset < 2; rawOffset++) {
        for(let pixelOffset = -1; pixelOffset < 2; pixelOffset++) {
          let currentPixelIndex = pixelIndex + rawOffset * imageWidth * 4 + pixelOffset * 4;
          if(currentPixelIndex >= 0 && (currentPixelIndex + 4) <= currentColorData.length) {
              redChannel.push(currentColorData[currentPixelIndex]);
              greenChannel.push(currentColorData[currentPixelIndex + 1]);
              blueChannel.push(currentColorData[currentPixelIndex + 2]);
          }
        }
      }

      imageColorData[pixelIndex] = redChannel.sort((a, b) => {
        return a - b;
      })[0];

      imageColorData[pixelIndex + 1] = greenChannel.sort((a, b) => {
        return a - b;
      })[0];

      imageColorData[pixelIndex + 2] = blueChannel.sort((a, b) => {
        return a - b;
      })[0];
    }

    this.context.putImageData(this.imageData, 0, 0);
  }

  restoreOriginalImage() {
    this.imageData.data.forEach((elem, index, arr) => {
      arr[index] = this.originalColorData[index];
    });
    this.context.putImageData(this.imageData, 0, 0);
  }
};
