import { BrowserRouter as Router, Route, Switch  } from 'react-router-dom';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { throttle } from 'lodash'

import store from './core/store';

import {isMobile} from 'react-device-detect';

import Header from './components/Header/Header'
import EditorMode from './pages/EditorMode';
import IntroductionScreen from './pages/IntroductionScreen';
import DisplayTaskComponent from './components/PlayerComponents/DisplayTaskComponent';

import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend' /* Does not support touch events */
import TouchBackend from 'react-dnd-touch-backend' /* Supports touch events, but can be buggy with miouse events */
import { DragDropContext } from 'react-dnd'

import './App.css'

import ThemeProvider from '@material-ui/styles/ThemeProvider';

//To make MaterialUI use the new variant of typography and avoid the deprecation warning
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

let backend = isMobile ? TouchBackend:HTML5Backend;

class App extends Component {
  constructor(props){
    super(props);
    this.resize = throttle(this.resize.bind(this), 100); //Setup the resize callback function so it is not called too frequently
  }

  resize(){
    var resizeAction = {
      type: 'WINDOW_RESIZE',
      windowSize: {width: window.innerWidth, height: window.innerHeight}
    };

    store.dispatch(resizeAction);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  render() {
    let theme = store.getState().theme;
    return (

        <Router>
          <ThemeProvider theme={theme}>
          <div style={{backgroundColor:theme.palette.background.default}} className="App">
            <Route component={Header} />
            <div className="MainContent">
              <Switch>
                <Route exact path="/" component={IntroductionScreen} />
                <Route path="/EditorMode" component={EditorMode} />
                <Route path="/study" component={DisplayTaskComponent}/>} />
              </Switch>
            </div>
          </div>
          </ThemeProvider>
        </Router>

    );
  }
}

//Allows us to use store state to update our react component
function mapStateToProps(state, ownProps) {
    return {
        showHeader: state.showHeader,
        windowSize: state.windowSize,
        theme: state.theme,
    };
}

export default connect(mapStateToProps)(DragDropContext(backend)(App));
