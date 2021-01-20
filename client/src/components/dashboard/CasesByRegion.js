import React, { useEffect, useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import TableHeader from './TableHeader';

const CasesByRegion = () => {
  const { selected_date } = useSelector(state => state.ontario);
  const cases = useSelector(state => state.ontario.cases_by_region);

  const [displayedData, setDisplayData] = useState([]);
  const [fullData, setFullData] = useState([]);

  const [sortedConfig, setSortedConfig] = useState('down');
  const [sortedField, setSortedField] = useState('confirmed_today');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const select_date = selected_date === "Total" ? moment().format('MMMM DD, YYYY') : selected_date;
    const currData = cases.filter(day => day.date === select_date);
    // sort by descing on confirmed today;
    currData.sort((a,b) => b.confirmed_today - a.confirmed_today);

    setFullData([...currData]);

    if(filter.length > 0) {
      const data = currData.filter(day => (
        day.health_unit_name.toLowerCase().includes(filter.toLowerCase()) ||
        day.health_unit_num.toString().includes(filter)
      ));
      setDisplayData(data);
    } else setDisplayData(currData);
  }, [selected_date, cases, filter]);

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
        ? (<p><em>No Data Available for that period</em></p>) 
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
            </Fragment>}
            {selected_date === "Total" &&
            <TableHeader sortedConfig={sortedConfig} sortedField={sortedField} onSort={sortTable} value='total_confirmed' name='Total Confirmed' />}
            <TableHeader sortedConfig={sortedConfig} sortedField={sortedField} onSort={sortTable} value='total_resolved' name='Recovered' />
            <TableHeader sortedConfig={sortedConfig} sortedField={sortedField} onSort={sortTable} value='total_deaths' name='Deaths' />
          </tr>
        </thead>
        <tbody>
          {displayedData.map(region => (
          <tr key={region.id} className="text-center">
            <td>{region.health_unit_num}</td>
            <td className="text-left">{region.health_unit_name}</td>
            {selected_date !== "Total" && 
            <Fragment>
              <td>{region.confirmed_today}</td>
              <td>{region.active_today}</td>
            </Fragment>}
            {selected_date === "Total" &&
            <td>{region.total_confirmed}</td>}
            <td>{region.total_resolved}</td>
            <td>{region.total_deaths}</td>
          </tr>
          ))}
        </tbody>
      </table>
      </Fragment>)}
    </Fragment>
  )
}

export default CasesByRegion;