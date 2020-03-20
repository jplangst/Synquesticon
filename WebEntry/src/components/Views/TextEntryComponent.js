import React, { Component } from 'react';

import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import store from '../../core/store';

import './TextEntryComponent.css';

class TextEntryComponent extends Component {
  constructor() {
    super();
    this.textEntry = "";
    this.textRef = React.createRef();
  }

  componentDidMount() {
    var textAOIAction = {
      type: 'ADD_AOIS',
      aois: {
        name: this.props.parentSet + '_' + this.props.task.question,
        boundingbox: [],
        imageRef: this.textRef
      }
    }
    store.dispatch(textAOIAction);
  }

  checkAnswer() {
    if (this.props.task.correctResponses === undefined || this.props.task.correctResponses.length === 0) {
      return "notApplicable";
    }

    for (var i = 0; i < this.props.task.correctResponses.length; i++) {
      var item = this.props.task.correctResponses[i];
      if (this.textEntry.toLowerCase() === item.toLowerCase()) {
        return "correct";
      }
    }
    return "incorrect";
  }

  onAnswer(e) {
    this.textEntry = e.target.value;
    var answerObj = {
      responses: [this.textEntry],
      correctlyAnswered: this.checkAnswer(),
      taskID: this.props.task._id,
      mapID: this.props.mapID,
    }
    this.props.answerCallback(answerObj);
  }

  render() {
    return (
      <div className={this.props.className} >
        <div>
          <Typography ref={this.textRef} variant="h3" align="center" style={{whiteSpace:"pre-line"}} color="textPrimary">{this.props.task.displayText}</Typography>
        </div>
        <TextField
          id="outlined-name"
          className="textField"
          defaultValue={this.textEntry}
          padding="normal"
          variant="outlined"
          onChange={(e) => this.onAnswer(e)}
        />
      </div>
    );
  }
}

export default TextEntryComponent;
