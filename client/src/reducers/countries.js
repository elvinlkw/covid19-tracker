import { GET_ALL_COUNTRIES_DATA, COUNTRIES_ERROR } from '../actions/types';

const initialState = {
  countries: null,
  loading: true
}

const countriesReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch(type) {
    case GET_ALL_COUNTRIES_DATA:
      return {
        ...state,
        loading: false,
        countries: payload
      }
    case COUNTRIES_ERROR:
      return {
        ...state,
        loading: false,
        countries: null
      }
    default:
      return state;
  }
}

export default countriesReducer;