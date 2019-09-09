import React, { Component } from 'react';

import InstructionViewComponent from '../Views/InstructionViewComponent';
import TextEntryComponent from '../Views/TextEntryComponent';
import SingleChoiceComponent from '../Views/SingleChoiceComponent';
import MultipleChoiceComponent from '../Views/MultipleChoiceComponent';
import ImageViewComponent from '../Views/ImageViewComponent';

import shuffle from '../../core/shuffle';
import * as dbObjects from '../../core/db_objects';
import * as dbObjectsUtilityFunctions from '../../core/db_objects_utility_functions';
import * as playerUtils from '../../core/player_utility_functions';

import './MultiItemTask.css';

class MultiItemTask extends Component {
  constructor(props) {
    super(props);

    //Map to hold all the answers from the questions
    //in key = questionID, value = [AnswerList]}
    this.taskResponses = new Map();

    this.answerCallback = this.onAnswer.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  reset() {
    if (this.props.newTask) {
      this.taskResponses.clear();
    }
  }

  //Callback from the task components when the user has provided an answer
  onAnswer(answerObj) {
    //Update the map with the resonse to the task, overwriting any existing answer for that task
    var lineOfData = this.taskResponses.get(answerObj.taskID+answerObj.mapID);
    if (lineOfData.isGlobalVariable !== undefined) {
      lineOfData.obj = {
        label: lineOfData.question,
        value: answerObj.responses
      }
    }
    else {
      if (lineOfData.firstResponseTimestamp === -1) { //log the timeToFirstAnswer
        lineOfData.firstResponseTimestamp = playerUtils.getCurrentTime();
        lineOfData.timeToFirstAnswer = lineOfData.firstResponseTimestamp - lineOfData.startTimestamp;
      }

      //update answers
      lineOfData.responses = answerObj.responses;
      lineOfData.correctlyAnswered = answerObj.correctlyAnswered;
    }

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
    this.props.logTheStartOfTask(task, newLine);
  }

  getDisplayedContent(taskList, mapIndex){
    return taskList.map((item, i) => {
      if(item.objType === "Task"){
        mapIndex = i;
        if(this.props.newTask) {
          this.logTheStartOfTask(item, mapIndex);
        }

        var key = item._id+"MultiItemTask";

        if(item.taskType === "Instruction"){
            return <InstructionViewComponent className="itemContainer" key={key} task={item} answerCallback={this.answerCallback} mapID={mapIndex}/>;
        }
        else if(item.taskType === "Text Entry"){
            return <TextEntryComponent className="itemContainer" key={key} task={item} answerCallback={this.answerCallback} mapID={mapIndex}/>;
        }
        else if(item.taskType === "Single Choice"){
            return <SingleChoiceComponent className="itemContainer" key={key} task={item} answerCallback={this.answerCallback} mapID={mapIndex}/>;
        }
        else if(item.taskType === "Multiple Choice"){
            return <MultipleChoiceComponent className="itemContainer" key={key} task={item} answerCallback={this.answerCallback} mapID={mapIndex}/>;
        }
        else if(item.taskType === "Image") {
            return <ImageViewComponent className="itemContainer" key={key} task={item} mapID={mapIndex}/>;
        }
      }
      else{ //If it is a set we recursively call this function to render the set children
        return this.getDisplayedContent(item.data, mapIndex*1000);
      }
    });
  }

  render() {
    this.reset();
    var runThisTaskSet = this.props.taskSet.data;
    if (this.props.taskSet.setTaskOrder === "Random") {
      runThisTaskSet = shuffle(runThisTaskSet);
    }
    var content = this.getDisplayedContent(runThisTaskSet, 0);
    this.props.initCallback(this.taskResponses);
    return (
        <div className="multiItemContent">
          {content}
        </div>
      );
    }
}

export default MultiItemTask;
