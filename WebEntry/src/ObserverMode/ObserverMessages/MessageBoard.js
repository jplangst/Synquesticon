import React, { useState } from 'react';

import CommentDialog from './CommentDialog';
import ObserverMessage from './ObserverMessage';

import mqtt from '../../core/mqtt';
import db_helper from '../../core/db_helper';
import * as dbObjects from '../../core/db_objects';
import * as playerUtils from '../../core/player_utility_functions';

import './MessageBoard.css';

import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';

var myStorage = window.localStorage;

const MessageBoard = (props) => {
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [pickedEvent, setPickedEvent] = useState(false);

  const onCommentPressed = (evt) => {
    setPickedEvent(evt);
    setCommentDialogOpen(true);
  }

  const onCloseCommentDialog = (comment) => {
    setCommentDialogOpen(false);
    if (comment !== "") {
      console.log("write to DB");
      onCommentRecieved(comment);
    } else {
      console.log("empty string");
    }
  }
  const onCommentRecieved = (comment) => {
    db_helper.addNewObserverMessageToDb(new dbObjects.ObserverMessage(myStorage.getItem('deviceID'),
      myStorage.getItem('deviceRole'),
      pickedEvent.participantId,
      pickedEvent.lineOfData.taskId,
      pickedEvent.lineOfData.startTimestamp,
      comment));

    mqtt.broadcastEvents(JSON.stringify({
      eventType: "COMMENT",
      observerName: myStorage.getItem('deviceID'),
      observerRole: myStorage.getItem('deviceRole'),
      timestamp: playerUtils.getCurrentTime(),
      participantId: pickedEvent.participantId,
      participantLabel: pickedEvent.participantLabel,
      startTimestamp: pickedEvent.startTimestamp,
      lineOfData: pickedEvent.lineOfData,
      comment: comment
    }));
  }

  var displayMessages = props.messages.slice();

  return (
    <div className="messageBoard">
      <div className="messageBoardtitle">
       <Typography color="textPrimary" variant="h6">Messaging Log</Typography>
      </div>
      <div className="messages">
        {displayMessages.reverse().map((pair, pindex) => {
          return pair.map((item, iindex) => {
            return <ObserverMessage message={item} key={iindex+item.lineOfData} commentCallback={onCommentPressed} />
          })
        })}
      </div>

      <CommentDialog isOpen={commentDialogOpen} closeCommentDialog={onCloseCommentDialog}/>
    </div>
  );
}

export default withTheme(MessageBoard);
