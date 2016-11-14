import { Random } from 'meteor/random';
import { SET_USER, SET_TOAST, SET_ERROR } from './action-types';

const initialState = {
  user: {},
  toast: {
    text: '',
  },
  errors: {},
};
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return Object.assign({}, state, {
        user: action.user,
      });
    case SET_TOAST:
      return Object.assign({}, state, {
        toast: {
          text: action.text,
        },
      });
    case SET_ERROR: {
      const errors = state.errors;
      const errorId = Random.id(10);
      const status = Meteor.status().status;
      errors[errorId] = {
        error: action.error,
        context: action.context,
        status,
      };
      return Object.assign({}, state, {
        toast: {
          text: `${action.error.message} Error ID : ${errorId}`,
        },
        errors,
      });
    }
    default:
      return state;
  }
};
