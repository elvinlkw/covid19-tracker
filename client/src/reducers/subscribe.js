import { SUB_SUCCESS, SUB_RESET } from '../actions/types';

const subscribe = (state = false, action) => {
  const { type } = action;
  switch(type) {
    case SUB_SUCCESS:
      return state = true;
    case SUB_RESET:
      return state = false;
    default:
      return state;
  }
}

export default subscribe;