import React, { Component } from 'react';

import GazeCursor from '../components/Views/GazeCursor';
import WAMPMessageComponent from '../components/Views/WAMPMessageComponent';

import wampStore from '../core/wampStore';

import './ObserverMode.css';

class ObserverMode extends Component {
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
      case "NEW EXPERIMENT":
        /*
        ["NEW EXPERIMENT",
                    store.getState().experimentInfo.mainTaskSetId,
                    timestamp]
        */
        var startTime = new Date(args[2]);
        displayText = <div>
                        <b>New experiment - Task set: </b>
                        <i>{args[1]} </i>
                        started at {startTime.toUTCString()}
                      </div>

        break;
      case "START":
        /*
        ["START",
                    obj.taskType,
                    dbObjectsUtilityFunctions.getTaskContent(obj),
                    obj.globalVariable,
                    timestamp,
                    store.getState().experimentInfo.selectedTracker];
        */
        var startTaskTime = new Date(args[4]);
        displayText = <div>
                          <b>{args[1]} </b>
                          <i>{args[2]} </i>
                          {(args[3] ? " (global variable) " : "") + " - start at: " + startTaskTime.toUTCString()}
                      </div>

        if (this.state.participants[args[5]] === undefined) {
          this.state.participants[args[5]] = args[5];
          this.forceUpdate();
        }
        break;
      case "ANSWERED":
       /*
       ["ANSWERED",
                   obj.firstResponseTimestamp,
                   obj.timeToFirstAnswer,
                   obj.timeToCompletion,
                   obj.responses,
                   obj.correctlyAnswered,
                   obj.aoiCheckedList];
       */

        var firstResponseTimestamp = new Date(args[1]);
        var responses = args[4].join(', ');
        var timeToCompletion = args[3] < 0 ? "s" : "s. Time to completion: " + args[3]/1000 + "s";
        displayText = <div>
                        <b>Answered </b>
                        <i>{responses} </i>
                         - {args[5]}. Time to first answer: {args[2]/1000}{timeToCompletion}. First answered at {firstResponseTimestamp.toUTCString()}.
                      </div>;


        var aoisList = "";

        args[6].map((item, index) => {
          aoisList += "\t" + item["name"] + ":" + (item["checked"] !== undefined ? "checked" : "unchecked");
        });
        //displayText += aoisList;
        break;
      case "SKIPPED":
        displayText = <div>
                        <b>Skipped </b>
                        Time to completion: {args[1]/1000} s.
                      </div>;
        break;
      case "FINISHED":
        var endTime = new Date(args[2]);
        displayText = <div>
                        <b>Experiment finished at </b>
                        {endTime.toUTCString()}
                      </div>;
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
      <div className="AssetViewerContent">
        <div className="ContainerSeperator SelectedTaskContainer">
          <WAMPMessageComponent messages={this.state.messages}/>
        </div>

        <div className="ContainerSeperator ViewerGaze">
          { Object.entries(this.state.participants).map((pair, index) => {
              return <GazeCursor tracker={pair[1]} id={index} participant={pair[0]}/>;
            })
          }
        </div>
      </div>
      );
  }
}

export default ObserverMode;
