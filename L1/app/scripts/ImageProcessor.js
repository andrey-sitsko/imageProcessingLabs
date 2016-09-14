module.exports = class ImageProcessor {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.imageData = this.context.getImageData(0, 0, canvas.height, canvas.width);
  }
};
