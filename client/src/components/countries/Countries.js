import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ListCountry from './ListCountry';
import CountryHeader from './CountryHeader';
import Spinner from '../layout/Spinner';
import { getAllCountriesData } from '../../actions/countries';

const Countries = () => {
  const dispatch = useDispatch();
  const { countries, loading } = useSelector(state => state.countries);

  const [countries_data, setCountriesData] = useState([]);
  const [filter, setFilter] = useState();
  const [sortedConfig, setSortedConfig] = useState('up');
  const [sortedField, setSortedField] = useState('country');

  useEffect(() => {
    if(loading) {
      dispatch(getAllCountriesData());
    }

    if(!loading) {
      setCountriesData([...countries]);
    }
  }, [loading]);

  const sortTable = (sortParam) => {
    // if clicking on already focused column
    if(sortParam === 'country') {
      if(sortedField === sortParam && sortedConfig === 'up') {
        setCountriesData(countries_data => countries_data.sort((a,b) => {
          const nameA = a.country.toLowerCase();
          const nameB = b.country.toLowerCase();
          return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
        }));
        setSortedConfig('down');
      } else {
        setCountriesData(countries_data => countries_data.sort((a,b) => {
          const nameA = a.country.toLowerCase();
          const nameB = b.country.toLowerCase();
          return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        }));
        setSortedConfig('up');
      }
    }
    else if(sortParam === sortedField && sortedConfig === 'up') {
      // @action - Sort by Desc
      setCountriesData(countries_data => countries_data.sort((a,b) => b[sortParam] - a[sortParam]));
      setSortedConfig('down');      
    } else {
      setCountriesData(countries_data => countries_data.sort((a,b) => a[sortParam] - b[sortParam]));
      setSortedConfig('up');;
    }
    setSortedField(sortParam);
  }

  const handleFilterChange = (e) => {
    const data = countries.filter(day => (
      day.country.toLowerCase().includes(e.target.value.toLowerCase())
    ));
    setFilter(e.target.value);
    setSortedField('country');
    setSortedConfig('up');
    setCountriesData(data);
  } 

  return loading ? <Spinner /> : (
    <div className="padded">
      <h2 className="mt-4 mb-4">Covid19 By Country</h2>
      <div className="input-group col-md-3 filter-table">
        <div className="input-group-prepend">
          <span className="input-group-text" id="filter-table"><i className="fas fa-search"></i></span>
        </div>
        <input type="text" className="form-control" aria-describedby="filter-table" value={filter} onChange={handleFilterChange} />
      </div>
      <table className="table">
        <thead>
          <CountryHeader sortedConfig={sortedConfig} sortedField={sortedField} onclick={sortTable} />
        </thead>
        <tbody>
          {countries_data.map((country, index) => (
            <ListCountry key={index} country={country} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Countries;