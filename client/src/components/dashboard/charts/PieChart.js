import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

const PieChart = () => {
  const { cases_by_region, cases } = useSelector(state => state.ontario);
  const today_cases = cases_by_region.slice(0, 34);
  const total = cases[0].total_confirmed;
  const labels = today_cases.map(region => region.health_unit_name);
  const datasets = today_cases.map(region => Math.round((region.total_confirmed/total)*100*100) / 100);

  const data = {
    labels,
    datasets: [
      {
        label: '% Cases Per Region',
        data: datasets,
        backgroundColor: datasets.map(() => `rgba(${Math.floor(Math.random() * 255) + 1}, ${Math.floor(Math.random() * 255) + 1}, ${Math.floor(Math.random() * 255) + 1}, 1)`),
        borderColor: datasets.map(() => `rgba(${Math.floor(Math.random() * 255) + 1}, ${Math.floor(Math.random() * 255) + 1}, ${Math.floor(Math.random() * 255) + 1}, 1)`),
        borderWidth: 1
      },
    ],
  }

  return (
    <div style={{ marginBottom: "5rem" }}>
      <h3 className="text-center">Breakdown of Covid19 Cases in each Public Health Region</h3>
      <Pie data={data} />
    </div>
  )
}

export default PieChart;