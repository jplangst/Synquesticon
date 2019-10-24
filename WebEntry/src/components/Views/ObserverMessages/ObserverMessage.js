import React from 'react';

import Button from '@material-ui/core/Button';
import CommentIcon from '@material-ui/icons/ModeCommentOutlined';
import { Typography } from '@material-ui/core';

import * as playerUtils from '../../../core/player_utility_functions';

import './ObserverMessage.css';

class ObserverMessage extends React.Component {
  constructor(props) {
    super(props);
    this.showCommentButton = true;
  }
  parseMessage(args) {
    var displayText = '';

    switch (args.eventType) {
      case "NEW EXPERIMENT":
        /*
        ["NEW EXPERIMENT",
                    store.getState().experimentInfo.participantId,
                    store.getState().experimentInfo.startTimestamp,
                    store.getState().experimentInfo.selectedTracker,
                    store.getState().experimentInfo.mainTaskSetId,
                    timestamp]
        */

        displayText = <Typography display="inline" variant="body1" color="textPrimary">
                        <b>New experiment - Task set: </b>
                        <i>{args.mainTaskSetId} </i>
                        started at {playerUtils.getFormattedTime(args.startTimestamp)}
                      </Typography>
        this.showCommentButton = false;
        break;
      case "START":
        displayText = <Typography display="inline" variant="body1" color="textPrimary">
                          <b>{args.progressCount}. </b>
                          <b>{args.lineOfData.taskContent} </b>
                      </Typography>

        break;
      case "ANSWERED":
       /*
       ["ANSWERED",
                   store.getState().experimentInfo.participantId,
                   store.getState().experimentInfo.startTimestamp,
                   store.getState().experimentInfo.selectedTracker,
                   obj.firstResponseTimestamp,
                   obj.timeToFirstAnswer,
                   obj.timeToCompletion,
                   obj.responses,
                   obj.correctlyAnswered,
                   obj.aoiCheckedList];
       */

        var responses = args.lineOfData.responses.join(', ');
        var timeToCompletion = args.lineOfData.timeToCompletion < 0 ? 0 : args.lineOfData.timeToCompletion/1000;
        var color = "black";
        if (args.lineOfData.correctlyAnswered === "correct") {
          color = "green";
        }
        else if (args.lineOfData.correctlyAnswered === "incorrect") {
          color = "red";
        }
        displayText = <Typography display="inline" variant="body1" color="textPrimary">
                      <font color={color}>"{responses}"</font> ({args.lineOfData.timeToFirstAnswer/1000}s /{timeToCompletion}s)
                      </Typography>;


        /*var aoisList = "";
        args.lineOfData.aoiCheckedList.map((item, index) => {
          aoisList += "\t" + item["name"] + ":" + (item["checked"] !== undefined ? "checked" : "unchecked");
        });
        //displayText += aoisList;*/
        this.showCommentButton = false;
        break;
      case "SKIPPED":
      /*
      "SKIPPED",
                  store.getState().experimentInfo.participantId,
                  store.getState().experimentInfo.startTimestamp,
                  store.getState().experimentInfo.selectedTracker,
                  obj.timeToCompletion
      */
        var timeToCompletion = args.lineOfData.timeToCompletion < 0 ? 0 : args.lineOfData.timeToCompletion/1000;
        displayText = <Typography variant="body1" color="textPrimary">
                        <font color="red">Skipped </font> (NA / {timeToCompletion}s)
                      </Typography>;
        this.showCommentButton = false;
        break;
      case "FINISHED":
      /*
      "FINISHED",
                  store.getState().experimentInfo.participantId,
                  store.getState().experimentInfo.startTimestamp,
                  store.getState().experimentInfo.selectedTracker,
                  store.getState().experimentInfo.mainTaskSetId,
                  timestamp
      */
        displayText = <Typography display="inline" variant="body1" color="textPrimary">
                        <b>Experiment finished! </b>
                      </Typography>;
        this.showCommentButton = false;
        break;
      case "COMMENT":
        //var commentTime = new Date(args.timestamp);
        displayText = <Typography display="inline" variant="body1" color="textPrimary">
                        <b>Comment from {args.observerName}: </b>
                        {args.comment}
                      </Typography>;
        this.showCommentButton = false;
        break;
      default:
        break;
    }
    return displayText;
  }

  onCommentButtonClicked() {
    this.props.commentCallback(this.props.message);
  }

  render() {

    //TODO make the comment button size and the text size responsive
  var commentButton = this.showCommentButton ? <Button style={{display:'flex', position: 'relative', flexGrow: 0, flexShrink:0, height:25, width:25, maxWidth:25}}
                                                onClick={this.onCommentButtonClicked.bind(this)} >
                                                <CommentIcon className="flippedCommentIcon" style={{display:'flex', position: 'absolute', height: '100%', width: '100%'}} />
                                               </Button> : null;
    return (
      <div className="observerMessageWrapper" style={{display:'flex', position: 'relative', flexDirection:'row', flexGrow: 1, flexShrink:1, minWidth:10, minHeight:50, marginBottom:10}}>
        <div className="observerMessageText" style={{display:'flex', position: 'relative', flexGrow: 1, flexShrink:1, minWidth:10, height:'100%'}}>
          {this.parseMessage(this.props.message)}
        </div>
        {commentButton}
      </div>
      );
  }
}

export default ObserverMessage;
