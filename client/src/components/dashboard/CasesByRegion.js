import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Spinner from '../layout/Spinner';
import { useSelector } from 'react-redux';

const CasesByRegion = ({ cases }) => {
  const { selected_date } = useSelector(state => state.ontario);
  
  const [regionData, setRegionData] = useState([]);
  const [sortedConfig, setSortedConfig] = useState('down');
  const [sortedField, setSortedField] = useState('NEW_CASES');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Get Today's Data and sort
    let select_date = selected_date === "Total" ? cases[0].FILE_DATE : selected_date;
    let currData = cases.filter(day => day.FILE_DATE === select_date);
    currData = currData.sort((a,b) => a._id - b._id);

    // Get Previous Day's Data and sort
    let prevData = cases.filter(day => day.FILE_DATE === moment(select_date, "MMMM DD, YYYY").subtract(1, 'days').format('MMMM DD, YYYY'));
    prevData = prevData.sort((a,b) => a._id - b._id);

    let res = [...currData];

    if(selected_date === "Total") {
      res = res.map((day, index) => {
        return { 
          ...day, 
          RESOLVED_CASES: currData[index].RESOLVED_CASES,
          DEATHS: currData[index].DEATHS,
          TOTAL_CASES: currData[index].ACTIVE_CASES + currData[index].RESOLVED_CASES + currData[index].DEATHS
        }
      });
    } else {
      res = res.map((day, index) => {
        const delta_recovered = currData[index].RESOLVED_CASES - prevData[index].RESOLVED_CASES;
        const delta_deaths = currData[index].DEATHS - prevData[index].DEATHS;
        return { 
          ...day, 
          RESOLVED_CASES: delta_recovered,
          DEATHS: delta_deaths,
          NEW_CASES: currData[index].ACTIVE_CASES - prevData[index].ACTIVE_CASES + delta_recovered + delta_deaths,
          TOTAL_CASES: currData[index].ACTIVE_CASES + currData[index].RESOLVED_CASES + currData[index].DEATHS
        }
      });
    }
    
    // Sort according to previous sort
    if(sortedConfig === 'up') {
      res.sort((a,b) => a[sortedField] - b[sortedField]);
    } else {
      res.sort((a,b) => b[sortedField] - a[sortedField]);
    }

    setRegionData(res);
    setLoading(false);
  }, [selected_date, cases, sortedConfig, sortedField]);

  const sortTable = (sortParam) => {
    // if clicking on already focused column
    if(sortParam === sortedField && sortedConfig === 'up') {
      // @action - Sort by Desc
      setRegionData(regionData => regionData.sort((a,b) => b[sortParam] - a[sortParam]));
      setSortedConfig('down');      
    } else {
      setRegionData(regionData => regionData.sort((a,b) => a[sortParam] - b[sortParam]));
      setSortedConfig('up');;
    }
    setSortedField(sortParam);
  }

  return loading ? (<Spinner />) : (
    <Fragment>
      <h3>Cases by Health Regions</h3>
      {!loading && regionData.length === 0 
        ? (<p><em>No Data Available for that period</em></p>) 
        : (<table className="table">
        <thead>
          <tr className="text-center table-info">
            <th scope="col" onClick={() => sortTable('PHU_NUM')} style={tableHeaderStyle}>
              PHU # {sortedField === 'PHU_NUM' && <i className={`fas fa-caret-${sortedConfig}`}></i>}
            </th>
            <th scope="col" className="text-left" onClick={() => sortTable('_id')} style={tableHeaderStyle}>
              Health Region {sortedField === '_id' && <i className={`fas fa-caret-${sortedConfig}`}></i>}
            </th>
            {selected_date !== "Total" && 
            <Fragment>
              <th scope="col" onClick={() => sortTable('NEW_CASES')} style={tableHeaderStyle}>
                New Confirmed {sortedField === 'NEW_CASES' && <i className={`fas fa-caret-${sortedConfig}`}></i>}
              </th>
              <th scope="col" onClick={() => sortTable('ACTIVE_CASES')} style={tableHeaderStyle}>
                Active {sortedField === 'ACTIVE_CASES' && <i className={`fas fa-caret-${sortedConfig}`}></i>}
              </th>
            </Fragment>}
            {selected_date === "Total" &&
            <th scope="col" onClick={() => sortTable('TOTAL_CASES')} style={tableHeaderStyle}>
              Total Confirmed {sortedField === 'TOTAL_CASES' && <i className={`fas fa-caret-${sortedConfig}`}></i>}
            </th>}
            <th scope="col" onClick={() => sortTable('RESOLVED_CASES')} style={tableHeaderStyle}>
              Recovered {sortedField === 'RESOLVED_CASES' && <i className={`fas fa-caret-${sortedConfig}`}></i>}
            </th>
            <th scope="col" onClick={() => sortTable('DEATHS')} style={tableHeaderStyle}>
              Deaths {sortedField === 'DEATHS' && <i className={`fas fa-caret-${sortedConfig}`}></i>}
            </th>
          </tr>
        </thead>
        <tbody>
          {regionData.map(region => (
          <tr key={region._id} className="text-center">
            <td>{region.PHU_NUM}</td>
            <td className="text-left">{region.PHU_NAME}</td>
            {selected_date !== "Total" && 
            <Fragment>
              <td>{region.NEW_CASES}</td>
              <td>{region.ACTIVE_CASES}</td>
            </Fragment>}
            {selected_date === "Total" &&
            <td>{region.TOTAL_CASES}</td>}
            <td>{region.RESOLVED_CASES}</td>
            <td>{region.DEATHS}</td>
          </tr>
          ))}
        </tbody>
      </table>)}
    </Fragment>
  )
}

const tableHeaderStyle = {
  userSelect: 'none',
  cursor: 'pointer'
}

CasesByRegion.propTypes = {
  cases: PropTypes.array.isRequired
}

export default CasesByRegion;