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

//TODO add a persistent drawer for the "Studies" part fo the UI. As well as for the gaze overlay. https://material-ui.com/components/drawers/
// Could consider to move the remote eye tracker display into the left column instead.

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
    var args = wampStore.getCurrentMessage();

    var displayText = '';

    switch (args[0]) {
      case "NEW EXPERIMENT":
        /*
        ["NEW EXPERIMENT",
                    store.getState().experimentInfo.participantId,
                    store.getState().experimentInfo.selectedTracker,
                    store.getState().experimentInfo.mainTaskSetId,
                    timestamp]
        */

        var startTime = new Date(args[4]);
        displayText = <div>
                        <b>New experiment - Task set: </b>
                        <i>{args[3]} </i>
                        started at {startTime.toUTCString()}
                      </div>

        break;
      case "START":
        /*
        ["START",
                    store.getState().experimentInfo.participantId,
                    store.getState().experimentInfo.selectedTracker,
                    obj.taskType,
                    dbObjectsUtilityFunctions.getTaskContent(obj),
                    obj.globalVariable,
                    timestamp];
        */

        var startTaskTime = new Date(args[6]);
        displayText = <div>
                          <b>{args[3]} </b>
                          <i>{args[4]} </i>
                          {(args[5] ? " (global variable) " : "") + " - start at: " + startTaskTime.toUTCString()}
                      </div>


        break;
      case "ANSWERED":
       /*
       ["ANSWERED",
                   store.getState().experimentInfo.participantId,
                   store.getState().experimentInfo.selectedTracker,
                   obj.firstResponseTimestamp,
                   obj.timeToFirstAnswer,
                   obj.timeToCompletion,
                   obj.responses,
                   obj.correctlyAnswered,
                   obj.aoiCheckedList];
       */

        var firstResponseTimestamp = new Date(args[3]);
        var responses = args[6].join(', ');
        var timeToCompletion = args[5] < 0 ? "s" : "s. Time to completion: " + args[3]/1000 + "s";
        displayText = <div>
                        <b>Answered </b>
                        <i>{responses} </i>
                         - {args[7]}. Time to first answer: {args[4]/1000}{timeToCompletion}. First answered at {firstResponseTimestamp.toUTCString()}.
                      </div>;


        var aoisList = "";

        args[8].map((item, index) => {
          aoisList += "\t" + item["name"] + ":" + (item["checked"] !== undefined ? "checked" : "unchecked");
        });
        //displayText += aoisList;
        break;
      case "SKIPPED":
      /*
      "SKIPPED",
                  store.getState().experimentInfo.participantId,
                  store.getState().experimentInfo.selectedTracker,
                  obj.timeToCompletion
      */
        displayText = <div>
                        <b>Skipped </b>
                        Time to completion: {args[3]/1000} s.
                      </div>;
        break;
      case "FINISHED":
      /*
      "FINISHED",
                  store.getState().experimentInfo.participantId,
                  store.getState().experimentInfo.selectedTracker,
                  store.getState().experimentInfo.mainTaskSetId,
                  timestamp
      */
        var endTime = new Date(args[4]);
        displayText = <div>
                        <b>Experiment finished at </b>
                        {endTime.toUTCString()}
                      </div>;
        break;
      default:
        break;
    }

    if (store.getState().participants[args[1]] == undefined) {
      var action = {
        type: 'ADD_PARTICIPANT',
        participant: args[1],
        tracker: args[2]
      }
      store.dispatch(action);
    }
    var existed = false;
    for (let i = 0; i < this.state.participants.length; i++) {
      console.log(this.state.participants[i].name, args[1]);
      console.log(this.state.participants[i].name === args[1]);
      if (this.state.participants[i].name === args[1]) {
        var newMessage = this.state.participants[i].messages;
        newMessage.push(displayText);
        this.state.participants[i] = {
          ...this.state.participants[i],
          messages: newMessage
        }
        existed = true;
        console.log("existing", this.state.participants[i]);
        break;
      }
    }
    if (!existed) {

      this.state.participants.push({
        name: args[1],
        tracker: args[2],
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
    var gazeObject = null;
    if (this.state.currentParticipant >= 0) {
      wampMessage = this.state.participants[this.state.currentParticipant].messages;
      gazeObject = <GazeCursor tracker={this.state.participants[this.state.currentParticipant].tracker}
                  id={this.state.currentParticipant} participant={this.state.participants[this.state.currentParticipant].name} />;
    }

    return (
      <div className="ObserverViewerContent">
          <div className="ObserverTabContainer">
            {
              //TODO get the number of tasks in the experiment and the number of tasks completed
              this.state.participants.map((p, index) => {
                return <ObserverTab label={p.name} index={index} tabPressedCallback={this.onClickedTab.bind(this)}
                        isActive={this.state.currentParticipant===index} completedTasks={50} totalTasks={100} shouldPause={this.props.isParticipantsPaused}/>
              })
            }
          </div>
          <div className="ObserverMessageLog">
            <WAMPMessageComponent messages={wampMessage}/>
          </div>
          <div className="ViewerGaze">
            {
              //If we only want to show the selected participant
              gazeObject

              //If we want to show all the participants gaze
              //this.state.participants.map((p, index) => {
              //  return <GazeCursor tracker={p.tracker} id={index} participant={p.name} key={index}/>;
              //})
            }
          </div>
      </div>
      );
  }
}

export default ObserverMode;
