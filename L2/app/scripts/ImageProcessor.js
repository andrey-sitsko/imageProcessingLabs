module.exports = class ImageProcessor {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.imageData = this.context.getImageData(0, 0, this.canvas.width,  this.canvas.height);
    this.originalColorData = this.imageData.data.slice();
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
      colorData[i] = colorData[i + 1] = colorData[i + 2] = pixelValue <= binarizingLimit ? 0 : 255;
    }

    return imageData;
  }
};
