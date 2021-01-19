import React from 'react';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const TotalChart = ({ filter }) => {
  const { cases } = useSelector(state => state.ontario);
  const endIndex = filter === -1 ? cases.length : filter;
  const dates = cases.slice(0, endIndex).map(day => day.date).reverse();
  const confirmed = cases.slice(0, endIndex).map(day => day.total_confirmed).reverse();
  const width = window.screen.width/2;
  const height = window.screen.height/2;
  const data = {
    labels: dates,
    datasets: [
      {
        label: '# of Cases',
        data: confirmed,
        fill: false,
        backgroundColor: '#026aa4',
        borderColor: 'rgba(29, 160, 231, 0.4)',
      },
    ],
  }
  
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }
  return (
    <div>
      <h3 className="text-center">Total Cases</h3>
      <Line data={data} options={options} width={width} height={height} />
    </div>
  )
}

TotalChart.propTypes = {
  filter: PropTypes.number.isRequired
}

export default TotalChart;