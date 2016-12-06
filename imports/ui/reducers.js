import { Random } from 'meteor/random';
import { EJSON } from 'meteor/ejson';
import { SET_USER, SET_TOAST, SET_ERROR, SET_ROUTE } from './action-types';

const initialState = {
  user: {},
  toast: {
    text: '',
    duration: 4000,
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
          duration: action.duration,
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
    case SET_ROUTE: {
      if(EJSON.equals(action.route, state.route)){
        return state;
      }
      const route = Object.assign({}, state.route, action.route);
      return Object.assign({}, state, { route });
    }
    case 'SET_ROUTE_PATH': {
      const route = Object.assign(state.route, { path: action.path });
      return state;
    }
    default:
      return state;
  }
};
