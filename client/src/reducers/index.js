import { combineReducers } from 'redux';
// Reducers Imports
import ontario from './ontario/ontario';
import countries from './countries';
import alert from './alert';

export default combineReducers({
  ontario,
  countries,
  alert
});