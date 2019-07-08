import { BrowserRouter as Router, Route, Switch  } from 'react-router-dom';
import React, { Component } from 'react';

import Header from './components/Header/Header'
//import EditScreen from './pages/EditScreen';
import EditorMode from './pages/EditorMode';
import IntroductionScreen from './pages/IntroductionScreen';
import PlayerMode from './pages/PlayerMode';
import ObserverMode from './pages/ObserverMode';
import RunTasksMode from './components/DisplayTaskComponent';

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

import './App.css'

//To make MaterialUI use the new variant of typography and avoid the deprecation warning
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class App extends Component {
  render() {
    //console.log("Router path: ", this);
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

export default DragDropContext(HTML5Backend)(App);
