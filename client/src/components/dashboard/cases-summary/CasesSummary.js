import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Card from './Card';
import { setSelectedDate, getVaccinations } from '../../../actions/ontario';

const CasesSummary = ({ cases }) => {
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(0);
  const { vaccinations_data, vaccinations_loading, selected_date } = useSelector(state => state.ontario);

  useEffect(() => {
    dispatch(getVaccinations());
    dispatch(setSelectedDate(cases[0].date));
  }, [dispatch, cases]);

  const handleChange = e => {
    const index = e.target.value;
    setSelectedId(parseInt(index));
    if(parseInt(index) !== -1) {
      dispatch(setSelectedDate(cases[index].date));
    } else dispatch(setSelectedDate("Total"));
  }

  const convertToString = num => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div className="mb-4 padded">
      <h1 className="text-center mt-3 mb-3">Cases in Ontario</h1>
      <div className="d-flex justify-content-center">
        <div className="form-group col-md-4">
          <select className="form-control" value={selectedId} onChange={handleChange} >
            <option value={-1}>Total Cases</option>
            {cases.map((day, index) => (
            <option key={day.id} value={index}>{day.date}</option>))}
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
          {selectedId === -1
          ? convertToString(cases[0].total_confirmed)
          : convertToString(cases[selectedId].confirmed_today)}
        </Card>
        <Card
          card={{
            title: 'Recovered',
            text: '# of Cases',
            style: 'border-recovered'
          }}
        >
          {selectedId === -1
          ? convertToString(cases[0].total_resolved)
          : convertToString(cases[selectedId].resolved_today)}
        </Card>
        <Card
          card={{
            title: 'Deaths',
            text: '# of Cases',
            style: 'border-deaths'
          }}
        >
          {selectedId === -1
          ? convertToString(cases[0].total_deaths)
          : convertToString(cases[selectedId].deaths_today)}
        </Card>
        {selected_date !== "Total" && 
        <Card
          card={{
            title: 'Tests Completed',
            text: '# of tests',
            style: 'border-doses'
          }}
        >{convertToString(cases[selectedId].tests_completed)}</Card>}
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