import $ from 'jquery';
import colors from '../colors';
const $SCRIPT_ROOT = 'http://localhost:5000';

export const setAncestryData = (ancestryData) => {
  return {
    type: 'SET_ANCESTRY_DATA',
    ancestryData
  }
}

export const setThresholdValue = (thresholdValue) => {
  return {
    type: 'SET_THRESHOLD_VALUE',
    thresholdValue
  }
}

export function setAncestryDataAsync(number) {
  return dispatch => {
      $.ajax({
        type: 'POST',
        url: $SCRIPT_ROOT + '/get_ancestry',
        data: {
          'threshold': number
        },
        success: function(data) {
          console.log(data);
          let subpopulations = data.ancestry.sub_populations;
          $("#ancestry-data").html('');
          dispatch(setAncestryData(loopSubpopulations(subpopulations)));
        }
      });
  };
}

function loopSubpopulations(arr) {
  let dataset = [];
  for (let i = 0; i < 3; i++) { //three levels of ancestry data
    dataset[i] = {
      backgroundColor: [],
      data: []
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
  let newDataset = [];
  for (let i = 2; i >= 0; i--) {
    for (let j = 0, k = 1; j < dataset[i].data.length; j++, k++) {
      dataset[i].backgroundColor[j] = colors[colorCounter];
      colorCounter++;
    }
    newDataset.push(dataset[i]);
  }
  return newDataset;
}

function displaySubpopulations(population) {
  if (population !== undefined && population.proportion > 0) { //check if user has this ancestry category
    $("#ancestry-data").append('<div>' + population.label + ': ' + (Math.floor(population.proportion * 1000) / 10) + '%</div>');
  }
}
