module.exports = class brightnessHystogram {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
  }

  drawBrightnessHystogram(imageData) {
    let distribution = [],
        distributionStep = 15,
        imageBrightness = new Array(255 / distributionStep).fill(0),
        chart;

    for(let d = 15; d <= 255; d += distributionStep) {
      distribution.push(d);
    }

    for(let i = 0; i < imageData.length; i += 4) {
      let pixelBrightness = (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
      imageBrightness[Math.floor(pixelBrightness / distributionStep)] += 1;
    }

    chart = new Chart(this.context, {
          type: 'bar',
          data: {
            labels: distribution,
            datasets: [
              {
                label: "imageBrightness",
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                data: imageBrightness
              }
            ]
          }
        });
  }
};
