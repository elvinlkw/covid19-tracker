import { GET_ALL_COUNTRIES_DATA, COUNTRIES_ERROR } from './types';
import axios from 'axios';
import { setAlert } from './alert';

export const getAllCountriesData = () => async dispatch => {
  try {
    const res = await axios.get('/api/countries/all');
    dispatch({
      type: GET_ALL_COUNTRIES_DATA,
      payload: res.data
    });
  } catch (error) {
    console.error(error);
    dispatch({ type: COUNTRIES_ERROR });
    dispatch(setAlert('An Error Occurred. Try to Refresh the page.', 'danger'));
  }
}