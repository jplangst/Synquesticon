import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

//icons
import CancelIcon from '@material-ui/icons/Cancel';
import NavigationIcon from '@material-ui/icons/NavigateNext';

//view components
import InstructionViewComponent from './Views/InstructionViewComponent';
import TextEntryComponent from './Views/TextEntryComponent';
import SingleChoiceComponent from './Views/SingleChoiceComponent';
import MultipleChoiceComponent from './Views/MultipleChoiceComponent';
import ImageViewComponent from './Views/ImageViewComponent';

import wamp from '../core/wamp';
import store from '../core/store';
import shuffle from '../core/shuffle';

import * as dbFunctions from '../core/db_helper';
import * as dbObjects from '../core/db_objects';

import './DisplayTaskComponent.css';

function getCurrentTime() {
  var dt = new Date();
  return dt.getTime();
}

function stringifyWAMPMessage(obj, timestamp, type) {
  if (type == "START") {
    var message = "";
    if (obj.taskType === "Instruction") {
      message = "Instruction: " + obj.instruction;
    }
    else if (obj.taskType  === "Multiple Choice")  {
      message = "Multiple Choice Question: " + obj.question;
    }
    else if (obj.taskType === "Single Choice") {
      message = "Single Choice Question: " + obj.question;
    }
    else if (obj.taskType  === "Image") {
      message = "Display Image: " + obj.image;
    }
    else if (obj.taskType === "Complex") {
      message = "Complex Task: " + obj.instruction;
    }
    //displayText = "Experiment " + args[1] + "- Participant " + args[2] + ": " + args[3] + ". Start at: " + args[4];
    return ["START",
                message,
                timestamp,
                store.getState().experimentInfo.selectedTracker];
  }
  else if (type == "NEXT") {
    // displayText = "Experiment " + args[1] + "- Participant " + args[2] + ": " + args[3] + " - Answer at: " + args[4]
    //               + " Response time: " + args[5] + ". " + answerStatus;
    return ["ANSWERED",
                obj.question,
                obj.firstResponseTimestamp,
                obj.timeToFirstAnswer,
                obj.timeToCompletion,
                obj.responses,
                obj.correctlyAnswered,
                obj.aoiCheckedList];
  }
  else if (type == "SKIP") {
    return ["SKIPPED",
                obj.question,
                obj.timeToCompletion];
  }
  return null;
}

class DisplayTaskHelper extends React.Component { //for the fking sake of recursion
  constructor() {
    super();
    this.state = {
      currentTaskIndex: 0,
      hasBeenAnswered: false,
      complexStep: 0 //for complex tasks only
    }

    this.currentTask = null;
    this.currentLineOfData = null;

    this.handleGazeLocUpdate = this.updateCursorLocation.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.handleGazeLocUpdate, 4.5); //Update the gaze cursor location every 2ms
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    var layoutAction = {
      type: 'SET_SHOW_HEADER',
      showHeader: true,
      showFooter: true
    }

    store.dispatch(layoutAction);
  }

  logStartOfTask() {
    var startTimestamp = getCurrentTime();
    this.currentLineOfData = new dbObjects.LineOfData(this.props.taskSetNames,
                                                      startTimestamp,
                                                      this.currentTask);

    wamp.broadcastEvents(stringifyWAMPMessage(this.currentTask, startTimestamp, "START"));
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

  onClickNext() {
    if (this.currentTask.taskType === "Complex" && this.state.complexStep < 2) {
      this.setState({
        complexStep: (this.state.complexStep + 1)
      })
    }
    else {
      if (this.currentLineOfData) {
        if (!this.currentTask.globalVariable) {
          this.currentLineOfData.timeToCompletion = getCurrentTime();
          dbFunctions.addNewLineToParticipantDB(store.getState().experimentInfo.participantId, JSON.stringify(this.currentLineOfData));
        }
        else {
          var globalVariableObj = {
            label: this.currentTask.question,
            value: this.currentLineOfData.responses
          };
          dbFunctions.addNewGlobalVariableToParticipantDB(store.getState().experimentInfo.participantId,
                                                          JSON.stringify(globalVariableObj));
        }

        wamp.broadcastEvents(stringifyWAMPMessage(this.currentLineOfData,
                                                  this.state.hasBeenAnswered ? "NEXT" : "SKIP"));
      }

      //reset
      this.setState({
        hasBeenAnswered: false,
        answerItem: null,
        currentTaskIndex: (this.state.currentTaskIndex + 1),
        complexStep: 0
      });
      this.currentLineOfData = null;
    }
  }

  onAnswer(answer) {
    if (!this.state.hasBeenAnswered) {
      this.currentLineOfData.firstResponseTimestamp = getCurrentTime();
      this.currentLineOfData.timeToFirstAnswer = this.currentLineOfData.firstResponseTimestamp - this.currentLineOfData.startTimestamp;
    }
    this.setState({
      hasBeenAnswered: true
    });
    this.currentLineOfData.responses = answer.responses;
    this.currentLineOfData.correctlyAnswered = answer.correctlyAnswered;
  }

  onFinishedRecursion() {
    this.onClickNext();
  }

  render() {
    //check if we should enter a new level or leave
    if(this.props.taskSet.length > 0 && this.state.currentTaskIndex < this.props.taskSet.length) {
      if (this.props.taskSet[this.state.currentTaskIndex].objType === "TaskSet") {
        //shuffle set if set was marked as "Random"
        var runThisTaskSet = this.props.taskSet[this.state.currentTaskIndex].data;
        if (this.props.taskSet[this.state.currentTaskIndex].setTaskOrder === "Random") {
          runThisTaskSet = shuffle(runThisTaskSet);
        }

        let trackingTaskSetNames = this.props.taskSetNames;
        trackingTaskSetNames.push(this.props.taskSet[this.state.currentTaskIndex].name);
        //recursion
        return <DisplayTaskHelper taskSetNames={trackingTaskSetNames} taskSet={runThisTaskSet} onFinished={this.onFinishedRecursion.bind(this)}/>
      }
      //TODO: this is a go around solution, please fix it to make it solid
      else {//if (this.props.taskSet[this.state.currentTaskIndex].objType === "Task" || ) {
        this.currentTask = this.props.taskSet[this.state.currentTaskIndex].data;
        if (this.currentTask === undefined) {
          //console.log("bug in the database, set the task to the correct data");
          this.currentTask = this.props.taskSet[this.state.currentTaskIndex];
        }

        //log the start
        if (!this.state.hasBeenAnswered && this.state.complexStep === 0) {
          this.logStartOfTask();
        }

        var getDisplayedContent = () => {
          if(this.currentTask){
            if((this.currentTask.taskType === "Instruction") ||
                  (this.currentTask.taskType === "Complex" && this.state.complexStep === 0)) {
                return <InstructionViewComponent task={this.currentTask}/>;
              }
            if(this.currentTask.taskType === "Text Entry") {
                return <TextEntryComponent task={this.currentTask} answerCallback={this.onAnswer.bind(this)} answerItem={this.state.answerItem} hasBeenAnswered={this.state.hasBeenAnswered}/>;
              }
            if(this.currentTask.taskType === "Single Choice") {
                return <SingleChoiceComponent task={this.currentTask} answerCallback={this.onAnswer.bind(this)} answerItem={this.state.answerItem} hasBeenAnswered={this.state.hasBeenAnswered}/>;
              }
            if((this.currentTask.taskType === "Multiple Choice") ||
                  (this.currentTask.taskType === "Complex" && this.state.complexStep === 2)) {
                return <MultipleChoiceComponent task={this.currentTask} answerCallback={this.onAnswer.bind(this)} answerItem={this.state.answerItem} hasBeenAnswered={this.state.hasBeenAnswered}/>;
              }
            if((this.currentTask.taskType === "Image") ||
                  (this.currentTask.taskType === "Complex" && this.state.complexStep === 1)) {
                    return <ImageViewComponent task={this.currentTask}/>;
              }
          } else {

            return <div/>;
          }
        };

        var nextButtonText = this.state.hasBeenAnswered ? "Next" : "Skip";

        return (
          <div className="page">
            <div className="mainDisplay">
              {getDisplayedContent()}
            </div>
            <div className="nextButton">
              <Button className="nextButton" variant="outlined" onClick={this.onClickNext.bind(this)}>
                {nextButtonText}
              </Button>
            </div>
          </div>
          );
      }

    }
    else { //TODO: end of set
      this.props.onFinished();
      // console.log("end of set");
      return (<div/>);
    }
  }
}

class DisplayTaskComponent extends Component {
  broadcastEndEvent() {
    var dt = new Date();
    var timestamp = dt.toUTCString();

    var info = ["FINISHED",
                store.getState().experimentInfo.mainTaskSetId,
                timestamp]
    wamp.broadcastEvents(info);
  }

  onFinished() {
    this.broadcastEndEvent();
    this.props.history.push("PlayerMode");
    alert("finished!");
  }

  componentWillUnmount() {
    //save data into DB before closing
    dbFunctions.getAllParticipantsFromDb((participants) => {
      console.log("all participants", participants);
    });
  }

  render() {
    return (
      <DisplayTaskHelper taskSetNames={[store.getState().experimentInfo.mainTaskSetId]} taskSet={store.getState().experimentInfo.taskSet} onFinished={this.onFinished.bind(this)}/>
      );
  }
}

export default DisplayTaskComponent;
