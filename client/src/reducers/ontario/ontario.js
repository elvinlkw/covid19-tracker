import {
  GET_ALL_CASES,
  GET_CASES_BY_REGION,
  GET_VACCINATIONS,
  SET_SELECTED_DATE,
  CLEAR_SELECTED_DATE,
  SET_SAVED_REGIONS,
  REMOVE_SAVED_REGION,
  ADD_SAVED_REGION
} from '../../actions/types';

const initialState = {
  cases: null,
  loading: true,
  cases_by_region: null,
  loading_region: true,
  saved_regions: JSON.parse(localStorage.getItem('saved_regions')),
  selected_date: null,
  vaccinations_data: null,
  vaccinations_loading: true,
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
    case SET_SAVED_REGIONS:
      return {
        ...state,
        saved_regions: payload
      }
    case ADD_SAVED_REGION:
      const newObj = state.saved_regions ? [...state.saved_regions, payload] : [payload];
      localStorage.setItem('saved_regions', JSON.stringify(newObj));
      return {
        ...state,
        saved_regions: newObj
      }
    case REMOVE_SAVED_REGION:
      const arr = state.saved_regions.filter(region => region.health_unit_num !== payload);
      localStorage.setItem('saved_regions', JSON.stringify(arr));
      return {
        ...state,
        saved_regions: arr
      }
    case GET_VACCINATIONS:
      return {
        ...state,
        vaccinations_data: payload,
        vaccinations_loading: false
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