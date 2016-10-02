import React from 'react';
import {Slider} from 'react-mdl';
import '../../node_modules/react-mdl/extra/material.js';

class ThresholdSlider extends React.Component {
  constructor(props) {
    super(props);

    this.handleSlide = this.handleSlide.bind(this);
  }

  handleSlide(event) {
    this.props.onThresholdSlide(event.target.value);
  }

  render() {
    return (
      <div>
        <span style={{float: 'left'}}>◀ Speculative</span>
        <span style={{float: 'right'}}>Conservative ▶</span>
        <Slider onChange={this.handleSlide} min={51} max={99} defaultValue={this.props.thresholdValue} />
      </div>
    );
  }
}

export default ThresholdSlider;
