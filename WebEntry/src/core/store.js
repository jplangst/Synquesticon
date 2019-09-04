import { createStore } from 'redux';
import wampStore from './wampStore';

import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';

/*
* The store is responsible for storing data that needs to be shared between different parts of the application.
*/

var savedThemeType = JSON.parse(window.localStorage.getItem('theme'));

if(savedThemeType === null || savedThemeType === undefined){
  savedThemeType = "light";
}
let theme = createMuiTheme({
  palette:{
    primary: indigo,
    secondary: pink,
    error: red,
    // Used by `getContrastText()` to maximize the contrast between the
    // background and the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
    type: savedThemeType,
  }
});
theme = responsiveFontSizes(theme);


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
  theme: theme,
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
    case 'TOGGLE_THEME_TYPE': {
      let type = state.theme.palette.type === "light" ? "dark" : "light";
      let theme = createMuiTheme({
        palette:{
          primary: indigo,
          secondary: pink,
          error: red,
          // Used by `getContrastText()` to maximize the contrast between the
          // background and the text.
          contrastThreshold: 3,
          // Used to shift a color's luminance by approximately
          // two indexes within its tonal palette.
          // E.g., shift from Red 500 to Red 300 or Red 700.
          tonalOffset: 0.2,
          type: type,
        }
      });
      theme = responsiveFontSizes(theme);
      window.localStorage.setItem('theme', JSON.stringify(type));
      return {...state, theme: theme}
    }
    default:
      return state;
  }
});



export default store;
