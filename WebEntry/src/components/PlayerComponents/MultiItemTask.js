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
  constructor(props) {
    super(props);

    //Map to hold all the answers from the questions
    //in key = questionID, value = [AnswerList]}
    this.taskResponses = new Map();

    this.handleGazeLocUpdate = this.updateCursorLocation.bind(this);

    this.answerCallback = this.onAnswer.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.handleGazeLocUpdate, 4.5); //Update the gaze cursor location every 2ms
    //this.logTheStartOfTask();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  //TODO tweak this for the multi-item
  // logTheStartOfTask() {
  //   var startTimestamp = playerUtils.getCurrentTime();
  //   this.currentLineOfData = new dbObjects.LineOfData(startTimestamp,
  //                                                     //this.currentTask._id,
  //                                                     this.props.tasksFamilyTree); //the array that has the task's tasksFamilyTree
  //
  //                                                     //TODO - verify Not needed fro this type of task?
  //                                                     //dbObjectsUtilityFunctions.getTaskContent(this.currentTask),
  //                                                     //this.currentTask.correctResponses);
  //
  //   wamp.broadcastEvents(playerUtils.stringifyWAMPMessage(this.props.tasksFamilyTree, startTimestamp, "START"));
  // }

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
  }

  //Callback from the task components when the user has provided an answer
  onAnswer(answerObj) {
    console.log(answerObj);
    //Update the map with the resonse to the task, overwriting any existing answer for that task
    this.taskResponses.set(answerObj.taskID+answerObj.mapID, answerObj);
    console.log(this.taskResponses);
    //Update the state to rerender the components so we can see the new user input

    this.forceUpdate();
    // this.setState({
    //   hasBeenAnswered: true,
    // });
  }

  getDisplayedContent(taskList, mapIndex){
    return taskList.map((item, i) => {
      if(item.objType === "Task"){
        mapIndex += i;
        var key = item._id+"MultiItemTask";
        if(item.taskType === "Instruction"){
            return <InstructionViewComponent key={key} task={item} answerCallback={this.answerCallback} mapID={mapIndex}/>;
        }
        else if(item.taskType === "Text Entry"){
            return <TextEntryComponent key={key} task={item} answerCallback={this.answerCallback} mapID={mapIndex}/>;
        }
        else if(item.taskType === "Single Choice"){
            return <SingleChoiceComponent key={key} task={item} answerCallback={this.answerCallback} mapID={mapIndex}/>;
        }
        else if(item.taskType === "Multiple Choice"){
            return <MultipleChoiceComponent key={key} task={item} answerCallback={this.answerCallback} mapID={mapIndex}/>;
        }
        else if(item.taskType === "Image") {
            return <ImageViewComponent key={key} task={item} mapID={mapIndex}/>;
        }
      }
      else{ //If it is a set we recursively call this function to render the set children
        return this.getDisplayedContent(item.data, mapIndex*1000);
      }
    });
  }

  render() {
    return (
      <div className="multiItemContainer">
        <div className="multiItemContent">
          {this.getDisplayedContent(this.props.taskSet, 0)}
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
