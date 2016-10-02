import React from 'react';
import { connect } from 'react-redux'
import ThresholdSlider from '../components/ThresholdSlider';
import { setThresholdValue } from '../actions'

const mapStateToProps = (state) => {
  return {
    thresholdValue: state.threshold
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onThresholdSlide: (number) => {
      dispatch(setThresholdValue(number))
    }
  }
}

const ThresholdSliderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThresholdSlider);

export default ThresholdSliderContainer;
