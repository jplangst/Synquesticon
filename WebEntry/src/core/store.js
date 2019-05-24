import { createStore } from 'redux';

const initialState = {
  remoteEyeTrackers: [],
  gazeCursorRadius: 0,
  gazeData: {},
  experimentInfo: null
  // experimentId: this.state.experiment,
  // partiticipantId: this.state.participant,
  // taskSet: dbQueryResult,
  // selectedTracker: this.state.selectedTracker
};

const store = createStore ((state = initialState, action) => {
  switch(action.type) {
    case 'SET_GAZE_DATA':{
      if (!state.remoteEyeTrackers.includes(action.tracker)) {
        state.remoteEyeTrackers.push(action.tracker);
      }
      state.gazeData[action.tracker] = action.gazeData;
      return state;
    }
    case 'SET_GAZE_RADIUS': {
      return { ...state, gazeCursorRadius: action.gazeRadius};
    }
    case 'SET_EXPERIMENT_INFO': {
      return { ...state, experimentInfo: action.experimentInfo}
    }
    default:
      return state;
  }
});

export default store;
