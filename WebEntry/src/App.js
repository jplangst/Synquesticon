import { BrowserRouter as Router, Route, Switch  } from 'react-router-dom';
import React, { Component } from 'react';

import Header from './components/Header'
//import EditScreen from './pages/EditScreen';
import CreateTaskScreen from './pages/CreateTaskScreen';
import TaskSetScreation from './pages/TaskSetCreation';
import IntroductionScreen from './pages/IntroductionScreen';
import PlayScreen from './pages/PlayScreen';

import './App.css'

//To make MaterialUI use the new variant of typography and avoid the deprecation warning
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class App extends Component {
  render() {
    return (
        <Router>
        <div className="App">
          <Route component={Header} />
          <div className="MainContent">
            <Switch>
              <Route exact path="/" component={IntroductionScreen} />
              <Route path="/TaskCreation" component={CreateTaskScreen} />
              <Route path="/TaskSetCreation" component={TaskSetScreation} />
              <Route path="/PlayScreen" component={PlayScreen} />
            </Switch>
          </div>
        </div>
        </Router>
    );
  }
}

export default App;
