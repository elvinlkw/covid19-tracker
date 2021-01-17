import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useSelector } from 'react-redux';

const CasesByRegion = ({ cases }) => {
  const { selected_date } = useSelector(state => state.ontario);
  
  const [regionData, setRegionData] = useState([]);
  const [nextRegionData, setNextRegionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Get Today's Data and sort
    const rData = cases.filter(day => day.FILE_DATE === selected_date);
    setRegionData(rData.sort((a,b) => a._id - b._id));

    // Get Previous Day's Data and sort
    const xData = cases.filter(day => day.FILE_DATE === moment(selected_date).add(-1, 'days').format('MMMM DD, YYYY'));
    setNextRegionData(xData.sort((a,b) => a._id - b._id));

    setLoading(false);
  }, [selected_date, cases]);

  // Handler that calculates the number of active cases
  const getConfirmedCases = (index) => {
    const delta_recovered = regionData[index].RESOLVED_CASES - nextRegionData[index].RESOLVED_CASES;
    const delta_deaths = regionData[index].DEATHS - nextRegionData[index].DEATHS;
    const active = regionData[index].ACTIVE_CASES
    const prev_active = nextRegionData[index].ACTIVE_CASES;
    
    return active - prev_active + delta_recovered + delta_deaths;
  }

  return loading ? (<p>Loading...</p>) : (
    <table className="table">
      <thead>
        <tr className="text-center">
          <th scope="col">PHU #</th>
          <th scope="col" className="text-left">Health Region</th>
          <th scope="col">Confirmed</th>
          <th scope="col">Recovered</th>
          <th scope="col">Deaths</th>
        </tr>
      </thead>
      <tbody>
        {!loading && regionData.length > 0 && regionData.map((region, index) => (
        <tr key={region._id} className="text-center">
          <td>{region.PHU_NUM}</td>
          <td className="text-left">{region.PHU_NAME}</td>
          <td className="text-center">{getConfirmedCases(index)}</td>
          <td>{region.RESOLVED_CASES - nextRegionData[index].RESOLVED_CASES}</td>
          <td>{region.DEATHS - nextRegionData[index].DEATHS}</td>
        </tr>
        ))}
      </tbody>
    </table>
  )
}

CasesByRegion.propTypes = {
  cases: PropTypes.array.isRequired
}

export default CasesByRegion;