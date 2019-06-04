import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

//icons
import CancelIcon from '@material-ui/icons/Cancel';
import NavigationIcon from '@material-ui/icons/NavigateNext';

//view components
import InstructionViewComponent from './Views/InstructionViewComponent';
import QuestionViewComponent from './Views/QuestionViewComponent';
import ImageViewComponent from './Views/ImageViewComponent';

import wamp from '../core/wamp';
import store from '../core/store';

import './DisplayTaskComponent.css';

class DisplayTaskHelper extends React.Component { //for the fking sake of recursion
  constructor() {
    super();
    this.state = {
      currentTaskIndex: 0,
      answerItem: null,
      hasBeenAnswered: false,
      complexStep: 0 //for complex tasks only
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
    // if (this.currentTask.taskType === "Complex" && this.state.complexStep < 2) {
    //   this.setState({
    //     complexStep: (this.state.complexStep + 1)
    //   })
    // }
    // else {
      this.setState({
        hasBeenAnswered: false,
        answerItem: null,
        currentTaskIndex: (this.state.currentTaskIndex + 1),
        complexStep: 0
      });
    // }
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
    console.log("render", this.state.currentTaskIndex, this.props.taskSet, this.props.taskSet[this.state.currentTaskIndex]);
    if(this.props.taskSet.length > 0 && this.state.currentTaskIndex < this.props.taskSet.length) {
      if (this.props.taskSet[this.state.currentTaskIndex].objType === "Task") {
        this.currentTask = this.props.taskSet[this.state.currentTaskIndex].data;
        if (!this.state.hasBeenAnswered) {
          this.broadcastStartEvent();
        }

        var getDisplayedContent = () => {
          if(this.currentTask){
            if((this.currentTask.taskType === "Instruction") ||
                  (this.currentTask.taskType === "Complex" && this.state.complexStep === 0)) {
                return <InstructionViewComponent task={this.currentTask}/>;
              }
            if((this.currentTask.taskType === "Question") ||
                  (this.currentTask.taskType === "Complex" && this.state.complexStep === 2)) {
                return <QuestionViewComponent task={this.currentTask} answerCallback={this.onAnswer.bind(this)} answerItem={this.state.answerItem} hasBeenAnswered={this.state.hasBeenAnswered}/>;
              }
            if((this.currentTask.taskType === "Image") ||
                  (this.currentTask.taskType === "Complex" && this.state.complexStep === 1)) {
                    return <ImageViewComponent task={this.currentTask}/>;
              }
          } else {
            return <div/>;
          }
        };

        var getNextButton = () => {
          if (this.state.currentTaskIndex < (this.props.taskSet.length) - 1){
            return (  <Button className="nextButton" onClick={this.onClickNext.bind(this)}>
                        <NavigationIcon />
                      </Button>);
          }
        }

        return (
          <div className="page">
            <div className="mainDisplay">
              {getDisplayedContent()}
            </div>
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
      else if (this.props.taskSet[this.state.currentTaskIndex].objType === "TaskSet") {

        return <DisplayTaskHelper taskSet={this.props.taskSet[this.state.currentTaskIndex].data} />
      }
    }
    else { //TODO: end of set
      return (<div/>);
    }


  }
}

class DisplayTaskComponent extends Component {
  render() {
    return (
      <DisplayTaskHelper taskSet={store.getState().experimentInfo.taskSet}/>
      );
  }
}

export default DisplayTaskComponent;
