const TOTAL_ANCESTRIES = 41;

let colors = [];
for(let i = 0; i < TOTAL_ANCESTRIES; i++) {
  colors[i] = randomColor(0.7);
}

function randomColor(opacity) {
  return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
}

function randomColorFactor() {
  return Math.round(Math.random() * 255);
}

export default colors;
