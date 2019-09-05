import React from 'react';

import CommentDialog from '../../dialogs/CommentDialog';

import ObserverMessage from './ObserverMessage';
import wamp from '../../../core/wamp';
import db_helper from '../../../core/db_helper';
import * as dbObjects from '../../../core/db_objects';
import * as playerUtils from '../../../core/player_utility_functions';
import './WAMPMessageComponent.css';
import { Typography } from '@material-ui/core';

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
                                          lineOfData: this.pickedEvent.lineOfData,
                                          comment: comment
                                        }));
    this.setState({
      openCommentDialog: false
    });
  }

  render() {
    return (
      <div className="wampMessageBoard">
        <div className="messageBoardtitle">
         <Typography color="textSecondary">Messaging Log</Typography>
        </div>
        <div className="messages">
          {this.props.messages.map((item, index) => {
            return <ObserverMessage message={item} key={index} commentCallback={this.onCommentPressed.bind(this)} />
            //return (<div>{item}<br /></div>);
          })}
        </div>

        <CommentDialog openDialog={this.state.openCommentDialog} closeDialog={this.onCommentRecieved.bind(this)} />
      </div>);
  }
}

export default WAMPMessageComponent;
