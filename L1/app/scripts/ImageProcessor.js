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
        blueChannel,
        channels;

    for (let pixelIndex = 0; pixelIndex < currentColorData.length; pixelIndex += 4) {
      channels = this._getPixelNeiboursColorChannels(pixelIndex, currentColorData, imageColorData);
      redChannel = channels[0];
      greenChannel = channels[1];
      blueChannel = channels[2];

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

  applyMaxFilter() {
    let imageWidth = this.canvas.width,
        currentColorData = this.imageData.data.slice(),
        imageColorData = this.imageData.data,
        redChannel,
        greenChannel,
        blueChannel,
        channels;

    for (let pixelIndex = 0; pixelIndex < currentColorData.length; pixelIndex += 4) {
      channels = this._getPixelNeiboursColorChannels(pixelIndex, currentColorData, imageColorData);
      redChannel = channels[0];
      greenChannel = channels[1];
      blueChannel = channels[2];

      imageColorData[pixelIndex] = redChannel.sort((a, b) => {
        return a - b;
      })[redChannel.length - 1];

      imageColorData[pixelIndex + 1] = greenChannel.sort((a, b) => {
        return a - b;
      })[greenChannel.length - 1];

      imageColorData[pixelIndex + 2] = blueChannel.sort((a, b) => {
        return a - b;
      })[blueChannel.length - 1];
    }

    this.context.putImageData(this.imageData, 0, 0);
  }

  applyMinMaxFilter() {
    this.applyMinFilter();
    this.applyMaxFilter();
  }

  applyDPreparation(min, max) {
    let imageColorData = this.imageData.data;

    imageColorData.forEach((color, index, arr) => {
      arr[index] = (((max - min) * color / 255) + min);
    });

    this.context.putImageData(this.imageData, 0, 0);
  }

  applyEPreparation(min, max) {
    let imageColorData = this.imageData.data;

    imageColorData.forEach((color, index, arr) => {

      let preparedColor;

      if (color <= min) {
        preparedColor =  0;
      }

      if (color >= max) {
        preparedColor = 255;
      }

      if (color > min && color < max) {
          preparedColor = (255 * (color - min) / (max - min));
      }

      arr[index] = preparedColor;
    });

    this.context.putImageData(this.imageData, 0, 0);
  }

  _getPixelNeiboursColorChannels(pixelIndex, currentColorData, imageColorData) {
    let imageWidth = this.canvas.width,
        redChannel = [],
        greenChannel = [],
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

    return [redChannel, greenChannel, blueChannel];
  }

  restoreOriginalImage() {
    this.imageData.data.forEach((elem, index, arr) => {
      arr[index] = this.originalColorData[index];
    });
    this.context.putImageData(this.imageData, 0, 0);
  }
};
