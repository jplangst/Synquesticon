import React, { Component } from 'react';

import GazeCursor from '../components/Views/GazeCursor';
import WAMPMessageComponent from '../components/Views/WAMPMessageComponent';

import store from '../core/store';

import './ViewerMode.css';

class ViewerMode extends Component {
  constructor() {
    super();
    this.state = {
      currentQuestion: 0
    }
  }

  componentWillMount() {
    console.log(store.getState());
    // wamp.startStopTask(store.getState().taskList[this.state.currentQuestion]);
  }

  onClickNext(e) {
    console.log("current question", this.state.currentQuestion, store.getState().taskList);
    // wamp.startStopTask(store.getState().taskList[(this.state.currentQuestion + 1)]);
    this.setState({
      currentQuestion: (this.state.currentQuestion + 1)
    });
  }

  render() {
    return (
      <div className="ViewerContainer">
        <div className="SelectedTaskContainer">
          <WAMPMessageComponent />
        </div>

        <div className="ViewerGaze">

        </div>
      </div>
      );
  }
}

export default ViewerMode;
