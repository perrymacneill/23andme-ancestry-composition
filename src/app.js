import colors from './colors';
import Chart from 'chart.js';

const $SCRIPT_ROOT = 'http://localhost:5000';

let config = {
  type: 'doughnut',
  data: {
    datasets: [],
    labels: []
  },
  options: {
    responsive: true,
    legend: {
      position: 'top',
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    },
    title: {
      display: true,
      text: 'Ancestry Breakdown'
    }
  }
};

init();

function init() {
  $('#threshold-display').html('<h3>Estimate threshold: ' + $("#threshold-slider")[0].value + '</h3>');

  $('#submit-button').on('click', function() {
    getAncestry();
  });

  $("#threshold-slider").on('input', function() {
    $('#threshold-display').html('<h3>Estimate threshold: ' + $("#threshold-slider")[0].value + '</h3>');
  });

  let randomScalingFactor = function() {
    return Math.round(Math.random() * 100);
  };

  getAncestry();

  let ctx = document.getElementById("chart-area").getContext("2d");
  window.ancestryChart = new Chart(ctx, config);
}

function getAncestry() {
  $.ajax({
    type: 'POST',
    url: $SCRIPT_ROOT + '/get_ancestry',
    data: {
      'threshold': $('#threshold-slider')[0].value
    },
    success: function(data) {
      console.log(data);
      let subpopulations = data.ancestry.sub_populations;
      $("#ancestry-data").html('');
      resetChart();
      loopSubpopulations(subpopulations);
    }
  });
}

function loopSubpopulations(arr) {
  let dataset = [];
  for (let i = 0; i < 3; i++) { //three levels of ancestry data
    dataset[i] = {
      backgroundColor: [],
      data: [],
      label: 'New dataset ' //+ config.data.datasets.length
    };
  }

  for (let i in arr) {
    dataset[0].data.push(arr[i].proportion);
    displaySubpopulations(arr[i]);
    for (let j in arr[i].sub_populations) {
      dataset[1].data.push(arr[i].sub_populations[j].proportion);
      displaySubpopulations(arr[i].sub_populations[j]);
      for (let k in arr[i].sub_populations[j].sub_populations) {
        dataset[2].data.push(arr[i].sub_populations[j].sub_populations[k].proportion);
        displaySubpopulations(arr[i].sub_populations[j].sub_populations[k]);
      }
    }
  }

  let colorCounter = 0;
  for (let i = 2; i >= 0; i--) {
    for (let j = 0, k = 1; j < dataset[i].data.length; j++, k++) {
      dataset[i].backgroundColor[j] = colors[colorCounter];
      colorCounter++;
    }
    config.data.datasets.push(dataset[i]);
  }
  window.ancestryChart.update();
}

function displaySubpopulations(population) {
  if (population !== undefined && population.proportion > 0) { //check if user has this ancestry category
    $("#ancestry-data").append('<div>' + population.label + ': ' + (Math.floor(population.proportion * 1000) / 10) + '%</div>');
  }
}

function resetChart() {
  config.data.datasets = [];
  config.data.labels = [];
}
