import { createStore } from 'redux';
import wampStore from './wampStore';

/*
* The store is responsible for storing data that needs to be shared between different parts of the application.
*/

const initialState = {
  remoteEyeTrackers: [],
  gazeCursorRadius: 0,
  gazeData: {},
  showHeader: true,
  experimentInfo: null
};

const store = createStore ((state = initialState, action) => {
  switch(action.type) {
    case 'SET_GAZE_DATA': {
      if (!state.remoteEyeTrackers.includes(action.tracker)) {
        wampStore.setCurrentRemoteTracker(action.tracker);
        wampStore.emitNewRemoteTrackerListener();
      }
      state.gazeData[action.tracker] = action.gazeData;
      return state;
    }
    case 'ADD_REMOTE_TRACKER': {
      state.remoteEyeTrackers.push(action.tracker);
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
