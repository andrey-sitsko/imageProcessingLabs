const Chart = require('chart.js'),
      ImageProcessor = require('./ImageProcessor.js'),
      images = [
        '4.jpg',
        '2.jpg',
        '3.jpg',
        '4.jpg',
        '5.jpg',
        '6.jpg',
        '7.jpg',
        '8.jpg'
      ];

let currentImageProcessor,
    imageIndex = 0,
    canvasHeight,
    canvasWidth;

let init = () => {
  loadImage(images[imageIndex], document.getElementById('mainImage'));

  document.getElementById('nextImageScroll').addEventListener('click', (event) => {
    if(imageIndex + 1 >= images.length) {
      imageIndex = 0;
    } else {
      imageIndex = imageIndex + 1;
    }

    loadImage(images[imageIndex], document.getElementById('mainImage'));
  });

  document.getElementById('recalculateButton').addEventListener('click', (event) => {
    processImage();
  });

  document.getElementById('prevImageScroll').addEventListener('click', (event) => {
    if(imageIndex - 1 < 0) {
      imageIndex = images.length - 1;
    } else {
      imageIndex = imageIndex - 1;
    }

    loadImage(images[imageIndex], document.getElementById('mainImage'));
  });
};

let loadImage = (imgName, canvas) => {
  let context = canvas.getContext('2d');
      imageObj = new Image();

  imageObj.onload = () => {
    canvasHeight = canvas.height = imageObj.height;
    canvasWidth = canvas.width = imageObj.width;
    context.drawImage(imageObj, 0, 0);
    currentImageProcessor = new ImageProcessor(canvas);
    processImage();
  };

  imageObj.src = '../../data/' + imgName;
};

let processImage = () => {
  let binarizingLimit = document.getElementById('binarizingLimitInput').value;
  putImageData(currentImageProcessor.binarizeImage(binarizingLimit), document.getElementById('binarizedImage'));
  currentImageProcessor.restoreOriginalImageData();
  currentImageProcessor.calculateImageObjects();
};

let putImageData = (imageData, canvas) => {
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;
  canvas.getContext('2d').putImageData(imageData, 0, 0);
};

init();
