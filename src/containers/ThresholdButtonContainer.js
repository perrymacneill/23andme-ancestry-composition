import React from 'react';
import { connect } from 'react-redux'
import ThresholdButton from '../components/ThresholdButton';
import { setAncestryDataAsync } from '../actions'

const mapStateToProps = (state) => {
  return {
    thresholdValue: state.threshold
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onThresholdClick: (number) => {
      dispatch(setAncestryDataAsync(number))
    }
  }
}

const ThresholdContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThresholdButton);

export default ThresholdContainer;
