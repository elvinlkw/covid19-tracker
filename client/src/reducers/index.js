import { combineReducers } from 'redux';
// Reducers Imports
import ontario from './ontario/ontario';
import alert from './alert';

export default combineReducers({
  ontario,
  alert
});