import React from 'react';

import CommentDialog from '../../dialogs/CommentDialog';

import ObserverMessage from './ObserverMessage';
import wamp from '../../../core/wamp';
import db_helper from '../../../core/db_helper';
import * as dbObjects from '../../../core/db_objects';
import * as playerUtils from '../../../core/player_utility_functions';
import './WAMPMessageComponent.css';
import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';

var myStorage = window.localStorage;

class WAMPMessageComponent extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      openCommentDialog: false
    }
    this.pickedEvent = null;
  }

  onCommentPressed(evt){
    this.setState({
      openCommentDialog: true,
    });
    this.pickedEvent = evt;
  }

  onCommentRecieved(comment){
    if (comment !== "") {
      //TODO process comment here, might need to pass task id etc to the observermessage as needed
      db_helper.addNewObserverMessageToDb(new dbObjects.ObserverMessage(myStorage.getItem('deviceID'),
                                                                     myStorage.getItem('deviceRole'),
                                                                     this.pickedEvent.participantId,
                                                                     this.pickedEvent.lineOfData.taskId,
                                                                     this.pickedEvent.lineOfData.startTimestamp,
                                                                     comment));
      wamp.broadcastEvents(JSON.stringify({
                                            eventType: "COMMENT",
                                            observerName: myStorage.getItem('deviceID'),
                                            observerRole: myStorage.getItem('deviceRole'),
                                            timestamp: playerUtils.getCurrentTime(),
                                            participantId: this.pickedEvent.participantId,
                                            participantLabel: this.pickedEvent.participantLabel,
                                            startTimestamp: this.pickedEvent.startTimestamp,
                                            lineOfData: this.pickedEvent.lineOfData,
                                            comment: comment
                                          }));
    }
    this.setState({
      openCommentDialog: false
    });
  }

  render() {
    return (
      <div  className="wampMessageBoard">
        <div className="messageBoardtitle">
         <Typography color="textPrimary" variant="h6">Messaging Log</Typography>
        </div>
        <div className="messages">
          {this.props.messages.slice().reverse().map((item, index) => {
            return <ObserverMessage message={item} key={index+item.lineOfData} commentCallback={this.onCommentPressed.bind(this)} />
          })}
        </div>

        <CommentDialog openDialog={this.state.openCommentDialog} closeDialog={this.onCommentRecieved.bind(this)} />
      </div>);
  }
}

export default withTheme(WAMPMessageComponent);
