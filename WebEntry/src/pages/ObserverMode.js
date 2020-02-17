import React, { Component } from 'react';

import GazeCursor from '../components/Views/GazeCursor';
import WAMPMessageComponent from '../components/Views/ObserverMessages/WAMPMessageComponent';
import ObserverTab from '../components/Views/ObserverMessages/ObserverTab';

import Button from '@material-ui/core/Button';
import PauseIcon from '@material-ui/icons/PauseCircleOutline';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';

import { withTheme } from '@material-ui/styles';

import wamp from '../core/wamp';
import wampStore from '../core/wampStore';
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
    this.handleNewWAMPEvent = this.onNewWAMPEvent.bind(this);

    this.onPauseAllPressed = this.onPausePlayPressed.bind(this);
  }

  componentWillMount() {
    wampStore.addEventListener(this.handleNewWAMPEvent);
  }

  componentWillUnmount() {
    wampStore.removeEventListener(this.handleNewWAMPEvent);
  }

  onPausePlayPressed(){
    wamp.broadcastCommands(JSON.stringify({
                            commandType: !this.state.isParticipantsPaused ? "PAUSE" : "RESUME",
                            participantId: -1
                           }));

    this.setState({
      isParticipantsPaused: !this.state.isParticipantsPaused
    });
  }

  getPairingID(msgArray, msg) {
    for (var i = 0; i < msgArray.length; i++) {
      if (msgArray[i].lineOfData.startTimestamp === msg.lineOfData.startTimestamp
          && msgArray[i].task._id === msg.task._id) {
            return i+1;
          }
    }
    return msgArray.length;
  }

  onNewWAMPEvent() {
    var args = JSON.parse(wampStore.getCurrentMessage());

    var isComment = (args.eventType === "COMMENT"); // &&
                          // args.observerName != myStorage.getItem('deviceID') &&
                          // args.observerRole != myStorage.getItem('deviceRole'));
    if (args.taskSetCount !== undefined) {
      this.totalTasks[args.participantId] = args.taskSetCount;
    }
    if (args.progressCount !== undefined) {
      this.completedTasks[args.participantId] = args.progressCount;
    }

    if (store.getState().participants[args.participantId] === undefined && !isComment) {
      var action = {
        type: 'ADD_PARTICIPANT',
        participant: args.participantId,
        tracker: args.selectedTracker
      }
      store.dispatch(action);
    }
    var existed = false;
    for (let i = 0; i < this.state.participants.length; i++) {
      if (this.state.participants[i].id === args.participantId) {
        var newMessage = this.state.participants[i].messages;
        var pairingID = this.getPairingID(newMessage, args);
        newMessage.splice(pairingID, 0, args);
        this.state.participants[i] = {
          ...this.state.participants[i],
          messages: newMessage
        }
        existed = true;
        break;
      }
    }
    if (!existed) {
      var label = (!args.participantLabel || args.participantLabel === "") ? "" : args.participantLabel;
      this.state.participants.push({
        id: args.participantId,
        name: label,
        timestamp: args.startTimestamp,
        tracker: args.selectedTracker,
        messages: [args]
      })
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

    var wampMessage = [];
    var gazeObject = null;
    if (this.state.currentParticipant >= 0) {
      wampMessage = this.state.participants[this.state.currentParticipant].messages;
    }

    var showScroll = window.matchMedia("(any-pointer: coarse)").matches ? "" : "ShowScrollBar";

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
          <WAMPMessageComponent messages={wampMessage}/>
        </div>
        <div className="ViewerGaze">
          {this.getGazeViewer(false)}
        </div>
      </div>
      );
  }
}

export default withTheme(ObserverMode);
