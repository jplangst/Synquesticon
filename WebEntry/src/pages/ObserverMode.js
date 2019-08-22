import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import GazeCursor from '../components/Views/GazeCursor';
import WAMPMessageComponent from '../components/Views/ObserverMessages/WAMPMessageComponent';

import ObserverTab from '../components/Views/ObserverTabs/ObserverTab';

import wampStore from '../core/wampStore';
import store from '../core/store';

import './ObserverMode.css';

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

class ObserverMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: [],
      currentParticipant: -1,
    }
    this.handleNewWAMPEvent = this.onNewWAMPEvent.bind(this);
  }

  componentWillMount() {
    wampStore.addEventListener(this.handleNewWAMPEvent);
  }

  componentWillUnmount() {
    wampStore.removeEventListener(this.handleNewWAMPEvent);
  }

  onNewWAMPEvent() {
    var args = JSON.parse(wampStore.getCurrentMessage());
    console.log("new wamp message", args);
    var displayText = '';

    switch (args.eventType) {
      case "NEW EXPERIMENT":
        /*
        ["NEW EXPERIMENT",
                    store.getState().experimentInfo.participantId,
                    store.getState().experimentInfo.startTimestamp,
                    store.getState().experimentInfo.selectedTracker,
                    store.getState().experimentInfo.mainTaskSetId,
                    timestamp]
        */

        var startTime = new Date(args.startTimestamp);
        displayText = <div>
                        <b>New experiment - Task set: </b>
                        <i>{args.mainTaskSetId} </i>
                        started at {startTime.toUTCString()}
                      </div>

        break;
      case "START":
        /*
        ["START",
                    store.getState().experimentInfo.participantId,
                    store.getState().experimentInfo.startTimestamp,
                    store.getState().experimentInfo.selectedTracker,
                    obj.taskType,
                    dbObjectsUtilityFunctions.getTaskContent(obj),
                    obj.globalVariable,
                    timestamp];
        */

        var startTaskTime = new Date(args.timestamp);
        displayText = <div>
                          <b>{args.taskType} </b>
                          <i>{args.taskContent} </i>
                          {(args.isGlobalVariable ? " (global variable) " : "") + " - start at: " + startTaskTime.toUTCString()}
                      </div>


        break;
      case "ANSWERED":
       /*
       ["ANSWERED",
                   store.getState().experimentInfo.participantId,
                   store.getState().experimentInfo.startTimestamp,
                   store.getState().experimentInfo.selectedTracker,
                   obj.firstResponseTimestamp,
                   obj.timeToFirstAnswer,
                   obj.timeToCompletion,
                   obj.responses,
                   obj.correctlyAnswered,
                   obj.aoiCheckedList];
       */

        var firstResponseTimestamp = new Date(args.firstResponseTimestamp);
        var responses = args.responses.join(', ');
        var timeToCompletion = args.timeToCompletion < 0 ? "s" : "s. Time to completion: " + args.timeToCompletion/1000 + "s";
        displayText = <div>
                        <b>Answered </b>
                        <i>{responses} </i>
                         - {args.responses}. Time to first answer: {args.timeToFirstAnswer/1000}{timeToCompletion}. First answered at {firstResponseTimestamp.toUTCString()}.
                      </div>;


        var aoisList = "";

        args.aoiCheckedList.map((item, index) => {
          aoisList += "\t" + item["name"] + ":" + (item["checked"] !== undefined ? "checked" : "unchecked");
        });
        //displayText += aoisList;
        console.log("progress", args.progressCount, args.taskSetCount);
        break;
      case "SKIPPED":
      /*
      "SKIPPED",
                  store.getState().experimentInfo.participantId,
                  store.getState().experimentInfo.startTimestamp,
                  store.getState().experimentInfo.selectedTracker,
                  obj.timeToCompletion
      */
        displayText = <div>
                        <b>Skipped </b>
                        Time to completion: {args.timeToCompletion/1000} s.
                      </div>;
        console.log("progress", args.progressCount, args.taskSetCount);
        break;
      case "FINISHED":
      /*
      "FINISHED",
                  store.getState().experimentInfo.participantId,
                  store.getState().experimentInfo.startTimestamp,
                  store.getState().experimentInfo.selectedTracker,
                  store.getState().experimentInfo.mainTaskSetId,
                  timestamp
      */
        var endTime = new Date(args.timestamp);
        displayText = <div>
                        <b>Experiment finished at </b>
                        {endTime.toUTCString()}
                      </div>;
        break;
      default:
        break;
    }
    console.log("observer", args.participantID);
    if (store.getState().participants[args.participantID] == undefined) {
      var action = {
        type: 'ADD_PARTICIPANT',
        participant: args.participantID,
        tracker: args.selectedTracker
      }
      store.dispatch(action);
    }
    var existed = false;
    for (let i = 0; i < this.state.participants.length; i++) {
      if (this.state.participants[i].id === args.participantID) {
        var newMessage = this.state.participants[i].messages;
        newMessage.push(displayText);
        this.state.participants[i] = {
          ...this.state.participants[i],
          messages: newMessage
        }
        existed = true;
        break;
      }
    }
    if (!existed) {
      var label = (!args.participantLabel || args.participantLabel == "") ? args.startTimestamp : (args.participantLabel + "   " + args.startTimestamp);
      this.state.participants.push({
        id: args.participantID,
        name: label,
        tracker: args.selectedTracker,
        messages: [displayText]
      })
      console.log("push new", this.state.participants);
    }

    if (this.state.currentParticipant < 0) {
      this.setState({
        currentParticipant: 0
      });
    }
    this.forceUpdate();
    /*
    parse message, structure:
    eventType: string (start task timestamp, answer task timestamp, answer: what-is it correct, aois list)
    experimentID: string,
    participantID: string
    */
  }

  onClickedTab(newValue) {
    this.setState({
      currentParticipant: newValue
    });
  }

  render() {
    var wampMessage = [];
    if (this.state.currentParticipant >= 0) {
      wampMessage = this.state.participants[this.state.currentParticipant].messages;
    }

    return (
      <div className="AssetViewerContent">
        <div className="ContainerSeperator SelectedTaskContainer">
          <div style={{display:'flex', flexDirection:'row', position:'relative', flexGrow:1, flexShrink:1, width:'100%', overflowX:'auto'}}>
            {
              //TODO get the number of tasks in the experiment and the number of tasks completed
              this.state.participants.map((p, index) => {
                return <ObserverTab label={p.name} index={index} tabPressedCallback={this.onClickedTab.bind(this)}
                        isActive={this.state.currentParticipant===index} completedTasks={50} totalTasks={100} shouldPause={this.props.isParticipantsPaused}/>
              })
            }
          </div>
          <WAMPMessageComponent messages={wampMessage}/>
        </div>
        <div className="ContainerSeperator ViewerGaze">
          {
            this.state.participants.map((p, index) => {
              return <GazeCursor tracker={p.tracker} id={index} participant={p.name} key={index}/>;
            })
          }
        </div>
      </div>
      );
  }
}

export default ObserverMode;
