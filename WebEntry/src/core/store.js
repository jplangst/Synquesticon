import { createStore } from 'redux';

import wampStore from './wampStore';

const initialState = {
  remoteEyeTrackers: [],
  gazeCursorRadius: 0,
  gazeData: {},
  showHeader: true,
  experimentInfo: null
  // experimentId: this.state.experiment,
  // partiticipantId: this.state.participant,
  // taskSet: dbQueryResult,
  // selectedTracker: this.state.selectedTracker
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
