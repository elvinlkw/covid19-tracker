import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Card from './Card';
import { setSelectedDate, getVaccinations } from '../../actions/ontario';

const CasesSummary = ({ cases }) => {
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(0);
  const { vaccinations_data, vaccinations_loading, selected_date } = useSelector(state => state.ontario);

  useEffect(() => {
    dispatch(getVaccinations());
    dispatch(setSelectedDate(cases[0]["Reported Date"]));
  }, [dispatch, cases]);

  const handleChange = e => {
    const index = e.target.value;
    setSelectedId(parseInt(index));
    if(parseInt(index) !== -1) {
      dispatch(setSelectedDate(cases[index]["Reported Date"]));
    } else dispatch(setSelectedDate("Total"));
  }

  const convertToString = num => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
      <div className="row d-flex justify-content-around flex-wrap">
        <Card
          card={{
            title: 'Confirmed',
            text: '# of Cases',
            style: 'border-positive'
          }}
        >
          {selectedId === cases.length-1 
            ? convertToString(cases[selectedId]["Total Cases"])
            : selectedId === -1 
              ? convertToString(cases[0]["Total Cases"])
              : convertToString(cases[selectedId]["Total Cases"] - cases[selectedId+1]["Total Cases"])}
        </Card>
        <Card
          card={{
            title: 'Recovered',
            text: '# of Cases',
            style: 'border-recovered'
          }}
        >
          {selectedId === cases.length-1 
            ? convertToString(cases[selectedId].Resolved)
            : selectedId === -1 
              ? convertToString(cases[0].Resolved)
              : convertToString(cases[selectedId].Resolved - cases[selectedId+1].Resolved)}
        </Card>
        <Card
          card={{
            title: 'Deaths',
            text: '# of Cases',
            style: 'border-deaths'
          }}
        >
          {selectedId === cases.length-1 
              ? convertToString(cases[selectedId].Deaths)
              : selectedId === -1 
                ? convertToString(cases[0].Deaths)
                : convertToString(cases[selectedId].Deaths - cases[selectedId+1].Deaths)}
        </Card>
        {selected_date === "Total" && !vaccinations_loading && vaccinations_data.length > 0 && 
        <Card
          card={{
            title: 'Vaccine Doses Administered',
            text: '# of doses',
            style: 'border-doses'
          }}
        >{vaccinations_data[0].total_doses_administered}</Card>}
        {selected_date === "Total" && !vaccinations_loading && vaccinations_data.length > 0 && 
        <Card
          card={{
            title: 'Vaccinations Completed',
            text: '# of vaccinations',
            style: 'border-vaccines'
          }}
        >{vaccinations_data[0].total_vaccinations_completed}</Card>}
      </div>
    </div>
  )
}

CasesSummary.propTypes = {
  cases: PropTypes.array.isRequired,
}

export default CasesSummary;