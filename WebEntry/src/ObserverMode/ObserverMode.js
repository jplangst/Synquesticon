import React, { Component } from 'react';

import GazeCursor from './GazeCursor';
import MessageBoard from './ObserverMessages/MessageBoard';
import ObserverTab from './ObserverMessages/ObserverTab';

import Button from '@material-ui/core/Button';
import PauseIcon from '@material-ui/icons/PauseCircleOutline';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';

import { withTheme } from '@material-ui/styles';

import mqtt from '../core/mqtt';
import eventStore from '../core/eventStore';
import store from '../core/store';

import './ObserverMode.css';

class ObserverMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: [],
      currentParticipant: -1
    }
    this.completedTasks = {};
    this.totalTasks = {};
    this.handleNewEvent = this.onNewEvent.bind(this);

    this.onPauseAllPressed = this.onPausePlayPressed.bind(this);
  }

  componentWillMount() {
    eventStore.addEventListener(this.handleNewEvent);
  }

  componentWillUnmount() {
    eventStore.removeEventListener(this.handleNewEvent);
  }

  onPausePlayPressed(){
    mqtt.broadcastCommands(JSON.stringify({
                            commandType: !this.state.isParticipantsPaused ? "PAUSE" : "RESUME",
                            participantId: -1
                           }));

    this.setState({
      isParticipantsPaused: !this.state.isParticipantsPaused
    });
  }

  isSameIdentifier(pair, msg) {
    if(pair.lineOfData){
      return (pair.lineOfData.startTimestamp === msg.lineOfData.startTimestamp
              && pair.lineOfData.taskContent === msg.lineOfData.taskContent);
    }
    else{
      console.log("missing data line", msg);
      return false;
    }
  }

  pairMessage(msgArray, msg) {
    for (var i = 0; i < msgArray.length; i++) {
      var pair = msgArray[i];
      if (msg.eventType === "ANSWERED" || msg.eventType === "SKIPPED") {
        if (pair.length < 2 //if hasn't had matched message
            && this.isSameIdentifier(pair[0], msg)) { //match id with first message
              //pair them together
              pair.push(msg);
              return msgArray;
        }
      }
      else if (msg.eventType === "RESETANSWER") {
        if (this.isSameIdentifier(pair[0], msg)) {
          msg.eventType = "ANSWERED"; //we cheat so we don't have to handle new case
          pair.push(msg);
          return msgArray;
        }
      }
    }
    if (msg.eventType !== "PROGRESSCOUNT") {
      msgArray.push([msg]);
    }

    return msgArray;
  }

  // Called when a new mqtt event has been received
  // Updates the information displayed in the observer
  onNewEvent() {
    var args = JSON.parse(eventStore.getCurrentMessage());

    //set up a new participant, this is for catching gaze data
    if (store.getState().participants[args.participantId] === undefined) {
      var action = {
        type: 'ADD_PARTICIPANT',
        participant: args.participantId,
        tracker: args.selectedTracker
      }
      store.dispatch(action);
    }

    if (args.taskSetCount) {
      this.totalTasks[args.participantId] = args.taskSetCount;
    }
    if (args.progressCount) {
      this.completedTasks[args.participantId] = args.progressCount;
    }

    var exists = false;
    for (let i = 0; i < this.state.participants.length; i++) {
      if (this.state.participants[i].id === args.participantId) {
        // Only print the finished event once. Needed because of the multiple screens.
        // Every screen will send a finished event.
        if(args.eventType==="FINISHED" && !this.state.participants[i].hasReceivedFinish){
          this.setState(state => {
            let participants = state.participants;
            let participantData = participants[i];
            participantData.hasReceivedFinish = true;
            participants[i] = participantData;

            return {
              participants,
            };
          });

          this.pairMessage(this.state.participants[i].messages, args);
          exists = true;
        }
        else if(args.eventType!=="FINISHED"){
          this.pairMessage(this.state.participants[i].messages, args);
          exists = true;
          break;
        }
        else{
          //The id did exist so we do not want to create a new participant
          exists = true;
          break;
        }
      }
    }

    //If the participant id did not exist we create a new participant
    if (!exists) {
      var label = (!args.participantLabel || args.participantLabel === "") ? "" : args.participantLabel;
      this.setState(state => {
        const participants = state.participants.concat({
          id: args.participantId,
          name: label,
          timestamp: args.startTimestamp,
          tracker: args.selectedTracker,
          messages: [[args]]
        });

        return {
          participants,
        };
      });
    }

    if (this.state.currentParticipant < 0) {
      this.setState({
        currentParticipant: 0
      });
    }
    this.forceUpdate();
  }

  onClickedTab(newValue) {
    this.setState({
      currentParticipant: newValue
    });
  }

  getGazeViewer(showAllParticipants){
    var gazeObject = null;
    if(showAllParticipants){
      gazeObject = this.state.participants.map((p, index) => {
        return <GazeCursor tracker={p.tracker} id={index} participant={p.name} key={index}/>;
      })
    }
    else{
      if (this.state.currentParticipant >= 0) {
        var tracker = this.state.participants[this.state.currentParticipant].tracker;
        gazeObject = tracker ? <GazeCursor tracker={tracker}
                    id={this.state.currentParticipant} participant={this.state.participants[this.state.currentParticipant].name} /> : null;
      }
    }
    return gazeObject;
  }

  getPlayPauseButton(){
    var buttonIcon = null;
    var buttonLabel = "";
    if(!this.state.isParticipantsPaused){
      buttonIcon = <PauseIcon fontSize="large" />;
      buttonLabel = "Pause all participants";
    }
    else{
      buttonIcon = <PlayIcon fontSize="large" />;
      buttonLabel = "Resume all participants";
    }

    var playPauseButton = <Button style={{display:'flex', position: 'relative', width: '100%', height: '55px',
            borderRadius:10, borderColor:'#BDBDBD', borderWidth:'thin', borderRightStyle:'solid'}}
            onClick={this.onPauseAllPressed}>
      {buttonLabel}
      {buttonIcon}
    </Button>

    return playPauseButton;
  }

  render() {
    let theme = this.props.theme;
    let observerBgColor = theme.palette.type === "light" ? theme.palette.primary.main : theme.palette.primary.dark;

    var messages = [];
    if (this.state.currentParticipant >= 0) {
      messages = this.state.participants[this.state.currentParticipant].messages;
    }

    return (
      <div className="ObserverViewerContent" style={{backgroundColor:observerBgColor}}>
        <div className="ObserverHeader">
          <div className="ObserverPlayPauseContainer">
            {this.getPlayPauseButton()}
          </div>
          <div className="ObserverTabsWrapper">
            <div className={"ObserverTabContainer"}>
              {
                this.state.participants.map((p, index) => {
                  return <ObserverTab key={index} label={p.name} startTimestamp={p.timestamp} index={index} tabPressedCallback={this.onClickedTab.bind(this)} participantId={p.id}
                          isActive={this.state.currentParticipant===index} completedTasks={this.completedTasks[p.id]} totalTasks={this.totalTasks[p.id]} shouldPause={this.state.isParticipantsPaused}/>
                })
              }
            </div>
          </div>
        </div>
        <div className="ObserverMessageLog">
          <MessageBoard messages={messages}/>
        </div>
        <div className="ViewerGaze">
          {this.getGazeViewer(false)}
        </div>
      </div>
      );
  }
}

export default withTheme(ObserverMode);
