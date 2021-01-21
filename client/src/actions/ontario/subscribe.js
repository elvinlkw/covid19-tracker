import { setAlert } from '../alert';
import axios from 'axios';

export const subscribe = ( email ) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try {
    await axios.post('/api/ontario/subscription', { email }, config);
    dispatch(setAlert('Successfully Subscribed for Daily Updates', 'success'));
  } catch (error) {
    const errors = error.response.data.errors;
    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
}

export const unsubscribe = (email) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      email: email
    }
  }
  try {
    await axios.delete('/api/ontario/subscription', config);
    dispatch(setAlert('Successfully Unsubscribed from Daily Updates', 'success'));
  } catch (error) {
    const errors = error.response.data.errors;
    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
}