import { createStore } from 'redux';

const initialState = {
  remoteEyeTrackers: [],
  gazeCursorRadius: 0,
  gazeData: {},
  showHeader: true,
  showFooter: true,
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
    case 'SET_SHOW_HEADER_FOOTER': {
      return { ...state, showHeader: action.showHeader, showFooter: action.showFooter}
    }
    default:
      return state;
  }
});

export default store;
