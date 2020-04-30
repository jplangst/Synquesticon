import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';

import mqtt from '../../../core/mqtt'
import db_helper from '../../../core/db_helper';
import * as playerUtils from '../../../core/player_utility_functions';

import store from '../../../core/store';

import './ButtonViewComponent.css';

class ButtonViewComponent extends Component {
  constructor(props) {
    super(props);
    this.pickedItems = [];
    this.textRef = React.createRef();

    //we grant button with reset feature the permission to log data
    this.delegate = this.props.delegate;
  }

  componentDidMount() {
    var textAOIAction = {
      type: 'ADD_AOIS',
      aois: {
        name: this.props.parentSet + '_' + this.props.task.displayText,
        boundingbox: [],
        imageRef: this.textRef
      }
    }
    store.dispatch(textAOIAction);
  }

  componentDidUpdate() {
    if (this.pickedItems.length > 0 && this.props.task.resetResponses) {
      setTimeout(this.reset.bind(this), 1000);
    }
  }

  reset() {
    this.pickedItems = [];
    this.forceUpdate();
  }

  checkAnswer() {
    if (this.props.task.correctResponses === undefined || this.props.task.correctResponses.length === 0) {
      return "notApplicable";
    }

    for (var i = 0; i < this.props.task.correctResponses.length; i++) {
        if (!this.pickedItems.includes(this.props.task.correctResponses[i])) {
          return "incorrect";
        }
    }
    return "correct";
  }

  onAnswer(response) {
    if (this.props.task.singleChoice) { //single choice
      if (this.pickedItems.length <= 0) {
        this.pickedItems.push(response);
      }
    }
    else { //multiple choice
      this.pickedItems.push(response);
    }

    if (this.props.task.resetResponses) { //buttons with this feature are authorized to log their own data
      var lineOfData = JSON.parse(JSON.stringify(this.delegate));
      lineOfData.timeToCompletion = playerUtils.getCurrentTime() - lineOfData.startTimestamp;
      lineOfData.responses = [response];
      lineOfData.correctlyAnswered = this.checkAnswer();
      lineOfData.componentType = this.props.task.objType;

      db_helper.addNewLineToParticipantDB(store.getState().experimentInfo.participantId, JSON.stringify(lineOfData));
      mqtt.broadcastEvents(playerUtils.stringifyMessage(store,
                                                        {_id:lineOfData.taskId},
                                                        lineOfData,
                                                        "RESETANSWER",
                                                        this.progressCount, -1));
      this.forceUpdate();
    }
    else { //normal buttons behaviour
      var answerObj = {
        responses: [this.pickedItems],
        correctlyAnswered: this.checkAnswer(),
        taskID: this.props.task._id, //TODO This is undefined, might be legacy from earlier version where we did not have task components. Remove after confirming
        mapID: this.props.mapID,
        componentType: this.props.task.objType
      }

      this.props.answerCallback(answerObj);
    }
  }

  render() {
    let theme=this.props.theme;

    return (
      <div className={this.props.className}>
        <div>
          <Typography ref={this.textRef} variant="h3" color="textPrimary" align="center" style={{whiteSpace:"pre-line"}}>{this.props.task.displayText}</Typography>
        </div>
        <div className="responsesButtons">
          {
            this.props.task.responses.map((item, index)=>{
              if (this.pickedItems.includes(item)) {
                return (
                  <span className="inputButton" key={index}><Button  variant="contained" style={{color:theme.palette.text.secondary}} disabled={true} onClick={() => this.onAnswer(item)}>{item}</Button></span>)
              }
              return (<span className="inputButton" key={index}><Button  variant="contained" onClick={() => this.onAnswer(item)}>{item}</Button></span>);
            })
          }
        </div>
      </div>
    );
  }
}

export default withTheme(ButtonViewComponent);
