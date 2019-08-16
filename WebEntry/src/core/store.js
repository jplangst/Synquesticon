import { createStore } from 'redux';

import wampStore from './wampStore';

const initialState = {
  participants: {},
  gazeCursorRadius: 0,
  gazeData: {},
  showHeader: true,
  experimentInfo: null
};

const store = createStore ((state = initialState, action) => {
  switch(action.type) {
    case 'SET_GAZE_DATA': {
      state.gazeData[action.tracker] = action.gazeData;
      return state;
    }
    case 'ADD_PARTICIPANT': {
      state.participants[action.participant] = action.tracker;
      return state;
    }
    case 'REMOVE_PARTICIPANT': {
      if (state.participants[action.participant] != undefined) {
        delete state.participants[action.participant];
      }
      return state;
    }
    case 'SET_GAZE_RADIUS': {
      return { ...state, gazeCursorRadius: action.gazeRadius};
    }
    case 'SET_EXPERIMENT_INFO': {
      return { ...state, experimentInfo: action.experimentInfo}
    }
    case 'SET_SHOW_HEADER': {
      return { ...state, showHeader: action.showHeader}
    }
    default:
      return state;
  }
});

export default store;
