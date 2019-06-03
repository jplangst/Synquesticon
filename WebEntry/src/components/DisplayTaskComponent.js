import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

//icons
import CancelIcon from '@material-ui/icons/Cancel';
import NavigationIcon from '@material-ui/icons/NavigateNext';

import wamp from '../core/wamp';
import store from '../core/store';

import './DisplayTaskComponent.css';

class DisplayTaskComponent extends Component {
  constructor() {
    super();
    this.state = {
      currentTaskIndex: 0,
      answerItem: null,
      hasBeenAnswered: false
    }

    this.currentTask = null;
    this.startTimestamp = 0;

    this.handleGazeLocUpdate = this.updateCursorLocation.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.handleGazeLocUpdate, 4.5); //Update the gaze cursor location every 2ms
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  broadcastStartEvent() {
    console.log("broadcastStartEvent", this.currentTask);
    var dt = new Date();
    this.startTimestamp = dt.getTime();
    var timestamp = dt.toUTCString();
    //displayText = "Experiment " + args[1] + "- Participant " + args[2] + ": " + args[3] + ". Start at: " + args[4];
    var info = ["START",
                store.getState().experimentInfo.experimentId,
                store.getState().experimentInfo.participantId,
                this.currentTask.question,
                timestamp,
                store.getState().experimentInfo.selectedTracker];
    wamp.broadcastEvents(info);
  }

  broadcastAnswerEvent(answerObj) {
    var dt = new Date();
    var timestamp = dt.toUTCString();
    // displayText = "Experiment " + args[1] + "- Participant " + args[2] + ": " + args[3] + " - Answer at: " + args[4]
    //               + " Response time: " + args[5] + ". " + answerStatus;
    var info = ["ANSWER",
                store.getState().experimentInfo.experimentId,
                store.getState().experimentInfo.participantId,
                this.currentTask.question,
                timestamp,
                dt.getTime() - this.startTimestamp,
                answerObj.answer,
                answerObj.isCorrect,
                this.currentTask.aois];
    wamp.broadcastEvents(info);
  }

  updateCursorLocation(){
    try {
      let gazeLoc = store.getState().gazeData[store.getState().experimentInfo.selectedTracker];
      this.currentTask.aois.map((item, index) => {
        if (gazeLoc.locX > item.boundingbox[0][0] && gazeLoc.locX < item.boundingbox[1][0]
          && gazeLoc.locY > item.boundingbox[0][1] && gazeLoc.locY < item.boundingbox[3][1]
          && item["checked"] === undefined) {
          item["checked"] = true;
        }
      });
    } catch (err) {

    }
  }

  onClickNext(e) {
    this.setState({
      hasBeenAnswered: false,
      answerItem: null,
      currentTaskIndex: (this.state.currentTaskIndex + 1)
    });
  }

  onClickCancel(e) {

  }

  onAnswer(answer) {
    this.setState({
      hasBeenAnswered: true,
      answerItem: answer
    });
    var answerObj = {
      answer: answer,
      isCorrect: this.currentTask.correctResponses.includes(answer)
    };
    this.broadcastAnswerEvent(answerObj);
  }

  render() {
    if(store.getState().experimentInfo.taskSet.length > 0 && this.state.currentTaskIndex < store.getState().experimentInfo.taskSet.length) {
      this.currentTask = store.getState().experimentInfo.taskSet[this.state.currentTaskIndex];
    }
    else {
      this.currentTask = null;
    }

    if (!this.state.hasBeenAnswered) {
      this.broadcastStartEvent();
    }

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
              if (item === this.state.answerItem) {
                return (
                  <Button variant="contained" className="picked" disabled={this.state.hasBeenAnswered} onClick={() => this.onAnswer(item)}>{item}</Button>)
              }
              return (<Button variant="contained" className="picked" disabled={this.state.hasBeenAnswered} onClick={() => this.onAnswer(item)}>{item}</Button>);
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

export default DisplayTaskComponent;
