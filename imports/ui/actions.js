import { SET_TOAST, SET_ERROR } from './action-types';

export const setToast = (text) => ({
  type: SET_TOAST,
  text,
});
export const setError = (error, context) => ({
  type: SET_ERROR,
  error,
  context,
});

