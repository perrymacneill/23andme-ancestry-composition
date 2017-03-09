import $ from 'jquery';
import colors from '../colors';
const $SCRIPT_ROOT = 'http://bioinformatics.party';
let colorCounter = 0;
const INNER_LAYER = 0, MIDDLE_LAYER = 1, OUTER_LAYER = 2;

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
      let subpopulations = data.ancestry;
      $("#ancestry-data").html('');
      dispatch(setAncestryData(loopSubpopulations(subpopulations)));
      }
    });
  };
}

function loopSubpopulations(ancestry) {
  let dataset = [];
  for (let i = INNER_LAYER; i <= OUTER_LAYER; i++) {
    dataset[i] = {
      backgroundColor: [],
      data: []
    };
  }

  for (let i in ancestry.sub_populations) {
    let currentPopulation = ancestry.sub_populations[i];
    checkSubpopulations(currentPopulation, INNER_LAYER, dataset);
    for (let j in ancestry.sub_populations[i].sub_populations) {
      let currentPopulation = ancestry.sub_populations[i].sub_populations[j];
      checkSubpopulations(currentPopulation, MIDDLE_LAYER, dataset);
      for (let k in ancestry.sub_populations[i].sub_populations[j].sub_populations) {
        let currentPopulation = ancestry.sub_populations[i].sub_populations[j].sub_populations[k];
        checkSubpopulations(currentPopulation, OUTER_LAYER, dataset);
      }
    }
  }

  //check total unassigned
  if(ancestry.unassigned > 0) {
    checkUnassigned(ancestry.unassigned, dataset);
  }

  //return dataset to dispatch
  let newDataset = [];
  for (let i = dataset.length - 1; i >= 0; i--){
    newDataset.push(dataset[i]);
  }
  colorCounter = 0;
  return newDataset;
}

function checkUnassigned(unassigned, dataset) {
  let color = 'rgba(0,0,0,0.7)';
  for(let i = 0; i < dataset.length; i++) {
    dataset[i].data.push(unassigned);
    dataset[i].backgroundColor.push(color);
  }
  displaySubpopulations('Unassigned', unassigned, 'layer-0', color);
}

function checkSubpopulations(currentPopulation, layer, dataset) {
  if(currentPopulation.proportion > 0) {
    let currentColor = colors[colorCounter];
    dataset[layer].data.push(currentPopulation.proportion);
    dataset[layer].backgroundColor.push(currentColor);
    //special case need to add proportion to third layer because no sub_populations exist
    if(currentPopulation.sub_populations === undefined && layer <= 1) {
      dataset[OUTER_LAYER].data.push(currentPopulation.proportion);
      dataset[OUTER_LAYER].backgroundColor.push(currentColor);
    }
    displaySubpopulations(currentPopulation.label, currentPopulation.proportion, `layer-${layer}`, currentColor);
    colorCounter++;
  }

  if(currentPopulation.unassigned > 0) {
    let currentColor = colors[colorCounter];
    dataset[layer+1].data.push(currentPopulation.unassigned);
    //special case need to add unassigned to third layer because no sub_populations exist
    if(layer === 0) {
      dataset[OUTER_LAYER].data.push(currentPopulation.unassigned);
      dataset[OUTER_LAYER].backgroundColor.push(currentColor);
    }
    dataset[layer+1].backgroundColor.push(currentColor);
    displaySubpopulations("Broadly " + currentPopulation.label, currentPopulation.unassigned, `layer-${layer+1}`, currentColor);
    colorCounter++;
  }
}

function displaySubpopulations(label, proportion, layerLevel, color) {
  $("#ancestry-data").append(`<div class=${layerLevel}><span style=color:${color};>⬤</span>` + label + ': ' + (Math.round(proportion * 100 * 1000)/1000) + '%</div>');
}
