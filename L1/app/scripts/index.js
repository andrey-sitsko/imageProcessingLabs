const Chart = require('chart.js'),
      ImageProcessor = require('./ImageProcessor.js');

let currentImageProcessor;

let init = () => {
  initImage(1, 'mainImage');
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
    document.getElementById('minFilterButton').addEventListener('click', currentImageProcessor.applyMinFilter.bind(currentImageProcessor));
    document.getElementById('maxFilterButton').addEventListener('click', currentImageProcessor.applyMaxFilter.bind(currentImageProcessor));
    document.getElementById('minMaxFilterButton').addEventListener('click', currentImageProcessor.applyMinMaxFilter.bind(currentImageProcessor));
    //document.getElementById('incrementalProcessingButton').addEventListener('click', currentImageProcessor.processImageIncrementally.bind(currentImageProcessor));
  };

  imageObj.src = '../../data/img' + imgIndex + '.jpg';
};

/*let drawChart = (sequence, chartName, labels, data) => {
  let ctx = document.getElementById(chartName).getContext("2d"),
      chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: "Lehmer sequence",
              lineTension: 0.1,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              data: data
            }
          ]
        }
      });
};*/

init();
