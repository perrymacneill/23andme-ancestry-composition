import React from 'react';
import { Button } from 'react-mdl';

const ThresholdButton = ({ thresholdValue, onThresholdClick }) => (
  <Button raised accent ripple id={'submit-button'} onClick={() => onThresholdClick(thresholdValue)}>Submit</Button>
)
export default ThresholdButton;
