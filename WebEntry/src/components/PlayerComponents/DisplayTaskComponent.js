import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';

//view components
import InstructionViewComponent from '../Views/InstructionViewComponent';
import TextEntryComponent from '../Views/TextEntryComponent';
import SingleChoiceComponent from '../Views/SingleChoiceComponent';
import MultipleChoiceComponent from '../Views/MultipleChoiceComponent';
import ImageViewComponent from '../Views/ImageViewComponent';
import ComparisonViewComponent from '../Views/ComparisonViewComponent';

import MultiItemTask from './MultiItemTask';

import PauseDialog from '../dialogs/PauseDialog';

import wamp from '../../core/wamp';
import wampStore from '../../core/wampStore';
import store from '../../core/store';
import shuffle from '../../core/shuffle';
import db_helper from '../../core/db_helper';
import * as dbObjects from '../../core/db_objects';
import * as dbObjectsUtilityFunctions from '../../core/db_objects_utility_functions';
import * as playerUtils from '../../core/player_utility_functions';
import queryString from 'query-string';

import './DisplayTaskComponent.css';

var checkShouldSave = true;

function stringifyWAMPMessage(task, lineOfData, eventType, progressCount, taskIndex) {
  try {

    if (store.getState().experimentInfo.participantId === undefined) {
      return null;
    }
    return JSON.stringify({
                            eventType: eventType,
                            participantId: store.getState().experimentInfo.participantId,
                            participantLabel: store.getState().experimentInfo.participantLabel,
                            startTimestamp: store.getState().experimentInfo.startTimestamp,
                            selectedTracker: store.getState().experimentInfo.selectedTracker,
                            task: task,
                            lineOfData: lineOfData,
                            taskSetCount: store.getState().experimentInfo.taskSetCount,
                            progressCount: progressCount,
                            taskIndex: taskIndex
                          });
  } catch (err) {
    return JSON.stringify({
                            eventType: eventType,
                            participantId: store.getState().experimentInfo.participantId,
                            participantLabel: store.getState().experimentInfo.participantLabel,
                            startTimestamp: store.getState().experimentInfo.startTimestamp,
                            selectedTracker: store.getState().experimentInfo.selectedTracker,
                            task: dbObjects.removeCircular(task),
                            lineOfData: lineOfData,
                            taskSetCount: store.getState().experimentInfo.taskSetCount,
                            progressCount: progressCount,
                            taskIndex: taskIndex
                          });
  }
}

/*
██████  ███████  ██████ ██    ██ ██████  ███████ ██  ██████  ███    ██      ██████  ██████  ███    ███ ██████   ██████  ███    ██ ███████ ███    ██ ████████
██   ██ ██      ██      ██    ██ ██   ██ ██      ██ ██    ██ ████   ██     ██      ██    ██ ████  ████ ██   ██ ██    ██ ████   ██ ██      ████   ██    ██
██████  █████   ██      ██    ██ ██████  ███████ ██ ██    ██ ██ ██  ██     ██      ██    ██ ██ ████ ██ ██████  ██    ██ ██ ██  ██ █████   ██ ██  ██    ██
██   ██ ██      ██      ██    ██ ██   ██      ██ ██ ██    ██ ██  ██ ██     ██      ██    ██ ██  ██  ██ ██      ██    ██ ██  ██ ██ ██      ██  ██ ██    ██
██   ██ ███████  ██████  ██████  ██   ██ ███████ ██  ██████  ██   ████      ██████  ██████  ██      ██ ██       ██████  ██   ████ ███████ ██   ████    ██
*/

class DisplayTaskHelper extends React.Component { //for the fking sake of recursion
  constructor() {
    super();
    this.state = {
      currentTaskIndex: 0,
      hasBeenAnswered: false
    }
    this.progressCount = 0;
    this.numCorrectAnswers = 0;
    this.currentTask = null;
    this.currentLineOfData = null;
  }

  /*
   ██████  ██████  ███    ███ ██████   ██████  ███    ██ ███████ ███    ██ ████████     ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████
  ██      ██    ██ ████  ████ ██   ██ ██    ██ ████   ██ ██      ████   ██    ██        ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██
  ██      ██    ██ ██ ████ ██ ██████  ██    ██ ██ ██  ██ █████   ██ ██  ██    ██        █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████
  ██      ██    ██ ██  ██  ██ ██      ██    ██ ██  ██ ██ ██      ██  ██ ██    ██        ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
   ██████  ██████  ██      ██ ██       ██████  ██   ████ ███████ ██   ████    ██        ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████
  */


  componentDidMount() {

  }

  componentWillMount() {
    this.progressCount = this.props.progressCount;
  }

  /*
██       ██████   ██████   ██████  ██ ███    ██  ██████
██      ██    ██ ██       ██       ██ ████   ██ ██
██      ██    ██ ██   ███ ██   ███ ██ ██ ██  ██ ██   ███
██      ██    ██ ██    ██ ██    ██ ██ ██  ██ ██ ██    ██
███████  ██████   ██████   ██████  ██ ██   ████  ██████
*/

  logTheStartOfTask() {
    var startTimestamp = playerUtils.getCurrentTime();
    if (this.currentTask.objType === "Task") {
      this.currentLineOfData = new dbObjects.LineOfData(startTimestamp,
                                                        this.currentTask._id,
                                                        this.props.tasksFamilyTree, //the array that has the task's tasksFamilyTree
                                                        dbObjectsUtilityFunctions.getTaskContent(this.currentTask),
                                                        this.currentTask.correctResponses,
                                                        "SingleItem");
      wamp.broadcastEvents(stringifyWAMPMessage(this.currentTask, this.currentLineOfData, "START", this.progressCount, this.progressCount+1));
    }
  }

  /*
   ██████  █████  ██      ██      ██████   █████   ██████ ██   ██ ███████
  ██      ██   ██ ██      ██      ██   ██ ██   ██ ██      ██  ██  ██
  ██      ███████ ██      ██      ██████  ███████ ██      █████   ███████
  ██      ██   ██ ██      ██      ██   ██ ██   ██ ██      ██  ██       ██
   ██████ ██   ██ ███████ ███████ ██████  ██   ██  ██████ ██   ██ ███████
  */
  checkShouldRecordData(label, responses) {
    if (checkShouldSave) {
      if (label.toLowerCase().includes("record data")) {
        for(var i = 0; i < responses.length; i++) {
            if(responses[i].toLowerCase() === "no") {
              var saveAction = {
                type: 'SET_SHOULD_SAVE',
                shouldSave: false
              }
              store.dispatch(saveAction);
              db_helper.deleteParticipantFromDb(store.getState().experimentInfo.participantId, () => {});
            }
        }
      }
      checkShouldSave = false;
    }
  }

  /*
███    ██ ███████ ██   ██ ████████
████   ██ ██       ██ ██     ██
██ ██  ██ █████     ███      ██
██  ██ ██ ██       ██ ██     ██
██   ████ ███████ ██   ██    ██
*/
  onClickNext() {
    //===========reset aoi list===========
    var aoiAction = {
      type: 'RESET_AOIS'
    }

    store.dispatch(aoiAction);

    //===========save gazedata===========
    this.props.saveGazeData(dbObjectsUtilityFunctions.getTaskContent(this.currentTask));

    //===========save logging data===========
    //single task
    if (this.currentTask.objType === "Task") {
      if (this.currentLineOfData.correctlyAnswered === "correct") {
        this.numCorrectAnswers += 1;
      }
      this.progressCount += 1;
      if (this.currentLineOfData) {
        if (!this.currentTask.globalVariable) {
          //complete line of data before saving to DB
          this.currentLineOfData.timeToCompletion = playerUtils.getCurrentTime() - this.currentLineOfData.startTimestamp;
          if (store.getState().experimentInfo.shouldSave) {
            db_helper.addNewLineToParticipantDB(store.getState().experimentInfo.participantId, JSON.stringify(this.currentLineOfData));
          }
        }
        else {
          var globalVariableObj = {
            label: this.currentTask.question,
            value: this.currentLineOfData.responses
          };
          if (store.getState().experimentInfo.shouldSave) {
            db_helper.addNewGlobalVariableToParticipantDB(store.getState().experimentInfo.participantId, JSON.stringify(globalVariableObj));
          }
        }

        wamp.broadcastEvents(stringifyWAMPMessage(this.currentTask, this.currentLineOfData,
                                                  (this.currentLineOfData.firstResponseTimestamp !== -1) ? "ANSWERED" : "SKIPPED",
                                                  this.progressCount,
                                                 -1));
      }
    }
    //multi-item page
    else if (this.currentTask.objType === "TaskSet" && this.currentTask.displayOnePage) {
      this.progressCount += this.currentLineOfData.size;
      this.currentLineOfData.forEach((line, index) => {
        if (line.isGlobalVariable !== undefined) {
          var globalVariableObj = {
            label: line.question,
            value: line.responses
          };
          if (store.getState().experimentInfo.shouldSave) {
            db_helper.addNewGlobalVariableToParticipantDB(store.getState().experimentInfo.participantId, JSON.stringify(globalVariableObj));
          }
        }
        else {
          line.timeToCompletion = playerUtils.getCurrentTime() - line.startTimestamp;
          if (store.getState().experimentInfo.shouldSave) {
            db_helper.addNewLineToParticipantDB(store.getState().experimentInfo.participantId, JSON.stringify(line));
          }
        }
        wamp.broadcastEvents(stringifyWAMPMessage({_id:line.taskId}, line,
                                                  (line.firstResponseTimestamp !== -1) ? "ANSWERED" : "SKIPPED",
                                                  this.progressCount, -1));
      });
    }

    //===========check requirement of number of correct answers===========
    if ((this.state.currentTaskIndex + 1) >= this.props.taskSet.data.length && this.numCorrectAnswers < this.props.repeatSetThreshold){
      if (!(store.getState().experimentInfo.participantId === "TESTING")) {
        alert("you did not meet the required number of correct answers. This set will be repeated now.");

        this.progressCount = this.props.progressCount;

        this.numCorrectAnswers = 0;
        this.currentLineOfData = null;
        //reset state
        this.setState({
          hasBeenAnswered: false,
          answerItem: null,
          currentTaskIndex: 0
        });

        return;
      }
    }

    if (this.currentTask.objType === "TaskSet" && this.currentTask.displayOnePage && this.currentTask.numCorrectAnswers < this.currentTask.repeatSetThreshold) {
      if (!(store.getState().experimentInfo.participantId === "TESTING")) {
        alert("you did not meet the required number of correct answers.");
        this.progressCount = this.props.progressCount;
        return;
      }
    }

    //===========reset===========
    this.currentLineOfData = null;

    //reset state
    this.setState({
      hasBeenAnswered: false,
      answerItem: null,
      currentTaskIndex: (this.state.currentTaskIndex + 1)
    });
  }

  onAnswer(answer) {
    if(!(store.getState().experimentInfo.participantId === "TESTING")) {
      if (this.currentTask.objType === "Task") {
        this.checkShouldRecordData(this.currentTask.question, answer.responses);
        if (this.currentLineOfData.firstResponseTimestamp === -1) { //log the timeToFirstAnswer
          this.currentLineOfData.firstResponseTimestamp = playerUtils.getCurrentTime();
          this.currentLineOfData.timeToFirstAnswer = this.currentLineOfData.firstResponseTimestamp - this.currentLineOfData.startTimestamp;
        }
        //update answers
        this.currentLineOfData.responses = answer.responses;
        this.currentLineOfData.correctlyAnswered = answer.correctlyAnswered;
      }
      else if (this.currentTask.objType === "TaskSet" && this.currentTask.displayOnePage) {
        this.currentLineOfData = answer.linesOfData;
        if (answer.correctlyAnswered === "correct") {
          this.currentTask.numCorrectAnswers += 1;
        }
      }
    }
    this.setState({
      hasBeenAnswered: true
    });
  }

  onFinishedRecursion() {
    this.progressCount += this.currentTask.data.length;
    this.onClickNext(false);
  }

  /*
  ██████  ███████ ███    ██ ██████  ███████ ██████
  ██   ██ ██      ████   ██ ██   ██ ██      ██   ██
  ██████  █████   ██ ██  ██ ██   ██ █████   ██████
  ██   ██ ██      ██  ██ ██ ██   ██ ██      ██   ██
  ██   ██ ███████ ██   ████ ██████  ███████ ██   ██
  */


  render() {
    //check if we should enter a new level or leave
    if(this.props.taskSet.data.length > 0 && this.state.currentTaskIndex < this.props.taskSet.data.length) {
      this.currentTask = this.props.taskSet.data[this.state.currentTaskIndex];
      let trackingTaskSetNames = this.props.tasksFamilyTree.slice(); //clone array, since javascript passes by reference, we need to keep the orgin familyTree untouched
      trackingTaskSetNames.push(this.currentTask.name);
      var parentSet = this.props.tasksFamilyTree[this.props.tasksFamilyTree.length - 1];
      if (this.currentTask.objType === "TaskSet" && !this.currentTask.displayOnePage) {
        //shuffle set if set was marked as "Random"
        var runThisTaskSet = this.currentTask.data;
        if (this.currentTask.setTaskOrder === "Random") {
          runThisTaskSet = shuffle(runThisTaskSet);
        }

        let updatedTaskSet = this.currentTask;
        updatedTaskSet.data = runThisTaskSet;

        //recursion
        let id = this.currentTask._id + "_" + this.progressCount;
        return <DisplayTaskHelper key={id}
                                  tasksFamilyTree={trackingTaskSetNames}
                                  taskSet={updatedTaskSet}
                                  onFinished={this.onFinishedRecursion.bind(this)}
                                  saveGazeData={this.props.saveGazeData}
                                  progressCount={this.progressCount}
                                  repeatSetThreshold={updatedTaskSet.repeatSetThreshold}/>
      }
      else {
        //log the start

        if (!this.state.hasBeenAnswered
            && !(store.getState().experimentInfo.participantId === "TESTING")
            && !this.currentLineOfData) {
          this.logTheStartOfTask();
        }

        var getDisplayedContent = () => {
          if(this.currentTask){
            if((this.currentTask.objType === "TaskSet") && this.currentTask.displayOnePage) {
              if (this.currentTask.numCorrectAnswers === undefined) {
                this.currentTask.numCorrectAnswers = 0;
              }
              return <MultiItemTask tasksFamilyTree={trackingTaskSetNames}
                                    taskSet={this.currentTask}
                                    answerCallback={this.onAnswer.bind(this)}
                                    newTask={!this.state.hasBeenAnswered}
                                    initCallback={(taskResponses) => {
                                      this.currentLineOfData = taskResponses;
                                    }}
                                    logTheStartOfTask={(task, log, ind) => {
                                      wamp.broadcastEvents(stringifyWAMPMessage(task, log, "START", this.progressCount, this.progressCount+ind+1))
                                    }}/>
            }
            if((this.currentTask.taskType === "Instruction")) {
              return <InstructionViewComponent className="commonContainer" task={this.currentTask} answerCallback={this.onAnswer.bind(this)} parentSet={parentSet}/>;
            }
            if(this.currentTask.taskType  === "Text Entry") {
              return <TextEntryComponent className="commonContainer" task={this.currentTask} answerCallback={this.onAnswer.bind(this)} answerItem={this.state.answerItem} newTask={!this.state.hasBeenAnswered} parentSet={parentSet}/>;
            }
            if(this.currentTask.taskType === "Single Choice") {
              return <SingleChoiceComponent className="commonContainer" task={this.currentTask} answerCallback={this.onAnswer.bind(this)} answerItem={this.state.answerItem} newTask={!this.state.hasBeenAnswered} parentSet={parentSet}/>;
            }
            if((this.currentTask.taskType === "Multiple Choice")) {
              return <MultipleChoiceComponent className="commonContainer" task={this.currentTask} answerCallback={this.onAnswer.bind(this)} answerItem={this.state.answerItem} newTask={!this.state.hasBeenAnswered} parentSet={parentSet}/>;
            }
            if((this.currentTask.taskType === "Image")) {
              return <ImageViewComponent className="commonContainer" task={this.currentTask} taskIndex={this.state.currentTaskIndex} parentSet={parentSet}/>;
            }
            if((this.currentTask.taskType === "Comparison")) {
              return <ComparisonViewComponent task={this.currentTask} answerCallback={this.onAnswer.bind(this)} answerItem={this.state.answerItem} newTask={!this.state.hasBeenAnswered} parentSet={parentSet}/>;
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

/*
██     ██ ██████   █████  ██████  ██████  ███████ ██████       ██████  ██████  ███    ███ ██████   ██████  ███    ██ ███████ ███    ██ ████████
██     ██ ██   ██ ██   ██ ██   ██ ██   ██ ██      ██   ██     ██      ██    ██ ████  ████ ██   ██ ██    ██ ████   ██ ██      ████   ██    ██
██  █  ██ ██████  ███████ ██████  ██████  █████   ██████      ██      ██    ██ ██ ████ ██ ██████  ██    ██ ██ ██  ██ █████   ██ ██  ██    ██
██ ███ ██ ██   ██ ██   ██ ██      ██      ██      ██   ██     ██      ██    ██ ██  ██  ██ ██      ██    ██ ██  ██ ██ ██      ██  ██ ██    ██
 ███ ███  ██   ██ ██   ██ ██      ██      ███████ ██   ██      ██████  ██████  ██      ██ ██       ██████  ██   ████ ███████ ██   ████    ██
*/


class DisplayTaskComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPaused : false
    }
    this.handleNewCommandEvent = this.onNewCommandEvent.bind(this);

    this.gazeDataArray = [];
    this.frameDiv = React.createRef();
    this.cursorRadius = 20;
  }

  componentWillMount() {
    var layoutAction = {
      type: 'SET_SHOW_HEADER',
      showHeader: false,
      showFooter: false
    }

    store.dispatch(layoutAction);

    var parsed = queryString.parse(this.props.location.search);
    var mainTaskSetId = parsed.id;
    var tracker = parsed.tracker;

    if (mainTaskSetId !== undefined) {
      db_helper.getTasksOrTaskSetsWithIDs(mainTaskSetId, (dbQueryResult, count, mainTaskSetName) => {
        var action = {
          type: 'SET_EXPERIMENT_INFO',
          experimentInfo: {
            participantLabel: playerUtils.getDeviceName(),
            participantId: undefined,
            shouldSave: true,
            startTimestamp: playerUtils.getFormattedCurrentTime(),
            mainTaskSetId: mainTaskSetName,
            taskSet: dbQueryResult,
            taskSetCount: count,
            selectedTracker: tracker,
          }
        }

        store.dispatch(action);

        if (store.getState().experimentInfo.participantId === undefined) {
          db_helper.addParticipantToDb(new dbObjects.ParticipantObject(store.getState().experimentInfo.taskSet._id), (returnedIdFromDB)=> {
            var idAction = {
              type: 'SET_PARTICIPANT_ID',
              participantId: returnedIdFromDB
            };
            store.dispatch(idAction);
            this.forceUpdate();
          });
        }
      });

      //this.broadcastStartEvent();

      wampStore.addNewCommandListener(this.handleNewCommandEvent);
    }
  }

  componentDidMount() {
    if (store.getState().experimentInfo && store.getState().experimentInfo.participantId !== "TESTING" && (store.getState().experimentInfo.selectedTracker !== "")) {

      this.gazeDataArray = [];
      this.timer = setInterval(this.updateCursorLocation.bind(this), 4.5); //Update the gaze cursor location every 2ms
    }
    checkShouldSave = true;
  }

  componentWillUnmount() {
    if (store.getState().experimentInfo.participantId !== "TESTING" && (store.getState().experimentInfo.selectedTracker !== "")) {

      clearInterval(this.timer);
    }
    var layoutAction = {
      type: 'SET_SHOW_HEADER',
      showHeader: true,
      showFooter: true
    }

    store.dispatch(layoutAction);
    wampStore.removeNewCommandListener(this.handleNewCommandEvent);

    // console.log("should we save?", store.getState().experimentInfo.shouldSave);
    // if (!store.getState().experimentInfo.shouldSave) {
    //   console.log("remove participant");
    //   db_helper.deleteParticipantFromDb(store.getState().experimentInfo.participantId, () => {});
    // }

    var resetExperimentAction = {
      type: 'RESET_EXPERIMENT'
    }
    store.dispatch(resetExperimentAction);
  }

  /*
   ██████   █████  ███████ ███████
  ██       ██   ██    ███  ██
  ██   ███ ███████   ███   █████
  ██    ██ ██   ██  ███    ██
   ██████  ██   ██ ███████ ███████
  */


  saveGazeData(task) {

    if (this.gazeDataArray.length > 0) {
      var copiedGazeData = this.gazeDataArray.slice();
      this.gazeDataArray = [];
      db_helper.saveGazeData(store.getState().experimentInfo.participantId, task, copiedGazeData);
    }
  }

  //Updates the location of the Gaze Cursor. And checks if any of the AOIs were looked at
  updateCursorLocation(){
    try {
      let gazeLoc = store.getState().gazeData[store.getState().experimentInfo.selectedTracker];
      if(this.frameDiv){
        var cursorX = (gazeLoc.locX*this.frameDiv.current.offsetWidth-this.cursorRadius);
        var cursorY = (gazeLoc.locY*this.frameDiv.current.offsetHeight-this.cursorRadius);

        var aois = store.getState().aois;


        for (var i = 0; i < aois.length; i++) {
          var a = aois[i];

          //console.log("imageDiv", a.imageRef.ge, a.imageWrapper.current);
          var imageDivRect = a.imageRef.current.getBoundingClientRect();
          var polygon = [];
          if (a.boundingbox.length > 0) {
            a.boundingbox.map((p, ind) => {
              var x = p[0]*imageDivRect.width/100 + imageDivRect.x;
              var y = p[1]*imageDivRect.height/100 + imageDivRect.y;
              polygon.push([x, y]);
              return 1;
            });
          }
          else {
            polygon.push([imageDivRect.x, imageDivRect.y]);
            polygon.push([imageDivRect.x + imageDivRect.width, imageDivRect.y]);
            polygon.push([imageDivRect.x + imageDivRect.width, imageDivRect.y + imageDivRect.height]);
            polygon.push([imageDivRect.x, imageDivRect.y + imageDivRect.height]);
          }
          if (playerUtils.pointIsInPoly([cursorX, cursorY], polygon)){
            gazeLoc.target = a;
            break;
          }
        }

        //var timestamp = playerUtils.getCurrentTime();
        if (!this.gazeDataArray.includes(gazeLoc)) {
          this.gazeDataArray.push(gazeLoc);
        }
      }



    } catch (err) {

    }
  }

  /*
██     ██  █████  ███    ███ ██████      ███████ ██    ██ ███████ ███    ██ ████████
██     ██ ██   ██ ████  ████ ██   ██     ██      ██    ██ ██      ████   ██    ██
██  █  ██ ███████ ██ ████ ██ ██████      █████   ██    ██ █████   ██ ██  ██    ██
██ ███ ██ ██   ██ ██  ██  ██ ██          ██       ██  ██  ██      ██  ██ ██    ██
 ███ ███  ██   ██ ██      ██ ██          ███████   ████   ███████ ██   ████    ██
*/


  broadcastStartEvent() {
    try {
      var info = JSON.stringify({
                                  eventType: "NEW EXPERIMENT",
                                  participantId: store.getState().experimentInfo.participantId,
                                  participantLabel: store.getState().experimentInfo.participantLabel,
                                  startTimestamp: store.getState().experimentInfo.startTimestamp,
                                  selectedTracker: store.getState().experimentInfo.selectedTracker,
                                  mainTaskSetId: store.getState().experimentInfo.mainTaskSetId,
                                  taskSetCount: store.getState().experimentInfo.taskSetCount
                                });
      wamp.broadcastEvents(info);
    }
    catch(err) {
      console.log(err);
    }
  }
  broadcastEndEvent() {
    var dt = new Date();
    var timestamp = dt.toUTCString();

    var info = JSON.stringify({
                                eventType: "FINISHED",
                                participantId: store.getState().experimentInfo.participantId,
                                participantLabel: store.getState().experimentInfo.participantLabel,
                                startTimestamp: store.getState().experimentInfo.startTimestamp,
                                selectedTracker: store.getState().experimentInfo.selectedTracker,
                                mainTaskSetId: store.getState().experimentInfo.mainTaskSetId,
                                timestamp: timestamp
                              });
    wamp.broadcastEvents(info);
  }

  /*
 ██████  ██████  ███    ███ ███    ███  █████  ███    ██ ██████  ███████
██      ██    ██ ████  ████ ████  ████ ██   ██ ████   ██ ██   ██ ██
██      ██    ██ ██ ████ ██ ██ ████ ██ ███████ ██ ██  ██ ██   ██ ███████
██      ██    ██ ██  ██  ██ ██  ██  ██ ██   ██ ██  ██ ██ ██   ██      ██
 ██████  ██████  ██      ██ ██      ██ ██   ██ ██   ████ ██████  ███████
*/
  onNewCommandEvent() {
    var args = JSON.parse(wampStore.getCurrentCommand());
    var shouldProcess = false;

    if (args.participantId === -1 || args.participantId === store.getState().experimentInfo.participantId) {
      shouldProcess = true;
    }

    if (shouldProcess) {
      switch (args.commandType) {
        case "PAUSE":
          this.setState({
            isPaused: true
          });
          break;
        case "RESUME":
          this.setState({
            isPaused: false
          });
          break;
        default:
          break;
      }
    }

  }

  onFinished() {
    if (!(store.getState().experimentInfo.participantId === "TESTING")) {
      this.broadcastEndEvent();
    }
    this.props.history.goBack();
    alert("finished!");
  }

  render() {
    if (store.getState().experimentInfo) {
      let theme = this.props.theme;
      let rightBG = theme.palette.type === "light" ? theme.palette.primary.main : theme.palette.primary.dark;

      try {
        var renderObj = <DisplayTaskHelper tasksFamilyTree={[store.getState().experimentInfo.mainTaskSetId]}
                                           taskSet={store.getState().experimentInfo.taskSet}
                                           onFinished={this.onFinished.bind(this)}
                                           saveGazeData={this.saveGazeData.bind(this)}
                                           progressCount={0}
                                           repeatSetThreshold={store.getState().experimentInfo.taskSet.repeatSetThreshold}/>;
        return (
            <div style={{backgroundColor:rightBG}} className="page" ref={this.frameDiv}>
              {renderObj}
              <PauseDialog openDialog={this.state.isPaused}/>
            </div>
        );
      }
      catch(err) {
        //alert("something went wrong!");
        return <div style={{backgroundColor:rightBG}}/>;
      }
    }
    return <Typography variant="h2" color="textPrimary" style={{position:'absolute', left:'50%', top:'50%'}}>Loading...</Typography>;
  }
}

export default withTheme(DisplayTaskComponent);
