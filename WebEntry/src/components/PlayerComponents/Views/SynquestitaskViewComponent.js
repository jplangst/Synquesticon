import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';

import InstructionViewComponent from './InstructionViewComponent';
import TextEntryComponent from './TextEntryComponent';
import NumpadComponent from './NumpadComponent';
import ButtonViewComponent from './SingleChoiceComponent';
import ImageViewComponent from './ImageViewComponent';
//import ComparisonViewComponent from './Views/ComparisonViewComponent';

import shuffle from '../../../core/shuffle';
import * as dbObjects from '../../../core/db_objects';
import * as dbObjectsUtilityFunctions from '../../../core/db_objects_utility_functions';
import * as playerUtils from '../../../core/player_utility_functions';

import './SynquestitaskItem.css';

class SynquestitaskViewComponent extends Component {
  constructor(props) {
    super(props);

    //Map to hold all the answers from the questions
    //in key = questionID, value = [AnswerList]}
    this.taskResponses = new Map();

    this.answerCallback = this.onAnswer.bind(this);
  }

  //Callback from the task components when the user has provided an answer
  onAnswer(answerObj) {
    //Update the map with the resonse to the task, overwriting any existing answer for that task
    var lineOfData = this.taskResponses.get(this.props.task._id+answerObj.mapID);

    if (lineOfData.firstResponseTimestamp === -1) { //log the timeToFirstAnswer
      lineOfData.firstResponseTimestamp = playerUtils.getCurrentTime();
      lineOfData.timeToFirstAnswer = lineOfData.firstResponseTimestamp - lineOfData.startTimestamp;
    }

    //update answers
    lineOfData.responses = answerObj.responses;
    lineOfData.correctlyAnswered = answerObj.correctlyAnswered;

    if (answerObj.taskID+answerObj.mapID) {
      this.taskResponses.set(answerObj.taskID+answerObj.mapID, lineOfData);
    }
    this.props.answerCallback({linesOfData: this.taskResponses, correctlyAnswered: answerObj.correctlyAnswered});
  }

  logTheStartOfTask(task, _id, mapIndex) {
    if (!this.props.hasBeenInitiated) {
      var newLine = new dbObjects.LineOfData(playerUtils.getCurrentTime(),
                                             _id,
                                             this.props.tasksFamilyTree,
                                             task.displayText,
                                             task.correctResponses,
                                             "SingleItem",
                                             task.objType);

      if(this.props.task.globalVariable) {
        newLine.isGlobalVariable = true;
        newLine.label = task.displayText;
      }
      this.taskResponses.set(_id + mapIndex, newLine);
      this.props.logTheStartOfTask(this.props.task, newLine, mapIndex);
    }
  }

  getDisplayedContent(taskList, _id, mapIndex){
    return taskList.map((item, i) => {
      mapIndex = i;
      if(this.props.newTask && item.objType !== "Instruction" && item.objType !== "Image") {
        this.logTheStartOfTask(item, _id, mapIndex);
      }

      var key = _id+"Synquestitask"+i;

      if(item.objType === dbObjects.TaskTypes.INSTRUCTION.type){
          return <InstructionViewComponent className="itemContainer" key={key} task={item} mapID={mapIndex} parentSet={this.props.task.name}/>;
      }
      else if(item.objType === dbObjects.TaskTypes.TEXTENTRY.type){
          return <TextEntryComponent className="itemContainer" key={key} task={item} answerCallback={this.answerCallback} mapID={mapIndex} parentSet={this.props.task.name}/>;
      }
      else if(item.objType === dbObjects.TaskTypes.MCHOICE.type){
          return <ButtonViewComponent className="itemContainer" key={key} task={item} answerCallback={this.answerCallback} mapID={mapIndex} parentSet={this.props.task.name}/>;
      }
      else if(item.objType === dbObjects.TaskTypes.IMAGE.type) {
          return <ImageViewComponent className="itemContainer" key={key} task={item} mapID={mapIndex} parentSet={this.props.task.name}/>;
      }
      else if(item.objType === dbObjects.TaskTypes.NUMPAD.type) {
          return <NumpadComponent className="itemContainer" key={key} task={item} answerCallback={this.answerCallback} mapID={mapIndex} parentSet={this.props.task.name}/>;
      }
      // else if(item.objType === "Comparison") {
      //     return <ComparisonViewComponent className="itemContainer" key={key} task={item} answerCallback={this.answerCallback} mapID={mapIndex} parentSet={this.props.task.name}/>;
      // }
      else{
        return null;
      }
    });
  }

  render() {
    var runThisTaskSet = this.props.task.childObj;

    var content = this.getDisplayedContent(runThisTaskSet, this.props.task._id ,0);
    this.props.initCallback(this.taskResponses);
    return (
        <div className="multiItemContent">
          {content}
        </div>
      );
  }
}

export default SynquestitaskViewComponent;
