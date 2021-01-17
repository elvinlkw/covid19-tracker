import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useSelector } from 'react-redux';

const CasesByRegion = ({ cases }) => {
  const { selected_date } = useSelector(state => state.ontario);
  
  const [regionData, setRegionData] = useState([]);
  const [sortedConfig, setSortedConfig] = useState('up');
  const [sortedField, setSortedField] = useState('_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Get Today's Data and sort
    let currData = [];
    let prevData = [];
    currData = cases.filter(day => day.FILE_DATE === selected_date);
    currData = currData.sort((a,b) => a._id - b._id);

    // Get Previous Day's Data and sort
    prevData = cases.filter(day => day.FILE_DATE === moment(selected_date, "MMMM DD, YYYY").subtract(1, 'days').format('MMMM DD, YYYY'));
    prevData = prevData.sort((a,b) => a._id - b._id);

    console.log(currData);
    console.log(prevData);

    const res = [...currData];

    if(selected_date !== null) {
      // Build Case
      for(let i = 0; i < 34; i++) {
        res[i].RESOLVED_CASES = currData[i].RESOLVED_CASES - prevData[i].RESOLVED_CASES;
        res[i].DEATHS = currData[i].DEATHS - prevData[i].DEATHS;
        res[i].ACTIVE_CASES = currData[i].ACTIVE_CASES - prevData[i].ACTIVE_CASES + currData[i].RESOLVED_CASES + currData[i].DEATHS;
      }
    }
    setRegionData(res);

    setLoading(false);
  }, [selected_date, cases]);

  const sortTable = (sortParam) => {
    if(sortParam === sortedField) {
      if(sortedConfig === 'up') {
        // @action - Sort by Desc
        setRegionData(regionData => regionData.sort((a,b) => b[sortParam] - a[sortParam]));
        setSortedConfig('down');
      } else {
        // @action - Sort by Asc
        setRegionData(regionData => regionData.sort((a,b) => a[sortParam] - b[sortParam]));
        setSortedConfig('up');
      }
    } else {
      setRegionData(regionData => regionData.sort((a,b) => a[sortParam] - b[sortParam]));
      setSortedConfig('up');;
    }
    setSortedField(sortParam);
  }

  return loading ? (<p>Loading...</p>) : (
    <table className="table">
      <thead>
        <tr className="text-center table-info">
          <th scope="col" onClick={() => sortTable('PHU_NUM')} style={tableHeaderStyle}>
            PHU # {sortedField === 'PHU_NUM' && <i className={`fas fa-caret-${sortedConfig}`}></i>}
          </th>
          <th scope="col" className="text-left" onClick={() => sortTable('_id')} style={tableHeaderStyle}>
            Health Region {sortedField === '_id' && <i className={`fas fa-caret-${sortedConfig}`}></i>}
          </th>
          <th scope="col" onClick={() => sortTable('ACTIVE_CASES')} style={tableHeaderStyle}>
            Confirmed {sortedField === 'ACTIVE_CASES' && <i className={`fas fa-caret-${sortedConfig}`}></i>}
          </th>
          <th scope="col" onClick={() => sortTable('RESOLVED_CASES')} style={tableHeaderStyle}>
            Recovered {sortedField === 'RESOLVED_CASES' && <i className={`fas fa-caret-${sortedConfig}`}></i>}
          </th>
          <th scope="col" onClick={() => sortTable('DEATHS')} style={tableHeaderStyle}>
            Deaths {sortedField === 'DEATHS' && <i className={`fas fa-caret-${sortedConfig}`}></i>}
          </th>
        </tr>
      </thead>
      <tbody>
        {!loading && regionData.length > 0 && regionData.map(region => (
        <tr key={region._id} className="text-center">
          <td>{region.PHU_NUM}</td>
          <td className="text-left">{region.PHU_NAME}</td>
          <td className="text-center">{region.ACTIVE_CASES}</td>
          <td>{region.RESOLVED_CASES}</td>
          <td>{region.DEATHS}</td>
        </tr>
        ))}
      </tbody>
    </table>
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