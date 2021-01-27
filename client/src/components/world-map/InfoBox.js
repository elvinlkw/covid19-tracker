import React from 'react';
import moment from 'moment';

const InfoBox = ({
  info: {
    country,
    cases,
    deaths,
    tests,
    population,
    updated,
    continent,
    countryInfo: {
      flag
    }
  },
  onclick
}) => {
  const convertToString = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <div className="location-info">
      <div>
        <h2>{country}</h2>
        <img src={flag} alt="Flag"/>
      </div>
      <ul>
        <li>Continent: <strong>{continent}</strong></li>
        <li>Population: <strong>{convertToString(population)}</strong></li>
        <li>Total Covid19 Cases: <strong>{convertToString(cases)}</strong></li>
        <li>Total Deaths: <strong>{convertToString(deaths)}</strong></li>
        <li>Total Tests Performed: <strong>{convertToString(tests)}</strong></li>
        <li>Total Population Infected: <strong>{((cases/population)*100).toFixed(2)} %</strong></li>
        <li>Positivity Rate: <strong>{((cases/tests)*100).toFixed(2)} %</strong></li>
        <li>Last Updated: <strong>{moment(updated).format('MM/DD/YYYY')}</strong></li>
      </ul>
      <button type="button" className="btn btn-danger" onClick={onclick}>Close</button>
    </div>
  )
}

export default InfoBox;