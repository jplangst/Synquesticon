import React, { Component } from 'react';

import InstructionViewComponent from './InstructionViewComponent';
import TextEntryComponent from './TextEntryComponent';
import NumpadComponent from './NumpadComponent';
import ButtonViewComponent from './ButtonViewComponent';
import ImageViewComponent from './ImageViewComponent';
//import ComparisonViewComponent from './Views/ComparisonViewComponent';

import store from '../../../core/store';
import * as dbObjects from '../../../core/db_objects';
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

    //update answer
    lineOfData.clickedPoints = answerObj.clickedPoints;
    lineOfData.responses = Array.isArray(answerObj.responses)?answerObj.responses:[];
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
                                             task.objType===dbObjects.TaskTypes.IMAGE.type?task.image:task.displayText,
                                             task.correctResponses,
                                             task.objType);
      if(task.globalVariable) {
        newLine.isGlobalVariable = true;
        newLine.label = task.displayText;
      }
      if (!task.resetResponses) { //this item is authorized to log its own data, remove the logging from parent task
        this.taskResponses.set(_id + mapIndex, newLine);
      }

      this.props.logTheStartOfTask(this.props.task, newLine, mapIndex);
      return newLine;
    }
    return null;
  }

  getDisplayedContent(taskList, _id, mapIndex){
    return taskList.map((item, i) => {

      if((store.getState().multipleScreens && (item.screenIDS.includes(store.getState().screenID)
      || item.screenIDS.length===0)) || !store.getState().multipleScreens){
        mapIndex = i;
        var newLine = null;
        if(this.props.newTask /*&& item.objType !== "Instruction"*/) {
          newLine = this.logTheStartOfTask(item, _id, mapIndex);
        }
        var key = this.props.childKey+"Synquestitask"+i;

        if(item.objType === dbObjects.TaskTypes.INSTRUCTION.type){
            return <InstructionViewComponent className="itemContainer" key={key} task={item} mapID={mapIndex} parentSet={this.props.task.name}/>;
        }
        else if(item.objType === dbObjects.TaskTypes.TEXTENTRY.type){
            return <TextEntryComponent className="itemContainer" key={key} task={item} answerCallback={this.answerCallback} mapID={mapIndex} parentSet={this.props.task.name}/>;
        }
        else if(item.objType === dbObjects.TaskTypes.MCHOICE.type){
            return <ButtonViewComponent className="itemContainer" key={key} task={item} answerCallback={this.answerCallback} mapID={mapIndex} parentSet={this.props.task.name} delegate={newLine}/>;
        }
        else if(item.objType === dbObjects.TaskTypes.IMAGE.type) {
            return <ImageViewComponent className="itemContainer" key={key} task={item} answerCallback={this.answerCallback} mapID={mapIndex} parentSet={this.props.task.name}/>;
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
      }
      return null;
    });
  }

  render() {
    var runThisTaskSet = this.props.task.childObj;

    var content = this.getDisplayedContent(runThisTaskSet, this.props.task._id ,0);
    this.props.initCallback(this.taskResponses);

    return (
        <div key={this.props.renderKey} className="multiItemContent">
          {content}
        </div>
      );
  }
}

export default SynquestitaskViewComponent;
