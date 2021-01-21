import { 
  SET_ALERT,
  REMOVE_ALERT
} from './types';
import { v4 as uuidv4 } from 'uuid';

export const setAlert = (message, type, timeout=3000) => dispatch => {
  const newAlert = {
    id: uuidv4(),
    message,
    type
  };

  dispatch({ type: SET_ALERT, payload: newAlert });

  setTimeout(() => {
    dispatch({ type: REMOVE_ALERT, payload: newAlert.id });
  }, timeout);
}