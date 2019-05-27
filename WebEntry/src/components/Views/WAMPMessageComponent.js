import React from 'react';

import wampStore from '../../core/wampStore';

import './WAMPMessageComponent.css';

class WAMPMessageComponent extends React.Component {
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
    var newMsg = wampStore.getCurrentMessage();
    var parseWAMPEvent = function (args) {
      var displayText = '';
      switch (args[0]) {
        case "START":
          displayText = "Experiment " + args[1] + "- Participant " + args[2] + ": " + args[3] + " - Start at: " + args[4];
          break;
        case "ANSWER":
          var answerStatus = args[7] ? "Correct" : "Incorrect";
          displayText = "Experiment " + args[1] + "- Participant " + args[2] + ": " + args[3] + " - Answer at: " + args[4]
                        + " Response time: " + args[5] + "- The answer is: " + args[6] + answerStatus;
          break;

        default:

      }
      return displayText;
    };
    var displayText = parseWAMPEvent(newMsg);
    console.log(displayText);
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
      <div className="wampMessageBoard">
      {this.state.messages.map((item, index) => {
        return (<div>{item}</div>);
      })}
      </div>);
  }
}

export default WAMPMessageComponent;
