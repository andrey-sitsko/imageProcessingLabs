const ImageObject = require('./ImageObject'),
      HopfieldNetwork = require('./HopfieldNetwork'),
      STANDARDS_IMAGES = [
        'E.png',
        'O.png',
        'SH.png'
      ],
      IMAGES_FOR_RECOGNITION = [
        'E.png',
        'E_wasted.png',
        'O.png',
        'O_wasted.png',
        'SH.png',
        'SH_wasted.png',
        'square.png',
        'G.png',
        'lines.png',
        'letter.png'
      ];

let hopfieldNetwork = new HopfieldNetwork();

let addStandards = (network, standardsImages) => {
  let standardsContainer = document.getElementById('standardsContainer');
  standardsImages.forEach((imageName, index) => {
    let canvas = document.createElement('canvas'),
        image = new Image();

    standardsContainer.appendChild(canvas);

    image.src = '../../data/' + imageName;
    image.onload = (function() {
      let imageObject;

      drawImageOnCanvas(this.canvas, this.image);
      imageObject = new ImageObject(this.canvas);
      hopfieldNetwork.addImage(imageObject);

      if(this.imageIndex === STANDARDS_IMAGES.length - 1) {
        hopfieldNetwork.calculateWeights();
        recogniseImages(hopfieldNetwork, IMAGES_FOR_RECOGNITION);
      }
    }).bind({canvas: canvas, image: image, imageIndex: index});
  });
};

let recogniseImages = (hopfieldNetwork, imagesForRecognition) => {
  let imagesForRecognitionContainer = document.getElementById('imagesForRecognitionContainer');
  imagesForRecognition.forEach((imageName) => {
    let canvas = document.createElement('canvas'),
      image = new Image();

    imagesForRecognitionContainer.appendChild(canvas);

    image.src = '../../data/' + imageName;

    image.onload = (function() {
      let context = this.canvas.getContext('2d');

      drawImageOnCanvas(this.canvas, this.image);
      imageObject = new ImageObject(this.canvas);
      if(hopfieldNetwork.recogniseImage(imageObject)) {
        this.canvas.classList.add('recognisedImage');
      } else {
        this.canvas.classList.add('notRecognisedImage');
      }
    }).bind({canvas: canvas, image: image, imageName: imageName});
  });
};

let drawImageOnCanvas = (canvas, image) => {
  let context = canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0);
};

addStandards(hopfieldNetwork, STANDARDS_IMAGES);