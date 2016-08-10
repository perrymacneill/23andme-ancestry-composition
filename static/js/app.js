$SCRIPT_ROOT = 'http://localhost:5000';
var config = {};

function init(){
  $('#threshold-display').html('<h3>Estimate threshold: ' + $("#threshold-slider")[0].value + '</h3>');

  $('#submit-button').on('click', function() {
    getAncestry();
  });

  $("#threshold-slider").on('input', function() {
    $('#threshold-display').html('<h3>Estimate threshold: ' + $("#threshold-slider")[0].value + '</h3>');
  });

  getAncestry();

  var randomScalingFactor = function() {
    return Math.round(Math.random() * 100);
  };

  config = {
          type: 'doughnut',
          data: {
              datasets: [{
                  data: [
                      randomScalingFactor(),
                      randomScalingFactor(),
                      randomScalingFactor(),
                      randomScalingFactor(),
                      randomScalingFactor(),
                  ],
                  backgroundColor: [
                      "#F7464A",
                      "#46BFBD",
                      "#FDB45C",
                      "#949FB1",
                      "#4D5360",
                  ],
                  label: 'Dataset 1'
              }, {
                  data: [
                      randomScalingFactor(),
                      randomScalingFactor(),
                      randomScalingFactor(),
                      randomScalingFactor(),
                      randomScalingFactor(),
                  ],
                  backgroundColor: [
                      "#F7464A",
                      "#46BFBD",
                      "#FDB45C",
                      "#949FB1",
                      "#4D5360",
                  ],
                  label: 'Dataset 2'
              }, {
                  data: [
                      randomScalingFactor(),
                      randomScalingFactor(),
                      randomScalingFactor(),
                      randomScalingFactor(),
                      randomScalingFactor(),
                  ],
                  backgroundColor: [
                      "#F7464A",
                      "#46BFBD",
                      "#FDB45C",
                      "#949FB1",
                      "#4D5360",
                  ],
                  label: 'Dataset 3'
              }],
              labels: [
                  "Red",
                  "Green",
                  "Yellow",
                  "Grey",
                  "sadsadasd"
              ]
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


      var doughnutOptions = {
	       segmentShowStroke : false
      };
  var ctx = document.getElementById("chart-area").getContext("2d");
  //window.ancestryChart = new Chart(ctx).Doughnut(config, doughnutOptions);
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
      var subpopulations = data.ancestry.sub_populations;
      $("#ancestry-data").html('');
      resetChart();
      loopSubpopulations(subpopulations);
    }
  });
}

function loopSubpopulations(arr) {

  var datasets = [];
  for(var index = 0; index < 3; index++) { //three levels of ancestry data
    datasets[index] = {
      backgroundColor: [],
      data: [],
      label: 'New dataset ' //+ config.data.datasets.length
    };
  }

  for(var i in arr) {
    datasets[0].data.push(arr[i].proportion);
    displaySubpopulations(arr[i]);
    for(var j in arr[i].sub_populations) {
      datasets[1].data.push(arr[i].sub_populations[j].proportion);
      displaySubpopulations(arr[i].sub_populations[j]);
      for(var k in arr[i].sub_populations[j].sub_populations) {
        datasets[2].data.push(arr[i].sub_populations[j].sub_populations[k].proportion);
        displaySubpopulations(arr[i].sub_populations[j].sub_populations[k]);
      }
    }
  }

  for(var dataIndex = 2; dataIndex >= 0; dataIndex--) {
    config.data.datasets.push(datasets[dataIndex]);
  }
  window.ancestryChart.update();
}

function displaySubpopulations(population) {
  if (population !== undefined && population.proportion > 0) { //check if user has this ancestry category
    $("#ancestry-data").append('<div>' + population.label + ': ' + (Math.floor(population.proportion * 1000) / 10) + '%</div>');
  }
}

function randomColor(opacity) {
  return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
}

function randomColorFactor() {
  return Math.round(Math.random() * 255);
}

function resetChart() {
  config.data.datasets = [];
  config.data.labels = [];
}
