import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import InstructionViewComponent from '../Views/InstructionViewComponent';
import TextEntryComponent from '../Views/TextEntryComponent';
import SingleChoiceComponent from '../Views/SingleChoiceComponent';
import MultipleChoiceComponent from '../Views/MultipleChoiceComponent';
import ImageViewComponent from '../Views/ImageViewComponent';

import store from '../../core/store';
import wamp from '../../core/wamp';
import db_helper from '../../core/db_helper';
import * as dbObjects from '../../core/db_objects';
import * as dbObjectsUtilityFunctions from '../../core/db_objects_utility_functions';
import * as playerUtils from '../../core/player_utility_functions';

import './MultiItemTask.css';

class MultiItemTask extends React.Component {
  constructor() {
    super();
    this.state = {
      hasBeenAnswered: false
    }

    //Map to hold all the answers from the questions
    //in key = questionID, value = [AnswerList]}
    this.questionAnswers = new Map();

    this.handleGazeLocUpdate = this.updateCursorLocation.bind(this);

    this.answerCallback = this.onAnswer.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.handleGazeLocUpdate, 4.5); //Update the gaze cursor location every 2ms
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  //TODO tweak this for the multi-item
  logTheStartOfTask() {
    var startTimestamp = playerUtils.getCurrentTime();
    this.currentLineOfData = new dbObjects.LineOfData(startTimestamp,
                                                      this.currentTask._id,
                                                      this.props.tasksFamilyTree, //the array that has the task's tasksFamilyTree
                                                      dbObjectsUtilityFunctions.getTaskContent(this.currentTask),
                                                      this.currentTask.correctResponses);

    wamp.broadcastEvents(playerUtils.stringifyWAMPMessage(this.currentTask, startTimestamp, "START"));
  }

  //Updates the location of the Gaze Cursor. And checks if any of the AOIs were looked at
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

  //TODO tweak this for the multi-item
  onClickNext() {
    this.props.onFinished();
    /*if (!(store.getState().experimentInfo.participantId === "TESTING")) {
      if (this.currentLineOfData) {
        if (!this.currentTask.globalVariable) {
          //complete line of data before saving to DB
          this.currentLineOfData.timeToCompletion = getCurrentTime() - this.currentLineOfData.startTimestamp;
          db_helper.addNewLineToParticipantDB(store.getState().experimentInfo.participantId,
                                                JSON.stringify(this.currentLineOfData));
        }
        else {
          var globalVariableObj = {
            label: this.currentTask.question,
            value: this.currentLineOfData.responses
          };
          db_helper.addNewGlobalVariableToParticipantDB(store.getState().experimentInfo.participantId,
                                                          JSON.stringify(globalVariableObj));
        }

        wamp.broadcastEvents(stringifyWAMPMessage(this.currentLineOfData, null,
                                                  this.state.hasBeenAnswered ? "NEXT" : "SKIP"));
      }
    }*/

    //TODO call callback from whoever created this component
  }

  //TODO tweak this for the multi-item
  onAnswer(answerObj) {
    console.log(answerObj);
    this.setState({
      hasBeenAnswered: true,
    });
  }

  getDisplayedContent(taskList){
    return taskList.map((item) => {
      if(item.objType === "Task"){
        var key = item._id+"MultiItemTask";
        if(item.taskType === "Instruction"){
            return <InstructionViewComponent key={key} task={item} answerCallback={this.answerCallback} hasBeenAnswered={this.state.hasBeenAnswered}/>;
        }
        else if(item.taskType === "Text Entry"){
            return <TextEntryComponent key={key} task={item} answerCallback={this.answerCallback} hasBeenAnswered={this.state.hasBeenAnswered}/>;
        }
        else if(item.taskType === "Single Choice"){
            return <SingleChoiceComponent key={key} task={item} answerCallback={this.answerCallback} hasBeenAnswered={this.state.hasBeenAnswered}/>;
        }
        else if(item.taskType === "Multiple Choice"){
            return <MultipleChoiceComponent key={key} task={item} answerCallback={this.answerCallback} hasBeenAnswered={this.state.hasBeenAnswered}/>;
        }
        else if(item.taskType === "Image") {
            return <ImageViewComponent key={key} task={item}/>;
        }
      }
      else{ //If it is a set we recursively call this function to render the set children
        return this.getDisplayedContent(item.data);
      }
    });
  }

  render() {
    return (
      <div className="multiItemContainer">
        <div className="multiItemContent">
          {this.getDisplayedContent(this.props.taskSet)}
        </div>
        <div className="multiItemButtonContainer">
          <Button variant="outlined" onClick={this.onClickNext.bind(this)}>
            Next
          </Button>
        </div>
      </div>
      );
    }
}

export default MultiItemTask;
