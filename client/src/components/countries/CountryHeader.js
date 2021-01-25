import React from 'react'

const CountryHeader = ({ onclick, sortedField, sortedConfig }) => {
  return (
    <tr className="text-center" style={{cursor: 'pointer', userSelect:'none'}}>
      <th scope="col">Flag</th>
      <th scope="col">
        <span style={{justifyContent:'start'}} onClick={() => onclick('country')}>
          Name
          {sortedField === 'country' && <i className={`fas fa-caret-${sortedConfig}`}/>}
        </span>
      </th>
      <th scope="col">
        <span onClick={() => onclick('updated')}>
          Last Updated
          {sortedField === 'updated' && <i className={`fas fa-caret-${sortedConfig}`}/>}
        </span>
      </th>
      <th scope="col">
        <span onClick={() => onclick('population')}>
          Population
          {sortedField === 'population' && <i className={`fas fa-caret-${sortedConfig}`}/>}
        </span>
      </th>
      <th scope="col">
        <span onClick={() => onclick('todayCases')}>
          Confirmed
          {sortedField === 'todayCases' && <i className={`fas fa-caret-${sortedConfig}`}/>}
        </span>
      </th>
      <th scope="col">
        <span onClick={() => onclick('todayRecovered')}>
          Recovered
          {sortedField === 'todayRecovered' && <i className={`fas fa-caret-${sortedConfig}`}/>}
        </span>
      </th>
      <th scope="col">
        <span onClick={() => onclick('todayDeaths')}>
          Deaths
          {sortedField === 'todayDeaths' && <i className={`fas fa-caret-${sortedConfig}`}/>}
        </span>
      </th>
      <th scope="col">
        <span onClick={() => onclick('cases')}>
          Total Confirmed
          {sortedField === 'cases' && <i className={`fas fa-caret-${sortedConfig}`}/>}
        </span>
      </th>
      <th scope="col">
        <span onClick={() => onclick('recovered')}>
          Total Recovered
          {sortedField === 'recovered' && <i className={`fas fa-caret-${sortedConfig}`}/>}
        </span>
      </th>
      <th scope="col">
        <span onClick={() => onclick('deaths')}>
          Total Deaths
          {sortedField === 'deaths' && <i className={`fas fa-caret-${sortedConfig}`}/>}
        </span>
      </th>
    </tr>
  )
}

export default CountryHeader
