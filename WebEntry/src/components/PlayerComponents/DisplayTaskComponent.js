import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';

import SynquestitaskViewComponent from './Views/SynquestitaskViewComponent';

import PauseDialog from './PauseDialog';

import mqtt from '../../core/mqtt'

import eventStore from '../../core/eventStore';
import store from '../../core/store';
import shuffle from '../../core/shuffle';
import db_helper from '../../core/db_helper';
import * as dbObjects from '../../core/db_objects';
import * as dbObjectsUtilityFunctions from '../../core/db_objects_utility_functions';
import * as playerUtils from '../../core/player_utility_functions';
import queryString from 'query-string';

import './DisplayTaskComponent.css';
import '../../core/utility.css';

var checkShouldSave = true;

/*
██████  ███████  ██████ ██    ██ ██████  ███████ ██  ██████  ███    ██      ██████  ██████  ███    ███ ██████   ██████  ███    ██ ███████ ███    ██ ████████
██   ██ ██      ██      ██    ██ ██   ██ ██      ██ ██    ██ ████   ██     ██      ██    ██ ████  ████ ██   ██ ██    ██ ████   ██ ██      ████   ██    ██
██████  █████   ██      ██    ██ ██████  ███████ ██ ██    ██ ██ ██  ██     ██      ██    ██ ██ ████ ██ ██████  ██    ██ ██ ██  ██ █████   ██ ██  ██    ██
██   ██ ██      ██      ██    ██ ██   ██      ██ ██ ██    ██ ██  ██ ██     ██      ██    ██ ██  ██  ██ ██      ██    ██ ██  ██ ██ ██      ██  ██ ██    ██
██   ██ ███████  ██████  ██████  ██   ██ ███████ ██  ██████  ██   ████      ██████  ██████  ██      ██ ██       ██████  ██   ████ ███████ ██   ████    ██
*/
//This component is used to do recursion
class DisplayTaskHelper extends React.Component { //for the sake of recursion
  constructor() {
    super();
    this.state = {
      currentTaskIndex: 0,
      hasBeenAnswered: false
    };
    this.progressCount = 0;
    this.numCorrectAnswers = 0;
    this.currentTask = null;
    this.currentLineOfData = null;
    this.hasBeenInitiated = false;

    this.handleMultipleScreenEvent = this.onMultipleScreenEvent.bind(this);
  }

  /*
   ██████  ██████  ███    ███ ██████   ██████  ███    ██ ███████ ███    ██ ████████     ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████
  ██      ██    ██ ████  ████ ██   ██ ██    ██ ████   ██ ██      ████   ██    ██        ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██
  ██      ██    ██ ██ ████ ██ ██████  ██    ██ ██ ██  ██ █████   ██ ██  ██    ██        █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████
  ██      ██    ██ ██  ██  ██ ██      ██    ██ ██  ██ ██ ██      ██  ██ ██    ██        ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
   ██████  ██████  ██      ██ ██       ██████  ██   ████ ███████ ██   ████    ██        ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████
  */

  componentWillMount() {
    this.progressCount = this.props.progressCount;
    eventStore.addMultipleScreenListener(this.handleMultipleScreenEvent);
  }

  componentWillUnmount(){
    eventStore.removeMultipleScreenListener(this.handleMultipleScreenEvent);
  }

  /*
   ██████  █████  ██      ██      ██████   █████   ██████ ██   ██ ███████
  ██      ██   ██ ██      ██      ██   ██ ██   ██ ██      ██  ██  ██
  ██      ███████ ██      ██      ██████  ███████ ██      █████   ███████
  ██      ██   ██ ██      ██      ██   ██ ██   ██ ██      ██  ██       ██
   ██████ ██   ██ ███████ ███████ ██████  ██   ██  ██████ ██   ██ ███████
  */

  onMultipleScreenEvent(payload) {
    if(store.getState().multipleScreens && payload.type === 'nextTask'){
      this.onClickNext(null, true);
    }
  }

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
  saveGlobalVariable(participantId, label, value) {
    var globalVariableObj = {
      label: label,
      value: value
    };
    if (store.getState().experimentInfo.shouldSave) {
      db_helper.addNewGlobalVariableToParticipantDB(participantId, JSON.stringify(globalVariableObj));
    }
  }

  resetAOIs() {
    var aoiAction = {
      type: 'RESET_AOIS'
    }

    store.dispatch(aoiAction);
  }

  onClickNext(e, fromEmitter) {
    //===========reset aoi list===========
    this.resetAOIs();

    //===========save gazedata===========
    this.props.saveGazeData(dbObjectsUtilityFunctions.getTaskContent(this.currentTask));

    //===========save logging data===========

    this.progressCount += 1;

    this.currentLineOfData.forEach((line, index) => {
      if (line.isGlobalVariable !== undefined) {
        this.saveGlobalVariable(store.getState().experimentInfo.participantId,
                                line.label, line.responses);
      }
      else {
        line.timeToCompletion = playerUtils.getCurrentTime() - line.startTimestamp;
        if (store.getState().experimentInfo.shouldSave) {
          db_helper.addNewLineToParticipantDB(store.getState().experimentInfo.participantId, JSON.stringify(line));
        }
      }

      let stringifiedMessage = playerUtils.stringifyMessage(store, {_id:line.taskId}, line,
                                                (line.firstResponseTimestamp !== -1) ? "ANSWERED" : "SKIPPED",
                                                this.progressCount, -1);

      mqtt.broadcastEvents(stringifiedMessage);
    });

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

    let eventObject = {eventType: "PROGRESSCOUNT",
                       participantId: store.getState().experimentInfo.participantId,
                       progressCount: this.progressCount};

    mqtt.broadcastEvents(JSON.stringify(eventObject));

    //To prevent the receiving components from broadcasting a new click event
    if(!fromEmitter){
      mqtt.broadcastMultipleScreen(JSON.stringify({
                             type: "nextTask",
                             deviceID: window.localStorage.getItem('deviceID'),
                             screenID: store.getState().screenID
                            }));
    }

    //===========reset===========
    this.currentLineOfData = null;
    this.hasBeenInitiated = false;
    //reset state
    this.setState({
      hasBeenAnswered: false,
      answerItem: null,
      currentTaskIndex: (this.state.currentTaskIndex + 1)
    });
  }

  onAnswer(answer) {
    if(!(store.getState().experimentInfo.participantId === "TESTING")) {
      this.currentLineOfData = answer.linesOfData;
      if (answer.correctlyAnswered === "correct") {
        this.currentTask.numCorrectAnswers += 1;
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
  //This function is the anchor of recursion
  isTheEndOfSet() {
    return (this.props.taskSet.data.length > 0 && this.state.currentTaskIndex >= this.props.taskSet.data.length)
  }

  render() {
    if(!this.isTheEndOfSet()) {
      this.currentTask = this.props.taskSet.data[this.state.currentTaskIndex];
      var id = this.currentTask._id + "_" + this.progressCount;

      let trackingTaskSetNames = this.props.tasksFamilyTree.slice(); //clone array, since javascript passes by reference, we need to keep the orginal familyTree untouched
      trackingTaskSetNames.push(this.currentTask.name);

      var parentSet = this.props.tasksFamilyTree[this.props.tasksFamilyTree.length - 1];
      if (this.currentTask.objType === dbObjects.ObjectTypes.SET) {
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
      else { //not a set
        var nextButtonText = this.state.hasBeenAnswered ? "Next" : "Skip";

        return (
          <div className="page" key={this.currentTaskIndex}>
            <div className="mainDisplay">
              <SynquestitaskViewComponent childKey={id}
                                          tasksFamilyTree={trackingTaskSetNames}
                                          task={this.currentTask}
                                          answerCallback={this.onAnswer.bind(this)}
                                          answerItem={this.state.answerItem}
                                          newTask={!this.state.hasBeenAnswered}
                                          hasBeenInitiated={this.hasBeenInitiated}
                                          parentSet={parentSet}
                                          initCallback={(taskResponses) => {
                                            this.currentLineOfData = taskResponses;
                                          }}
                                          logTheStartOfTask={(task, log, ind) => {
                                            let eventObject = playerUtils.stringifyMessage(store, task, log, "START", this.progressCount, this.progressCount+1);
                                            mqtt.broadcastEvents(eventObject);
                                            this.hasBeenInitiated = true;
                                          }}
                                          renderKey={id}/>
            </div>
            <div className="nextButton">
              <Button className="nextButton" variant="contained" onClick={this.onClickNext.bind(this)}>
                {nextButtonText}
              </Button>
            </div>
          </div>
          );
      }
    }
    else {
      this.props.onFinished();
      return (null);
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

//The wrapper handles global measurement that does not need to be reinitiated every recursion
//For example: gaze events
class DisplayTaskComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPaused : false
    };
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

    if (mainTaskSetId === undefined) {
      return;
    }

    db_helper.getTasksOrTaskSetsWithIDs(mainTaskSetId, (dbQueryResult, count, mainTaskSetName) => {

      //Force preload all images
      if(dbQueryResult.data){
        playerUtils.getAllImagePaths(dbQueryResult.data).forEach((picture) => {
            const img = document.createElement('img');
            img.src = picture;
        });
      }

      //If the participantID is undefined we create a participant and add it to he experiment
      if(store.getState().experimentInfo.participantId===undefined){
        db_helper.addParticipantToDb(new dbObjects.ParticipantObject(dbQueryResult._id),
          (returnedIdFromDB)=> {
            let action = {
              type: 'SET_EXPERIMENT_INFO',
              experimentInfo: {
                participantLabel: playerUtils.getDeviceName(),
                participantId: returnedIdFromDB,
                shouldSave: true,
                startTimestamp: playerUtils.getFormattedCurrentTime(),
                mainTaskSetId: mainTaskSetName,
                taskSet: dbQueryResult,
                taskSetCount: count,
                selectedTracker: tracker,
              }
            }
            store.dispatch(action);
            this.forceUpdate();
        });
      }
      else{
      let action = {
        type: 'SET_EXPERIMENT_INFO',
        experimentInfo: {
          participantLabel: playerUtils.getDeviceName(),
          participantId: store.getState().experimentInfo.participantId,
          shouldSave: true,
          startTimestamp: playerUtils.getFormattedCurrentTime(),
          mainTaskSetId: mainTaskSetName,
          taskSet: dbQueryResult,
          taskSetCount: count,
          selectedTracker: tracker,
        }
      }

      store.dispatch(action);
      this.forceUpdate();
    }
        /*var action = {
          type: 'SET_EXPERIMENT_INFO',
          experimentInfo: {
            participantLabel: playerUtils.getDeviceName(),
            participantId: store.getState().experimentInfo.participantId?store.getState().experimentInfo.participantId:undefined,
            shouldSave: true,
            startTimestamp: playerUtils.getFormattedCurrentTime(),
            mainTaskSetId: mainTaskSetName,
            taskSet: dbQueryResult,
            taskSetCount: count,
            selectedTracker: tracker,
          }
        }

        store.dispatch(action);
        this.forceUpdate();

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
      });*/
    });
    eventStore.addNewCommandListener(this.handleNewCommandEvent);
  }

  componentDidMount() {
    if (store.getState().experimentInfo && store.getState().experimentInfo.participantId !== "TESTING" && (store.getState().experimentInfo.selectedTracker !== "")) {

      this.gazeDataArray = [];
      this.timer = setInterval(this.updateCursorLocation.bind(this), 4.5); //Update the gaze cursor location every 2ms

      //Force preload all images
      /*if(store.getState().experimentInfo.taskSet){
        playerUtils.getAllImagePaths(store.getState().experimentInfo.taskSet).forEach((picture) => {
            const img = new Image();
            img.src = picture.fileName;
        });
      }*/
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
    eventStore.removeNewCommandListener(this.handleNewCommandEvent);

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

  //TODO currently this is updated using an interval timer.However it would be better to only update when
  // new events occur.
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
          var imageDivRect = a.imageRef.current.getBoundingClientRect();
          var polygon = [];

          if (a.boundingbox.length > 0) {
            for(let boundingbox of a.boundingbox){
              var x = boundingbox[0]*imageDivRect.width/100 + imageDivRect.x;
              var y = boundingbox[1]*imageDivRect.height/100 + imageDivRect.y;
              polygon.push([x, y]);
            }
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

  broadcastEndEvent() {
    var dt = new Date();
    var timestamp = dt.toUTCString();

    let eventObject = {
      eventType: "FINISHED",
      participantId: store.getState().experimentInfo.participantId,
      participantLabel: store.getState().experimentInfo.participantLabel,
      startTimestamp: store.getState().experimentInfo.startTimestamp,
      selectedTracker: store.getState().experimentInfo.selectedTracker,
      mainTaskSetId: store.getState().experimentInfo.mainTaskSetId,
      lineOfData: {
        startTaskTime: timestamp
      },
      timestamp: timestamp
    };

    var info = JSON.stringify(eventObject);
    mqtt.broadcastEvents(info);
  }

  /*
 ██████  ██████  ███    ███ ███    ███  █████  ███    ██ ██████  ███████
██      ██    ██ ████  ████ ████  ████ ██   ██ ████   ██ ██   ██ ██
██      ██    ██ ██ ████ ██ ██ ████ ██ ███████ ██ ██  ██ ██   ██ ███████
██      ██    ██ ██  ██  ██ ██  ██  ██ ██   ██ ██  ██ ██ ██   ██      ██
 ██████  ██████  ██      ██ ██      ██ ██   ██ ██   ████ ██████  ███████
*/
  onNewCommandEvent() {
    var args = JSON.parse(eventStore.getCurrentCommand());
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
      var taskSet = null;
      try {
        if (store.getState().experimentInfo.taskSet.displayOnePage) {
          taskSet = {
            objType: "TaskSet",
            displayOnePage: true,
            data: [store.getState().experimentInfo.taskSet]
          };
        }
        else {
          taskSet = store.getState().experimentInfo.taskSet;
        }
        var renderObj = <DisplayTaskHelper tasksFamilyTree={[store.getState().experimentInfo.mainTaskSetId]}
                                           taskSet={taskSet}
                                           displayOnePage={store.getState().experimentInfo.taskSet.displayOnePage}
                                           onFinished={this.onFinished.bind(this)}
                                           saveGazeData={this.saveGazeData.bind(this)}
                                           progressCount={0}
                                           repeatSetThreshold={store.getState().experimentInfo.taskSet.repeatSetThreshold}/>;
        return (
            <div style={{backgroundColor:rightBG}} className="page" ref={this.frameDiv}>
              {renderObj}
              <PauseDialog openDialog={this.state.isPaused} pauseMessage="Task paused."/>
            </div>
        );
      }
      catch(err) {
        return <div style={{backgroundColor:rightBG}}/>;
      }
    }
    return <Typography variant="h2" color="textPrimary" style={{position:'absolute', left:'50%', top:'50%'}}>Loading...</Typography>;
  }
}

export default withTheme(DisplayTaskComponent);
