import React, { Component } from 'react';

import InstructionViewComponent from '../Views/InstructionViewComponent';
import TextEntryComponent from '../Views/TextEntryComponent';
import SingleChoiceComponent from '../Views/SingleChoiceComponent';
import MultipleChoiceComponent from '../Views/MultipleChoiceComponent';
import ImageViewComponent from '../Views/ImageViewComponent';
import ComparisonViewComponent from '../Views/ComparisonViewComponent';

import shuffle from '../../core/shuffle';
import * as dbObjects from '../../core/db_objects';
import * as dbObjectsUtilityFunctions from '../../core/db_objects_utility_functions';
import * as playerUtils from '../../core/player_utility_functions';

import '../PlayerComponents/MultiItemTask.css';

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
    var lineOfData = this.taskResponses.get(answerObj.taskID+answerObj.mapID);

    if (lineOfData.firstResponseTimestamp === -1) { //log the timeToFirstAnswer
      lineOfData.firstResponseTimestamp = playerUtils.getCurrentTime();
      lineOfData.timeToFirstAnswer = lineOfData.firstResponseTimestamp - lineOfData.startTimestamp;
    }

    //update answers
    lineOfData.responses = answerObj.responses;
    lineOfData.correctlyAnswered = answerObj.correctlyAnswered;

    this.taskResponses.set(answerObj.taskID+answerObj.mapID, lineOfData);
    this.props.answerCallback({linesOfData: this.taskResponses, correctlyAnswered: answerObj.correctlyAnswered});

    //this.forceUpdate();
  }

  logTheStartOfTask(task, ind) {
    var newLine = new dbObjects.LineOfData(playerUtils.getCurrentTime(),
                                           task._id,
                                           this.props.tasksFamilyTree,
                                           dbObjectsUtilityFunctions.getTaskContent(task),
                                           task.correctResponses,
                                           "MultiItem");
    if(task.globalVariable) {
      newLine.isGlobalVariable = true;
      newLine.question = task.question;
    }
    this.taskResponses.set(task._id + ind, newLine);
    this.props.logTheStartOfTask(task, newLine, ind);
  }

  getDisplayedContent(taskList, _id, mapIndex){
    return taskList.map((item, i) => {
      mapIndex = i;
      if(this.props.newTask) {
        this.logTheStartOfTask(item, mapIndex);
      }

      var key = _id+"Synquestitask"+i;

      if(item.objType === "Instruction"){
        console.log("instruction");
          return <InstructionViewComponent className="itemContainer" key={key} task={item} answerCallback={this.answerCallback} mapID={mapIndex} parentSet={this.props.task.name}/>;
      }
      else if(item.objType === "Text Entry"){
          return <TextEntryComponent className="itemContainer" key={key} task={item} answerCallback={this.answerCallback} mapID={mapIndex} parentSet={this.props.task.name}/>;
      }
      else if(item.objType === "Single Choice"){
          return <SingleChoiceComponent className="itemContainer" key={key} task={item} answerCallback={this.answerCallback} mapID={mapIndex} parentSet={this.props.task.name}/>;
      }
      else if(item.objType === "Multiple Choice"){
          return <MultipleChoiceComponent className="itemContainer" key={key} task={item} answerCallback={this.answerCallback} mapID={mapIndex} parentSet={this.props.task.name}/>;
      }
      else if(item.objType === "Image") {
        console.log("Image");
          return <ImageViewComponent className="itemContainer" key={key} task={item} mapID={mapIndex} parentSet={this.props.task.name}/>;
      }
      else if(item.objType === "Comparison") {
          return <ComparisonViewComponent className="itemContainer" key={key} task={item} answerCallback={this.answerCallback} mapID={mapIndex} parentSet={this.props.task.name}/>;
      }
      else{
        return null;
      }
    });
  }

  render() {
    var runThisTaskSet = this.props.task.childObj;
    console.log("synquestitask", runThisTaskSet);
    var content = this.getDisplayedContent(runThisTaskSet, this.props.task._id ,0);
    console.log("content", content);
    this.props.initCallback(this.taskResponses);
    return (
        <div className="multiItemContent">
          {content}
        </div>
      );
  }
}

export default SynquestitaskViewComponent;
