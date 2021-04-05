import { SUB_SUCCESS, SUB_RESET } from './types';

export const subSuccess = () => {
  return { type: SUB_SUCCESS };
}

export const subReset = () => {
  return { type: SUB_RESET };
}