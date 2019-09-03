import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import GazeCursor from '../components/Views/GazeCursor';
import WAMPMessageComponent from '../components/Views/ObserverMessages/WAMPMessageComponent';

import ObserverTab from '../components/Views/ObserverTabs/ObserverTab';

import wampStore from '../core/wampStore';
import store from '../core/store';

import './ObserverMode.css';

var myStorage = window.localStorage;

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
      currentParticipant: -1
    }
    this.completedTasks = 0;
    this.totalTasks = 0;
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
    var isComment = (args.eventType === "COMMENT"); // &&
                          // args.observerName != myStorage.getItem('deviceID') &&
                          // args.observerRole != myStorage.getItem('deviceRole'));
    if (args.taskSetCount != undefined) {
      this.totalTasks = args.taskSetCount;
    }
    if (args.progressCount != undefined) {
      this.completedTasks = args.progressCount;
    }

    if (store.getState().participants[args.participantId] == undefined && !isComment) {
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
        newMessage.push(args);
        this.state.participants[i] = {
          ...this.state.participants[i],
          messages: newMessage
        }
        existed = true;
        break;
      }
    }
    if (!existed && !isComment) {
      var label = (!args.participantLabel || args.participantLabel == "") ? args.startTimestamp : (args.participantLabel + "   " + args.startTimestamp);
      this.state.participants.push({
        id: args.participantId,
        name: label,
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
                return <ObserverTab key={index} label={p.name} index={index} tabPressedCallback={this.onClickedTab.bind(this)}
                        isActive={this.state.currentParticipant===index} completedTasks={this.completedTasks} totalTasks={this.totalTasks} shouldPause={this.props.isParticipantsPaused}/>
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
