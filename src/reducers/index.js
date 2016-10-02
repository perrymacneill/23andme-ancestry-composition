const defaultState  = {
	datasets: [],
  threshold: 51
};

const ancestryApp = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_ANCESTRY_DATA':
      return Object.assign({}, state, {
        datasets: action.ancestryData
      })
    case 'SET_THRESHOLD_VALUE':
      return Object.assign({}, state, {
        threshold: action.thresholdValue
      })
    default:
      return state
  }
}

export default ancestryApp;
