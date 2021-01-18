import axios from 'axios';
import moment from 'moment';
import {
  GET_ALL_CASES,
  GET_CASES_BY_REGION,
  GET_VACCINATIONS,
  SET_SELECTED_DATE,
  CLEAR_SELECTED_DATE,
} from './types';

// Get all cases
export const getAllCases = () => async dispatch => {
  try {
    const config = {
      params: {
        resource: "all"
      }
    }
    const res = await axios.get('/api/ontario', config);
    let cases = res.data;
    cases = cases.map(day => ({ ...day, "Reported Date": new moment(day["Reported Date"]) }));
    // Sort Descending First
    cases = cases.sort((a,b) => (b["Reported Date"] - a["Reported Date"]));
    cases = cases.map(day => ({ ...day, "Reported Date": moment(day["Reported Date"]).format('MMMM DD, YYYY') }));
    dispatch({
      type: GET_ALL_CASES,
      payload: cases
    });
  } catch (error) {
    console.log(error);
  }
}

// Get all the cases by each regions
export const getOntarioCasesByRegion = () => async dispatch => {
  try {
    const config = {
      params: {
        resource: "region"
      }
    }
    const res = await axios.get('/api/ontario', config);

    let cases = res.data;
    cases = cases.map(day => ({ ...day, FILE_DATE: new moment(day.FILE_DATE, "YYYYMMDD") }));
    // Sort Descending First
    cases = cases.sort((a,b) => (b.FILE_DATE - a.FILE_DATE));

    cases = cases.map(day => ({ ...day, FILE_DATE: moment(day.FILE_DATE, "YYYYMMDD").format('MMMM DD, YYYY') }));

    dispatch({
      type: GET_CASES_BY_REGION,
      payload: cases
    });
  } catch (error) {
    console.log(error);
  }
}

// Get Vaccinations Data
export const getVaccinations = () => async dispatch => {
  try {
    const config = {
      params: {
        resource: "vaccinations"
      }
    }
    const res = await axios.get('/api/ontario', config);

    let cases = res.data;
    cases = cases.map(day => ({ ...day, report_date: new moment(day.report_date) }));
    // Sort Descending First
    cases = cases.sort((a,b) => (b.report_date - a.report_date));
    cases = cases.map(day => (
      { 
        ...day, 
        report_date: moment(day.report_date).format('MMMM DD, YYYY'),
        total_doses_administered: day.total_doses_administered,
        total_vaccinations_completed: day.total_vaccinations_completed
      }
    ));
    dispatch({
      type: GET_VACCINATIONS,
      payload: cases
    });
  } catch (error) {
    console.log(error);
  }
}

// Set Selected Date
export const setSelectedDate = date => dispatch => {
  dispatch({
    type: SET_SELECTED_DATE,
    payload: date
  });
}

// Clear Selected Date
export const clearSelectedDate = () => dispatch => {
  dispatch({ type: CLEAR_SELECTED_DATE });
}