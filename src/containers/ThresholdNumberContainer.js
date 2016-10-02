import React from 'react';
import { connect } from 'react-redux'
import ThresholdNumber from '../components/ThresholdNumber';


const mapStateToProps = (state) => {
  return {
    thresholdValue: state.threshold
  }
}

const ThresholdNumberContainer = connect(
  mapStateToProps
)(ThresholdNumber);

export default ThresholdNumberContainer;
