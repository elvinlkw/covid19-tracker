import React, { useEffect, useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
import TableHeader from './TableHeader';
import RegionItem from './RegionItem';

const CasesByRegion = () => {
  const { selected_date, saved_regions } = useSelector(state => state.ontario);
  const cases = useSelector(state => state.ontario.cases_by_region);

  const [displayedData, setDisplayData] = useState([]);
  const [fullData, setFullData] = useState([]);

  const [sortedConfig, setSortedConfig] = useState('down');
  const [sortedField, setSortedField] = useState('confirmed_today');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const select_date = selected_date === "Total" ? cases[0].date : selected_date;
    let currData = cases.filter(day => day.date === select_date);

    // Check whether a regions is saved or not
    currData = currData.map(region => {
      if(saved_regions === null) return { ...region, saved: false }
      else {
        const exist = saved_regions.filter(s_reg => s_reg.health_unit_num === region.health_unit_num);
        return { ...region, saved: exist.length > 0 ? true : false }
      }
    });

    setFullData([...currData]);

    if(sortedConfig === 'up') {
      currData.sort((a,b) => a[sortedField] - b[sortedField]);
    } else currData.sort((a,b) => b[sortedField] - a[sortedField]);

    if(filter.length > 0) {
      const data = currData.filter(day => (
        day.health_unit_name.toLowerCase().includes(filter.toLowerCase()) ||
        day.health_unit_num.toString().includes(filter)
      ));
      setDisplayData(data);
    } else setDisplayData(currData);
  }, [selected_date, cases, filter, saved_regions]);

  const sortTable = (sortParam) => {
    // if clicking on already focused column
    if(sortParam === sortedField && sortedConfig === 'up') {
      // @action - Sort by Desc
      setDisplayData(displayedData => displayedData.sort((a,b) => b[sortParam] - a[sortParam]));
      setSortedConfig('down');      
    } else {
      setDisplayData(displayedData => displayedData.sort((a,b) => a[sortParam] - b[sortParam]));
      setSortedConfig('up');;
    }
    setSortedField(sortParam);
  }

  const handleFilterChange = (e) => {
    // Filter through Health Regions and by their Health Unit Number
    const data = fullData.filter(day => (
      day.health_unit_name.toLowerCase().includes(e.target.value.toLowerCase()) ||
      day.health_unit_num.toString().includes(e.target.value)
    ));
    setFilter(e.target.value);
    setDisplayData(data);
  }

  return (
    <Fragment>
      <h3>Cases by Health Regions - {selected_date}</h3>
      {displayedData.length === 0 && filter.length === 0 
        ? (<p style={{marginBottom:'30rem'}}><em>No Data Available for that period</em></p>) 
        : (<Fragment>
        <div className="input-group col-md-3 filter-table">
          <div className="input-group-prepend">
            <span className="input-group-text" id="filter-table"><i className="fas fa-search"></i></span>
          </div>
          <input type="text" className="form-control" aria-describedby="filter-table" value={filter} onChange={handleFilterChange} />
        </div>
        <table className={`table ${filter.length > 0 && 'filtered'}`}>
        <thead>
          <tr className="text-center table-info">
            <TableHeader sortedConfig={sortedConfig} sortedField={sortedField} onSort={sortTable} value='health_unit_num' name="PHU #" />
            <TableHeader style={{textAlign: 'left'}} sortedConfig={sortedConfig} sortedField={sortedField} onSort={sortTable} value='id' name='Health Region' />
            {selected_date !== "Total" && 
            <Fragment>
              <TableHeader sortedConfig={sortedConfig} sortedField={sortedField} onSort={sortTable} value='confirmed_today' name='New Confirmed' />
              <TableHeader sortedConfig={sortedConfig} sortedField={sortedField} onSort={sortTable} value='active_today' name='Active' />
              <TableHeader sortedConfig={sortedConfig} sortedField={sortedField} onSort={sortTable} value='resolved_today' name='Recovered' />
              <TableHeader sortedConfig={sortedConfig} sortedField={sortedField} onSort={sortTable} value='deaths_today' name='Deaths' />
            </Fragment>}
            {selected_date === "Total" &&
            <Fragment>
              <TableHeader sortedConfig={sortedConfig} sortedField={sortedField} onSort={sortTable} value='total_confirmed' name='Total Confirmed' />
              <TableHeader sortedConfig={sortedConfig} sortedField={sortedField} onSort={sortTable} value='total_resolved' name='Recovered' />
              <TableHeader sortedConfig={sortedConfig} sortedField={sortedField} onSort={sortTable} value='total_deaths' name='Deaths' />
            </Fragment>}
            <th style={{userSelect: 'none', cursor: 'pointer'}}>
              <i className="fas fa-star" />
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedData.length > 0 
          ? displayedData.map(region => (
              <RegionItem key={region.id} region={region} />
            ))
          : <tr>
              <td colSpan="100%">
                <p className="no-result">No results found!</p>
              </td>
            </tr>}
        </tbody>
      </table>
      </Fragment>)}
    </Fragment>
  )
}

export default CasesByRegion;