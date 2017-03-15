import { createStore } from 'redux';
import polymerRedux from 'polymer-redux';
import { reducer } from './reducers';

export const store = createStore(reducer);
export const AppState = polymerRedux(store);
