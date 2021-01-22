import axios from 'axios';
import moment from 'moment';
import {
  GET_ALL_CASES,
  GET_CASES_BY_REGION,
  GET_VACCINATIONS,
  SET_SELECTED_DATE,
  CLEAR_SELECTED_DATE,
  ADD_SAVED_REGION,
  REMOVE_SAVED_REGION
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
    
    // Create new result
    let response = [];
    for(let i = 0; i < cases.length; i++) {
      // Variable definition
      let resolved_today, deaths_today, confirmed_today;
      const date = moment(cases[i]["Reported Date"], "YYYY-MM-DD").format('MMMM DD, YYYY');
      const percent_positivity = cases[i]["Percent positive tests in last day"];
      const tests_completed = cases[i]["Total tests completed in the last day"] === null ? 0 : cases[i]["Total tests completed in the last day"];
      const id = cases[i]._id;
      const total_resolved = cases[i].Resolved === null ? 0 : cases[i].Resolved;
      const total_deaths = cases[i].Deaths === null ? 0 : cases[i].Deaths;
      const total_confirmed = cases[i]["Total Cases"] === null ? 0 : cases[i]["Total Cases"];

      if(i !== cases.length - 1) {
        resolved_today = total_resolved - cases[i+1].Resolved;
        deaths_today = total_deaths - cases[i+1].Deaths;
        confirmed_today = total_confirmed - cases[i+1]["Total Cases"];
      } else {
        resolved_today = total_resolved;
        deaths_today = total_deaths;
        confirmed_today = total_confirmed;
      }
      const newObj = {
        resolved_today,
        deaths_today,
        confirmed_today,
        total_resolved,
        total_deaths,
        total_confirmed,
        date,
        percent_positivity,
        tests_completed,
        id
      }
      response.push(newObj);
    }

    dispatch({
      type: GET_ALL_CASES,
      payload: response
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
    // Sort Descending First
    cases = cases.sort((a,b) => {
      if(a.FILE_DATE === b.FILE_DATE) {        
        return a._id - b._id;
      }
      return b.FILE_DATE > a.FILE_DATE ? 1 : -1;
    });

    // Build response;
    let response = [];
    for(let i = 0; i < cases.length; i++) {
      const cutoff = cases.length-34;
      // Variable Definition
      const id = cases[i]._id;
      const date = moment(cases[i].FILE_DATE, "YYYYMMDD").format('MMMM DD, YYYY');
      const health_unit_name = cases[i].PHU_NAME;
      const health_unit_num = cases[i].PHU_NUM;

      const total_deaths = cases[i].DEATHS;
      const total_resolved = cases[i].RESOLVED_CASES;
      const total_confirmed = cases[i].ACTIVE_CASES + total_deaths + total_resolved;
      
      const active_today = cases[i].ACTIVE_CASES;
      const resolved_today = i < cutoff ? cases[i].RESOLVED_CASES - cases[i+34].RESOLVED_CASES : cases[i].RESOLVED_CASES;
      const deaths_today = i < cutoff ? cases[i].DEATHS - cases[i+34].DEATHS : "_";
      const confirmed_today = i < cutoff ? (cases[i].ACTIVE_CASES - cases[i+34].ACTIVE_CASES + resolved_today + deaths_today) : "_";
      
      const newObj = {
        date,
        id,
        health_unit_name,
        health_unit_num,
        total_deaths,
        total_confirmed,
        total_resolved,
        confirmed_today,
        resolved_today,
        deaths_today,
        active_today,
      }
      response.push(newObj);
    }
    dispatch({
      type: GET_CASES_BY_REGION,
      payload: response
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

// Add Saved Region
export const addSavedRegion = region => dispatch => {
  dispatch({
    type: ADD_SAVED_REGION,
    payload: region
  });
}

// Remove Saved Region
export const removeSavedRegion = phu_num => dispatch => {
  dispatch({
    type: REMOVE_SAVED_REGION,
    payload: phu_num
  });
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