import { BrowserRouter as Router, Route, Switch  } from 'react-router-dom';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { throttle } from 'lodash'

import store from './core/store';

import Header from './components/Header/Header'
import EditorMode from './pages/EditorMode';
import IntroductionScreen from './pages/IntroductionScreen';
import PlayerMode from './pages/PlayerMode';
import ObserverMode from './pages/ObserverMode';
import RunTasksMode from './components/PlayerComponents/DisplayTaskComponent';

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

import './App.css'

//To make MaterialUI use the new variant of typography and avoid the deprecation warning
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

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
    return (
        <Router>
        <div className="App">
          <Route component={Header} />
          <div className="MainContent">
            <Switch>
              <Route exact path="/" component={IntroductionScreen} />
              <Route path="/EditorMode" component={EditorMode} />
              <Route path="/PlayerMode" component={PlayerMode} />
              <Route path="/ObserverMode" component={ObserverMode} />
              <Route path="/RunTasksMode" component={RunTasksMode}/>} />
            </Switch>
          </div>
        </div>
        </Router>
    );
  }
}

//Allows us to use store state to update our react component
function mapStateToProps(state, ownProps) {
    return {
        showHeader: state.showHeader,
        windowSize: state.windowSize
    };
}

export default connect(mapStateToProps)(DragDropContext(HTML5Backend)(App));
