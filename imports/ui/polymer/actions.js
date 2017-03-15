import { SET_TOAST, SET_ERROR, SET_ROUTE } from './action-types';

export const setToast = (text, duration = 4000) => ({
  type: SET_TOAST,
  text,
  duration,
});
export const setError = (error, context) => ({
  type: SET_ERROR,
  error,
  context,
});
export const setRoute = (route) => {
  return {
    type: SET_ROUTE,
    route,
  }
};
