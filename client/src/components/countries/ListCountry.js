import React from 'react';
import moment from 'moment';

const ListCountry = ({
  country: {
    countryInfo: {
      flag
    },
    country,
    population,
    updated,
    todayCases,
    todayRecovered,
    todayDeaths,
    cases,
    recovered,
    deaths
  }
}) => {

  const convertToString = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <tr className="text-center">
      <td><img style={{width: '30px'}} src={flag} alt="Country Flag"/></td>
      <td className="text-left">{country}</td>
      <td>{moment(updated).format('MM-DD-YYYY')}</td>
      <td>{convertToString(population)}</td>
      <td>{convertToString(todayCases)}</td>
      <td>{convertToString(todayRecovered)}</td>
      <td>{convertToString(todayDeaths)}</td>
      <td>{convertToString(cases)}</td>
      <td>{convertToString(recovered)}</td>
      <td>{convertToString(deaths)}</td>
    </tr>
  )
}

export default ListCountry
