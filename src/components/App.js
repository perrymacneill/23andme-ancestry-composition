import React from 'react';
import ThresholdButtonContainer from '../containers/ThresholdButtonContainer';
import ThresholdSliderContainer from '../containers/ThresholdSliderContainer';
import ThresholdNumberContainer from '../containers/ThresholdNumberContainer';
import AncestryContainer from '../containers/AncestryContainer';

const App = () => (
  <div>
    <ThresholdNumberContainer />
    <ThresholdSliderContainer />
    <ThresholdButtonContainer />
    <AncestryContainer />
  </div>
);

export default App;
