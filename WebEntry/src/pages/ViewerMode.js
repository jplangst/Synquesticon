import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

//icons
import CancelIcon from '@material-ui/icons/Cancel';
import NavigationIcon from '@material-ui/icons/NavigateNext';

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
    var getDisplayedQuestion = () => {
      if(store.getState().taskList.length > 0 && this.state.currentQuestion < store.getState().taskList.length){
        var task = store.getState().taskList[this.state.currentQuestion];
        console.log("play task", task);
        return (
        <div className="mainDisplay">
          <div className="questionDisplay">
            {task.question}
          </div>
          <div className="responsesButtons">
          {
            task.responses.map((item, index)=>{
              console.log("play task buttons", index, item);
              return (<Button variant="contained">{item}</Button>);
            })
          }
          </div>
        </div>);
      }
    };

    return (
      <div className="ViewerContainer">
        <div className="TaskSetHeaderContainer">

        </div>

        <div className="SelectedTaskContainer">
          <WAMPMessageComponent />
        </div>

        <div className="ViewerGaze">

        </div>
      </div>
      // <div>
      //   <GazeCursor viewWidth={1920} viewHeight={1080}/>
      // </div>
      );
  }
}

export default ViewerMode;
