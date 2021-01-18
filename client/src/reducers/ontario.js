import {
  GET_ALL_CASES,
  GET_CASES_BY_REGION,
  SET_SELECTED_DATE,
  CLEAR_SELECTED_DATE
} from '../actions/types';

const initialState = {
  cases: null,
  loading: true,
  cases_by_region: null,
  loading_region: true,
  selected_date: null
}

const ontarioReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch(type) {
    case GET_ALL_CASES:
      return {
        ...state,
        cases: payload,
        loading: false
      }
    case GET_CASES_BY_REGION:
      return {
        ...state,
        cases_by_region: payload,
        loading_region: false
      }
    case SET_SELECTED_DATE:
      return {
        ...state,
        selected_date: payload
      }
    case CLEAR_SELECTED_DATE:
      return {
        ...state,
        selected_date: null
      }
    default:
      return state;
  }
}

export default ontarioReducer;