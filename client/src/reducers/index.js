import { combineReducers } from 'redux';
// Reducers Imports
import ontario from './ontario/ontario';
import countries from './countries';
import alert from './alert';
import subscribe from './subscribe';

export default combineReducers({
  ontario,
  countries,
  alert,
  subscribe
});