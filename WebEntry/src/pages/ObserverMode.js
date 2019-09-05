import React, { Component } from 'react';

import GazeCursor from '../components/Views/GazeCursor';
import WAMPMessageComponent from '../components/Views/ObserverMessages/WAMPMessageComponent';

import ObserverTab from '../components/Views/ObserverTabs/ObserverTab';

import wampStore from '../core/wampStore';
import store from '../core/store';

import './ObserverMode.css';

//TODO add a persistent drawer for the "Studies" part fo the UI. As well as for the gaze overlay. https://material-ui.com/components/drawers/
// Could consider to move the remote eye tracker display into the left column instead.

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
    if (!existed) {
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
    var gazeObject = null;
    if (this.state.currentParticipant >= 0) {
      wampMessage = this.state.participants[this.state.currentParticipant].messages;
      gazeObject = <GazeCursor tracker={this.state.participants[this.state.currentParticipant].tracker}
                  id={this.state.currentParticipant} participant={this.state.participants[this.state.currentParticipant].name} />;
    }

    var showScroll = window.matchMedia("(any-pointer: coarse)").matches ? "" : "ShowScrollBar";

    return (
      <div className="ObserverViewerContent">
          <div className={"ObserverTabContainer " + showScroll}>
            {
              //TODO get the number of tasks in the experiment and the number of tasks completed
              this.state.participants.map((p, index) => {
                return <ObserverTab key={index} label={p.name} index={index} tabPressedCallback={this.onClickedTab.bind(this)} participantId={p.id}
                        isActive={this.state.currentParticipant===index} completedTasks={this.completedTasks} totalTasks={this.totalTasks} shouldPause={this.props.isParticipantsPaused}/>
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
