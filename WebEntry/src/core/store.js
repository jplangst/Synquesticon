import { createStore } from 'redux';
import wampStore from './wampStore';

/*
* The store is responsible for storing data that needs to be shared between different parts of the application.
*/



const initialState = {
  participants: {},
  gazeCursorRadius: 0,
  gazeData: {},
  showHeader: true,
  experimentInfo: null,
  windowSize: {
    width: window.innerWidth,
    height: window.innerHeight
  },

  //Common component styles:
  styles: {
    textSize: 'medium',
    themeColors: {
      light: "#7986cb",
      main: "#3f51b5",
      dark: "#303f9f"
    },
  },
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
    case 'WINDOW_RESIZE': {
      return { ...state, windowSize: action.windowSize}
    }
    default:
      return state;
  }
});



export default store;
