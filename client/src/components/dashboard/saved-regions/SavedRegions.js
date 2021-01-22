import React, { useEffect, useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import TableHeader from '../cases-regions/TableHeader';
import RegionItem from './RegionItem';

const SavedRegions = () => {
  const { selected_date, saved_regions } = useSelector(state => state.ontario);
  const cases = useSelector(state => state.ontario.cases_by_region);

  const [displayRegion, setDisplayRegion] = useState([]);
  const [sortedConfig, setSortedConfig] = useState('down');
  const [sortedField, setSortedField] = useState('confirmed_today');

  useEffect(() => {
    if(saved_regions === null) return;
    // construct list according to selected date
    const select_date = selected_date === "Total" ? cases[0].date : selected_date;
    // @TODO - make curr Data comes from redux as REPETITIVE TASK to CASES BY REGION
    let currData = cases.filter(day => day.date === select_date );

    // Filter Saved Items
    let res = [];
    saved_regions.forEach(region => {
      const exist = currData.filter(reg => reg.health_unit_num === region.health_unit_num);
      res.push(...exist);
    })

    res.sort((a,b) => b.confirmed_today - a.confirmed_today);
    setDisplayRegion(res);
  }, [selected_date, saved_regions, cases]);

  const sortTable = (sortParam) => {
    // if clicking on already focused column
    if(sortParam === sortedField && sortedConfig === 'up') {
      // @action - Sort by Desc
      setDisplayRegion(displayedData => displayedData.sort((a,b) => b[sortParam] - a[sortParam]));
      setSortedConfig('down');      
    } else {
      setDisplayRegion(displayedData => displayedData.sort((a,b) => a[sortParam] - b[sortParam]));
      setSortedConfig('up');;
    }
    setSortedField(sortParam);
  }

  return (
    <Fragment>
      <h3>Cases by Saved Health Regions - {selected_date}</h3>
      {saved_regions === null ?
      <p className="mb-5"><em>You do not have any Saved Health Regions</em></p> :
      <table className={`table filtered'`}>
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
          {displayRegion.map(region => (
            <RegionItem key={region.id} region={region} />
          ))}
        </tbody>
      </table>}
    </Fragment>
  )
}

export default SavedRegions;