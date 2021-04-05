import { SUB_SUCCESS, SUB_RESET } from '../types';
import { setAlert } from '../alert';
import axios from 'axios';

export const subscribe = ( email, setEmail ) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try {
    await axios.post('/api/ontario/subscription', { email }, config);
    dispatch(setAlert('Successfully Subscribed for Daily Updates', 'success'));
    setEmail('');
    window.scrollTo(0,0);
  } catch (error) {
    const errors = error.response.data.errors;
    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    window.scrollTo(0,0);
  }
}

export const unsubscribe = (email, token) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      email: email,
      token: token
    }
  }
  try {
    await axios.delete('/api/ontario/subscription', config);
    dispatch(setAlert('Successfully Unsubscribed from Daily Updates', 'success'));
    dispatch(subSuccess());
  } catch (error) {
    const errors = error.response.data.errors;
    console.log(error.response.data);
    if(errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
}

export const subSuccess = () => {
  return { type: SUB_SUCCESS };
}

export const subReset = () => {
  return { type: SUB_RESET };
}