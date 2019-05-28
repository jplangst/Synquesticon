import React, { Component } from 'react';

import GazeCursor from '../components/Views/GazeCursor';
import WAMPMessageComponent from '../components/Views/WAMPMessageComponent';

import wampStore from '../core/wampStore';

import './ViewerMode.css';

class ViewerMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: {},
      messages: []
    }

    this.handleNewWAMPEvent = this.onNewWAMPEvent.bind(this);
  }

  componentWillMount() {
    wampStore.addEventListener(this.handleNewWAMPEvent);
  }

  onNewWAMPEvent() {
    var args = wampStore.getCurrentMessage();
    var displayText = '';
    switch (args[0]) {
      case "START":
        //Event type (0), experimentID (1), pariticipantID (2), question (3), startTimestamp (4), remoteTracker (5)
        displayText = "Experiment " + args[1] + "- Participant " + args[2] + ": " + args[3] + " - Start at: " + args[4];

        if (this.state.participants[args[2]] == undefined) {
          this.state.participants[args[2]] = args[5];
          this.forceUpdate();
        }
        break;
      case "ANSWER":
       //Event type (0), experimentID (1), participantID (2), question (3), answerTimestamp (4), responsetime (5), answer (6), is it correct (7)
        var answerStatus = args[7] ? "Correct" : "Incorrect";
        displayText = "Experiment " + args[1] + "- Participant " + args[2] + ": " + args[3] + " - Answer at: " + args[4]
                      + " Response time: " + args[5] + "- The answer is: " + args[6] + answerStatus;
        break;

      default:

    }
    this.state.messages.push(displayText);
    this.forceUpdate();
    /*
    parse message, structure:
    eventType: string (start task timestamp, answer task timestamp, answer: what-is it correct, aois list)
    experimentID: string,
    participantID: string
    */
  }

  render() {
    return (
      <div className="ViewerContainer">
        <div className="SelectedTaskContainer">
          <WAMPMessageComponent messages={this.state.messages}/>
        </div>

        <div className="ViewerGaze">
          { Object.entries(this.state.participants).map((pair, index) => {
              return <GazeCursor tracker={pair[1]} id={index} participant={pair[0]}/>;
            })
          }
        </div>
      </div>
      );
  }
}

export default ViewerMode;
