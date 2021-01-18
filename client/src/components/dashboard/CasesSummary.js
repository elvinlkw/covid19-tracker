import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { setSelectedDate } from '../../actions/ontario';

const CasesSummary = ({ cases }) => {
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(0);

  useEffect(() => {
    dispatch(setSelectedDate(cases[0]["Reported Date"]));
  }, [dispatch, cases]);

  const handleChange = e => {
    const index = e.target.value;
    setSelectedId(parseInt(index));
    if(parseInt(index) !== -1) {
      dispatch(setSelectedDate(cases[index]["Reported Date"]));
    } else dispatch(setSelectedDate("Total"));
  }

  return (
    <div className="mt-5 mb-5">
      <div className="d-flex justify-content-center">
        <div className="form-group col-md-4">
          <select className="form-control" value={selectedId} onChange={handleChange} >
            <option value={-1}>Total Cases</option>
            {cases.map((day, index) => (
            <option key={day._id} value={index}>{day["Reported Date"]}</option>))}
          </select>
        </div>
      </div>
      <div className="row d-flex justify-content-between">
        <div className="card col-md-3 border-positive">
          <div className="card-body text-center">
            <h5 className="card-title">Confirmed</h5>
            <p className="card-text"># of cases:</p>
            <h3 className="card-title">
              {selectedId === cases.length-1 
                ? cases[selectedId]["Total Cases"] 
                : selectedId === -1 
                  ? cases[0]["Total Cases"] 
                  : cases[selectedId]["Total Cases"] - cases[selectedId+1]["Total Cases"]}
            </h3>
          </div>
        </div>
        <div className="card col-md-3 border-recovered">
          <div className="card-body text-center">
            <h5 className="card-title">Recovered</h5>
            <p className="card-text"># of cases:</p>
            <h3 className="card-title">
            {selectedId === cases.length-1 
              ? cases[selectedId].Resolved 
              : selectedId === -1 
                ? cases[0].Resolved
                : cases[selectedId].Resolved - cases[selectedId+1].Resolved}
            </h3>
          </div>
        </div>
        <div className="card col-md-3 border-deaths">
          <div className="card-body text-center">
            <h5 className="card-title">Deaths</h5>
            <p className="card-text"># of cases:</p>
            <h3 className="card-title">
              {selectedId === cases.length-1 
              ? cases[selectedId].Deaths 
              : selectedId === -1 
                ? cases[0].Deaths
                : cases[selectedId].Deaths - cases[selectedId+1].Deaths}
            </h3>
          </div>
        </div>
      </div>
    </div>
  )
}

CasesSummary.propTypes = {
  cases: PropTypes.array.isRequired,
}

export default CasesSummary;