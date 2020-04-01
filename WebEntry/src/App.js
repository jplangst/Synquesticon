import { HashRouter as Router, Route, Switch  } from 'react-router-dom';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { throttle } from 'lodash'

import {AppModes} from './core/sharedObjects';

import store from './core/store';

import Snackbar from '@material-ui/core/Snackbar';

import Header from './Header/Header'
import EditMode from './EditMode/EditMode';
import ObserverMode from './ObserverMode/ObserverMode';
import ExportMode from './ExportMode/ExportMode';
import PlayMode from './PlayMode/PlayMode';
import DisplayTaskComponent from './components/PlayerComponents/DisplayTaskComponent';

import './App.css'

import ThemeProvider from '@material-ui/styles/ThemeProvider';

//To make MaterialUI use the new variant of typography and avoid the deprecation warning
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

//let backend = isMobile ? TouchBackend:HTML5Backend;

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

  handleCloseSnackbar(event, reason) {
    var snackbarAction = {
      type: 'TOAST_SNACKBAR_MESSAGE',
      snackbarOpen: false,
      snackbarMessage: ""
    };

    store.dispatch(snackbarAction);
  }

  render() {
    let theme = store.getState().theme;

    let scrollBgColor = theme.palette.type==="light"?"lightscroll":"darkscroll";
    document.body.classList.add(scrollBgColor);

    return (
        <Router>
          <ThemeProvider theme={theme}>
          <div style={{backgroundColor:theme.palette.background.default}} className="App">
            <Route component={Header} />
            <div className="MainContent">
              <Switch>
                <Route exact path="/" component={PlayMode} />
                <Route path={"/"+AppModes.EDIT} component={EditMode} />
                <Route path="/ObserverMode" component={ObserverMode} />
                <Route path="/ExportationMode" component={ExportMode} />
                <Route path="/study" component={DisplayTaskComponent}/>} />
              </Switch>
            </div>
          </div>
          <Snackbar
            style = {{bottom: 200}}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={this.props.snackbarOpen}
            onClose={this.handleCloseSnackbar.bind(this)}
            autoHideDuration={2000}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<div style={{width: '100%', height: '100%'}} id="message-id">{this.props.snackbarMessage}</div>}
          />
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
        snackbarOpen: state.snackbarOpen,
        snackbarMessage: state.snackbarMessage
    };
}

export default connect(mapStateToProps)(App);
