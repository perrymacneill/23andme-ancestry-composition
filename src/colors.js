export const colors = Array(41).fill(randomColor(0.7));

function randomColor(opacity) {
  return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
}

function randomColorFactor() {
  return Math.round(Math.random() * 255);
}
