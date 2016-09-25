const Chart = require('chart.js'),
      ImageProcessor = require('./ImageProcessor.js'),
      BrightnessHystogram = require('./brightnessHystogram');

let currentImageProcessor,
    brightnessHystogram;

let init = () => {
  initImage(1, 'mainImage');

  brightnessHystogram = new BrightnessHystogram(document.getElementById('imageBrightnessBar'));

  document.getElementById('minFilterButton').addEventListener('click', (event) => {
    currentImageProcessor.applyMinFilter();
    brightnessHystogram.drawBrightnessHystogram(currentImageProcessor.getColorData());
  });

  document.getElementById('maxFilterButton').addEventListener('click', (event) => {
    currentImageProcessor.applyMaxFilter();
    brightnessHystogram.drawBrightnessHystogram(currentImageProcessor.getColorData());
  });

  document.getElementById('minMaxFilterButton').addEventListener('click', (event) => {
    currentImageProcessor.applyMinMaxFilter();
    brightnessHystogram.drawBrightnessHystogram(currentImageProcessor.getColorData());
  });

  document.getElementById('restoreImageButton').addEventListener('click', (event) => {
    currentImageProcessor.restoreOriginalImage();
    brightnessHystogram.drawBrightnessHystogram(currentImageProcessor.getColorData());
  });

  document.getElementById('dPreparationForm').addEventListener('submit', (event) => {
    event.preventDefault();
    currentImageProcessor.applyDPreparation(parseInt(document.getElementById('dMin').value), parseInt(document.getElementById('dMax').value));
    brightnessHystogram.drawBrightnessHystogram(currentImageProcessor.getColorData());
  });

  document.getElementById('ePreparationForm').addEventListener('submit', (event) => {
    event.preventDefault();
    currentImageProcessor.applyEPreparation(parseInt(document.getElementById('eMin').value), parseInt(document.getElementById('eMax').value));
    brightnessHystogram.drawBrightnessHystogram(currentImageProcessor.getColorData());
  });
};

let initImage = (imgIndex, elemId) => {
  let canvas = document.getElementById(elemId),
      context = canvas.getContext('2d'),
      imageObj = new Image();

  imageObj.onload = () => {
    canvas.height = imageObj.height;
    canvas.width = imageObj.width;
    context.drawImage(imageObj, 0, 0);
    currentImageProcessor = new ImageProcessor(canvas);

    brightnessHystogram.drawBrightnessHystogram(currentImageProcessor.getColorData());
  };

  imageObj.src = '../../data/img' + imgIndex + '.jpg';
};

init();
