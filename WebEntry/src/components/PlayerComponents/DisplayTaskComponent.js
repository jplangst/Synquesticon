import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

//icons
import CancelIcon from '@material-ui/icons/Cancel';
import NavigationIcon from '@material-ui/icons/NavigateNext';

//view components
import InstructionViewComponent from '../Views/InstructionViewComponent';
import TextEntryComponent from '../Views/TextEntryComponent';
import SingleChoiceComponent from '../Views/SingleChoiceComponent';
import MultipleChoiceComponent from '../Views/MultipleChoiceComponent';
import ImageViewComponent from '../Views/ImageViewComponent';

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

import './DisplayTaskComponent.css';

var progressCount = 0;
function getCurrentTime() {
  var dt = new Date();
  return dt.getTime();
}

function stringifyWAMPMessage(task, lineOfData, eventType) {
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
                        });
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

    this.currentTask = null;
    this.currentLineOfData = null;
    this.handleGazeLocUpdate = this.updateCursorLocation.bind(this);
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

  componentWillUnmount() {

  }

  /*
██       ██████   ██████   ██████  ██ ███    ██  ██████
██      ██    ██ ██       ██       ██ ████   ██ ██
██      ██    ██ ██   ███ ██   ███ ██ ██ ██  ██ ██   ███
██      ██    ██ ██    ██ ██    ██ ██ ██  ██ ██ ██    ██
███████  ██████   ██████   ██████  ██ ██   ████  ██████
*/
  // logTheStartOfTask() {
  //   var startTimestamp = playerUtils.getCurrentTime();
  //   if (this.currentTask.objType === "Task") {
  //     this.currentLineOfData = new dbObjects.LineOfData(startTimestamp,
  //                                                       this.currentTask._id,
  //                                                       this.props.tasksFamilyTree, //the array that has the task's tasksFamilyTree
  //                                                       dbObjectsUtilityFunctions.getTaskContent(this.currentTask),
  //                                                       this.currentTask.correctResponses,
  //                                                       "SingleItem");
  //     wamp.broadcastEvents(stringifyWAMPMessage(this.currentTask, this.currentLineOfData, "START"));
  //   }
  // }

  logTheStartOfTask() {
    var startTimestamp = playerUtils.getCurrentTime();
    if (this.currentTask.objType === "Task") {
      this.currentLineOfData = new dbObjects.LineOfData(startTimestamp,
                                                        this.currentTask._id,
                                                        this.props.tasksFamilyTree, //the array that has the task's tasksFamilyTree
                                                        dbObjectsUtilityFunctions.getTaskContent(this.currentTask),
                                                        this.currentTask.correctResponses,
                                                        "SingleItem");
      wamp.broadcastEvents(stringifyWAMPMessage(this.currentTask, this.currentLineOfData, "START"));
    }
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

  /*
   ██████  █████  ██      ██      ██████   █████   ██████ ██   ██ ███████
  ██      ██   ██ ██      ██      ██   ██ ██   ██ ██      ██  ██  ██
  ██      ███████ ██      ██      ██████  ███████ ██      █████   ███████
  ██      ██   ██ ██      ██      ██   ██ ██   ██ ██      ██  ██       ██
   ██████ ██   ██ ███████ ███████ ██████  ██   ██  ██████ ██   ██ ███████
  */
  onClickNext() {
    if (!(store.getState().experimentInfo.participantId === "TESTING")) {
      if (this.currentTask.objType === "Task") {
        progressCount += 1;
        if (this.currentLineOfData) {
          if (!this.currentTask.globalVariable) {
            //complete line of data before saving to DB
            this.currentLineOfData.timeToCompletion = playerUtils.getCurrentTime() - this.currentLineOfData.startTimestamp;
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

          wamp.broadcastEvents(stringifyWAMPMessage(null, this.currentLineOfData,
                                                    (this.currentLineOfData.firstResponseTimestamp != -1) ? "ANSWERED" : "SKIPPED"));
        }

      }
      else if (this.currentTask.objType === "TaskSet" && this.currentTask.displayOnePage) {
        progressCount += this.currentLineOfData.size;
        this.currentLineOfData.forEach((line, index) => {
          if (line.isGlobalVariable !== undefined) {
            db_helper.addNewGlobalVariableToParticipantDB(store.getState().experimentInfo.participantId,
                                                          JSON.stringify(line.obj));
          }
          else {
            line.timeToCompletion = playerUtils.getCurrentTime() - line.startTimestamp;
            db_helper.addNewLineToParticipantDB(store.getState().experimentInfo.participantId,
                                                JSON.stringify(line));
          }
          wamp.broadcastEvents(stringifyWAMPMessage(null, line,
                                                    (line.firstResponseTimestamp != -1) ? "ANSWERED" : "SKIPPED"));
        });
        console.log("multiitem", this.currentLineOfData.size);

      }
    }

    //reset state
    this.setState({
      hasBeenAnswered: false,
      answerItem: null,
      currentTaskIndex: (this.state.currentTaskIndex + 1)
    });

    this.currentLineOfData = null;
  }

  onAnswer(answer) {
    if(!(store.getState().experimentInfo.participantId === "TESTING")) {
      if (this.currentTask.objType === "Task") {
        if (this.currentLineOfData.firstResponseTimestamp == -1) { //log the timeToFirstAnswer
          this.currentLineOfData.firstResponseTimestamp = playerUtils.getCurrentTime();
          this.currentLineOfData.timeToFirstAnswer = this.currentLineOfData.firstResponseTimestamp - this.currentLineOfData.startTimestamp;
        }
        //update answers
        this.currentLineOfData.responses = answer.responses;
        this.currentLineOfData.correctlyAnswered = answer.correctlyAnswered;
      }
      else if (this.currentTask.objType === "TaskSet" && this.currentTask.displayOnePage) {
        this.currentLineOfData = answer;
      }
    }
    this.setState({
      hasBeenAnswered: true
    });
  }

  onFinishedRecursion() {
    //progressCount -= 1;
    this.onClickNext();
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
      if (this.currentTask.objType === "TaskSet" && !this.currentTask.displayOnePage) {
        //shuffle set if set was marked as "Random"
        var runThisTaskSet = this.currentTask.data;
        if (this.currentTask.setTaskOrder === "Random") {
          runThisTaskSet = shuffle(runThisTaskSet);
        }

        let updatedTaskSet = this.currentTask;
        updatedTaskSet.data = runThisTaskSet;

        if(this.currentTask.displayOnePage){
          return
        } else{
          //recursion
          return <DisplayTaskHelper tasksFamilyTree={trackingTaskSetNames} taskSet={updatedTaskSet} onFinished={this.onFinishedRecursion.bind(this)}/>
        }
      }
      else {
        //log the start
        if (!this.state.hasBeenAnswered
              && !(store.getState().experimentInfo.participantId === "TESTING")) {
          this.logTheStartOfTask();
        }

        var getDisplayedContent = () => {
          if(this.currentTask){
            if((this.currentTask.objType === "TaskSet") && this.currentTask.displayOnePage) {
              var init = (taskResponses) => {
                this.currentLineOfData = taskResponses;
              }
              return <MultiItemTask tasksFamilyTree={trackingTaskSetNames}
                                    taskSet={this.currentTask}
                                    answerCallback={this.onAnswer.bind(this)}
                                    newTask={!this.state.hasBeenAnswered}
                                    initCallback={(taskResponses) => {
                                      this.currentLineOfData = taskResponses;
                                    }}
                                    logTheStartOfTask={(task, log) => {
                                      wamp.broadcastEvents(stringifyWAMPMessage(task, log, "START"))
                                    }}/>
            }
            if((this.currentTask.taskType === "Instruction")) {
              return <InstructionViewComponent task={this.currentTask} answerCallback={this.onAnswer.bind(this)}/>;
            }
            if(this.currentTask.taskType === "Text Entry") {
              return <TextEntryComponent task={this.currentTask} answerCallback={this.onAnswer.bind(this)} answerItem={this.state.answerItem} newTask={!this.state.hasBeenAnswered}/>;
            }
            if(this.currentTask.taskType === "Single Choice") {
              return <SingleChoiceComponent task={this.currentTask} answerCallback={this.onAnswer.bind(this)} answerItem={this.state.answerItem} newTask={!this.state.hasBeenAnswered}/>;
            }
            if((this.currentTask.taskType === "Multiple Choice")) {
              return <MultipleChoiceComponent task={this.currentTask} answerCallback={this.onAnswer.bind(this)} answerItem={this.state.answerItem} newTask={!this.state.hasBeenAnswered}/>;
            }
            if((this.currentTask.taskType === "Image")) {
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
  }

  componentWillMount() {
    progressCount = 0;
    if (!(store.getState().experimentInfo.participantId === "TESTING")) {
      this.broadcastStartEvent();
      this.timer = setInterval(this.handleGazeLocUpdate, 4.5); //Update the gaze cursor location every 2ms
    }

    var layoutAction = {
      type: 'SET_SHOW_HEADER',
      showHeader: false,
      showFooter: false
    }

    store.dispatch(layoutAction);

    wampStore.addNewCommandListener(this.handleNewCommandEvent);
  }

  componentWillUnmount() {
    if (!store.getState().experimentInfo.participantId === "TESTING") {
      clearInterval(this.timer);
    }
    var layoutAction = {
      type: 'SET_SHOW_HEADER',
      showHeader: true,
      showFooter: true
    }

    store.dispatch(layoutAction);
    wampStore.removeNewCommandListener(this.handleNewCommandEvent);
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
      var dt = new Date();
      var timestamp = dt.toUTCString();

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
    console.log("new command", args);
    var shouldProcess = false;

    if (args.participantId == -1 || args.participantId === store.getState().experimentInfo.participantId) {
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
    try {
      var renderObj = <DisplayTaskHelper tasksFamilyTree={[store.getState().experimentInfo.mainTaskSetId]} taskSet={store.getState().experimentInfo.taskSet} onFinished={this.onFinished.bind(this)}/>;
      return (
          <div className="page">
            {renderObj}
            <PauseDialog openDialog={this.state.isPaused}/>
          </div>
      );
    }
    catch(err) {
      alert("something went wrong!");
      return <div/>;
    }
  }
}

export default DisplayTaskComponent;
