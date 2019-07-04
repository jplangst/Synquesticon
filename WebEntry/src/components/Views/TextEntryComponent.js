import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';

import './TextEntryComponent.css';

class TextEntryComponent extends Component {
  constructor() {
    super();
    this.textEntry = "";
  }

  reset() {
    if (!this.props.hasBeenAnswered) {
      this.textEntry = "";
    }
  }

  checkAnswer() {
    if (this.props.task.correctResponses === undefined || this.props.task.correctResponses.length == 0) {
      return "notApplicable";
    }

    if (this.props.task.correctResponses.includes(this.textEntry)) {
      return "correct";
    }
    return "incorrect";
  }

  onAnswer() {
    var answerObj = {
      responses: [this.textEntry],
      correctlyAnswered: this.checkAnswer()
    }
    this.props.answerCallback(answerObj);
  }

  render() {
    this.reset();
    return (
      <div>
        <div className="questionDisplay">
          {this.props.task.question}
        </div>
        <div className="responsesButtons">
        <TextField
          id="outlined-name"
          className="textField"
          value={this.textEntry}
          onChange={(e)=>{
            this.textEntry = e.target.value;
            this.onAnswer();
          }}
          margin="normal"
          variant="outlined"
        />
        </div>
      </div>
    );
  }
}

export default TextEntryComponent;
