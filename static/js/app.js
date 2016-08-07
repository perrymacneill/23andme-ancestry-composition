$SCRIPT_ROOT = 'http://localhost:5000';

function init(){
  $('#threshold-display').html('<h3>Current threshold: ' + $("#threshold-slider")[0].value + '</h3>');

  $('#submit-button').on('click', function() {
    getAncestry();
  });

  $("#threshold-slider").on('input', function() {
    $('#threshold-display').html('<h3>Current threshold: ' + $("#threshold-slider")[0].value + '</h3>');
  });
}

function getAncestry() {
  $.ajax({
    type: 'POST',
    url: $SCRIPT_ROOT + '/get_ancestry',
    data: {
      'threshold': $('#threshold-slider')[0].value
    },
    success: function(data) {
      window.xxx = data;
      console.log(data);
      var subpopulations = data.ancestry.sub_populations;
      $("#ancestry-data").html('');
      loopSubpopulations(subpopulations);
        }

  });
}

function loopSubpopulations(arr) {
  for(var i in arr) {
    displaySubpopulations(arr[i]);
    for(var j in arr[i].sub_populations) {
      displaySubpopulations(arr[i].sub_populations[j]);
      for(var k in arr[i].sub_populations[j].sub_populations) {
        displaySubpopulations(arr[i].sub_populations[j].sub_populations[k]);
      }
    }
  }
}

function displaySubpopulations(population) {
  if (population !== undefined && population.proportion > 0) { //check if user has this ancestry category
    $("#ancestry-data").append('<div>' + population.label + ': ' + (Math.floor(population.proportion * 1000) / 10) + '%</div>');
  }
}
