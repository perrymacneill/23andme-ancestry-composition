import React from 'react';
import Chart from 'chart.js';
import $ from 'jquery';
import {Doughnut} from 'react-chartjs-2';

const AncestryChart = ({ ancestryData }) => (
  <Doughnut data={ancestryData} options={{
    responsive: true,
    legend: {
      position: 'top',
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    },
    title: {
      display: true,
      text: 'Ancestry Breakdown'
    },
    tooltips : {
	enabled: false
    }
  }} />
)

export default AncestryChart;
