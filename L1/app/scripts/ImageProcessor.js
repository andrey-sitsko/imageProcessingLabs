module.exports = class ImageProcessor {
  constructor(canvas) {
    this.canvas = canvas;
  }

  processImageIncrementally() {

  }

  filterImage() {
    let context = this.canvas.getContext('2d'),
        imageData = context.getImageData(0, 0, this.canvas.width,  this.canvas.height),
        imagePixels = imageData.data;

    for (let i = 0; i < imagePixels.length; i+=4) {
      imagePixels[i] -= 80;
      imagePixels[i+1] -= 80;
      imagePixels[i+2] -= 80;
    }

    context.putImageData(imageData, 0, 0);
  }

  redrawImage() {

  }
};
