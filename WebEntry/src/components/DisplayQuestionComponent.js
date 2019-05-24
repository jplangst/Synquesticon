import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

//icons
import CancelIcon from '@material-ui/icons/Cancel';
import NavigationIcon from '@material-ui/icons/NavigateNext';

// import wamp from '../core/wamp';
import store from '../core/store';

import './DisplayQuestionComponent.css';

class PlayerMode extends Component {
  constructor() {
    super();
    this.state = {
      currentTaskIndex: 0,
      hasBeenAnswered: false
    }

    this.currentTask = null;

    this.handleGazeLocUpdate = this.updateCursorLocation.bind(this);
  }

  componentWillMount() {
    if(store.getState().experimentInfo.taskSet.length > 0 && this.state.currentTaskIndex < store.getState().experimentInfo.taskSet.length) {
      this.currentTask = store.getState().experimentInfo.taskSet[this.state.currentTaskIndex];
    }
    else {
      this.currentTask = null;
    }
    // wamp.startStopTask(store.getState().taskList[this.state.currentQuestion]);
  }

  componentDidMount() {
    this.timer = setInterval(this.handleGazeLocUpdate, 4.5); //Update the gaze cursor location every 2ms
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  updateCursorLocation(){
    try {
      let gazeLoc = store.getState().gazeData[store.getState().experimentInfo.selectedTracker];
      this.currentTask.aois.map((item, index) => {
        if (gazeLoc.locX > item.boundingbox[0][0] && gazeLoc.locX < item.boundingbox[1][0]
          && gazeLoc.locY > item.boundingbox[0][1] && gazeLoc.locY < item.boundingbox[3][1]
          && item.checked !== true) {
          item.checked = true;
        }
      });
    } catch (err) {

    }
  }

  onClickNext(e) {
    this.setState({
      currentTaskIndex: (this.state.currentTaskIndex + 1)
    });
  }

  onClickCancel(e) {

  }

  onAnswer(answer) {
    this.setState({
      hasBeenAnswered: true
    });
    var answerObj = {

    }
  }

  render() {
    var getDisplayedQuestion = () => {
      if(this.currentTask){
        return (
        <div className="mainDisplay">
          <div className="questionDisplay">
            {this.currentTask.question}
          </div>
          <div className="responsesButtons">
          {
            this.currentTask.responses.map((item, index)=>{
              return (<Button variant="contained" disabled={this.state.hasBeenAnswered} onClick={() => this.onAnswer(item)}>{item}</Button>);
            })
          }
          </div>
        </div>);
      }
    };

    var getNextButton = () => {
      if (this.state.currentTaskIndex < (store.getState().experimentInfo.taskSet.length) - 1){
        return (  <Button className="nextButton" onClick={this.onClickNext.bind(this)}>
                    <NavigationIcon />
                  </Button>);
      }
    }

    return (
      <div className="page">
       {getDisplayedQuestion()}
        <div className="footer">
          <Link to="/" >
            <Button className="cancelButton" onClick={this.onClickCancel.bind(this)}>
              <CancelIcon />
            </Button>
          </Link>
          {getNextButton()}
        </div>
      </div>
      );
  }
}

export default PlayerMode;
