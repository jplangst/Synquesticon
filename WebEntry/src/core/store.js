import { createStore } from 'redux';
import wampStore from './wampStore';

import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import primary from '@material-ui/core/colors/grey';
import secondary from '@material-ui/core/colors/amber';

/*
* The store is responsible for storing data that needs to be shared between different parts of the application.
*/

var savedThemeType = JSON.parse(window.localStorage.getItem('theme'));

if(savedThemeType === null || savedThemeType === undefined){
  savedThemeType = "light";
}

function prepareMUITheme(themeType){
  let theme = null;
  if(themeType === "light"){
    theme = createMuiTheme({
      palette:{
        primary: {
          main: "#cfd8dc",
        },
        secondary: {
          main: "#fafafa",
        },
        // Used by `getContrastText()` to maximize the contrast between the
        // background and the text.
        contrastThreshold: 3,
        // Used to shift a color's luminance by approximately
        // two indexes within its tonal palette.
        // E.g., shift from Red 500 to Red 300 or Red 700.
        tonalOffset: 0.2,
        type: themeType,
      }
    });
  }
  else{
    theme = createMuiTheme({
      palette:{
        primary: {
          //light: '#757ce8',
          main: '#424242',
          //dark: '#002884',
          //contrastText: '#fff',
        },
        secondary: {
          //light: '#ff7961',
          main: '#212121',
          //dark: '#ba000d',
          //contrastText: '#000',
        },
        // Used by `getContrastText()` to maximize the contrast between the
        // background and the text.
        contrastThreshold: 3,
        // Used to shift a color's luminance by approximately
        // two indexes within its tonal palette.
        // E.g., shift from Red 500 to Red 300 or Red 700.
        tonalOffset: 0.2,
        type: themeType,
      }
    });
  }
  return theme = responsiveFontSizes(theme);
}

let theme = prepareMUITheme(savedThemeType);


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
      theme = prepareMUITheme(type)
      window.localStorage.setItem('theme', JSON.stringify(type));
      return {...state, theme: theme}
    }
    default:
      return state;
  }
});



export default store;
