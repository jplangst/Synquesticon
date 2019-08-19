import { BrowserRouter as Router, Route, Switch  } from 'react-router-dom';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import store from './core/store';

import Header from './components/Header/Header'
import EditorMode from './pages/EditorMode';
import IntroductionScreen from './pages/IntroductionScreen';
import PlayerMode from './pages/PlayerMode';
import ObserverMode from './pages/ObserverMode';
import DisplayTaskComponent from './components/PlayerComponents/DisplayTaskComponent';

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

import './App.css'

//To make MaterialUI use the new variant of typography and avoid the deprecation warning
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

class App extends Component {
  render() {

    var mainContentHeight = this.props.showHeader ? '94%' : '100%';

    return (
        <Router>
        <div className="App">
          <Route component={Header} />
          <div className="MainContent" style={{height: mainContentHeight}}>
            <Switch>
              <Route exact path="/" component={IntroductionScreen} />
              <Route path="/EditorMode" component={EditorMode} />
              <Route path="/PlayerMode" component={PlayerMode} />
              <Route path="/ObserverMode" component={ObserverMode} />
              <Route path="/DisplayTaskComponent" component={DisplayTaskComponent}/>} />
            </Switch>
          </div>
        </div>
        </Router>
    );
  }
}

//Allow sus to use store state to update our react component
function mapStateToProps(state, ownProps) {
    return {
        showHeader: state.showHeader
    };
}

export default connect(mapStateToProps)(DragDropContext(HTML5Backend)(App));
