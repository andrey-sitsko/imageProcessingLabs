const Chart = require('chart.js');

let init = () => {

};

let drawChart = (sequence, chartName, labels, data) => {
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
};

init();
