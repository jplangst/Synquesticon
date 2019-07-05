import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';

import './TextEntryComponent.css';

const keyboard = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '.', '<--']

class TextEntryComponent extends Component {

  constructor() {
    super();
    this.textEntry = "";
    this.keyboardPressed = this.onMyKeyboardPressed.bind(this);
    this.decimalWasPressed = false;
  }

  onMyKeyboardPressed(key) {

    if (key === "<--") {
      var lastChar = this.textEntry[this.textEntry.length -1];
      if (lastChar === '.') {
        this.decimalWasPressed = false;
      }
      this.textEntry = this.textEntry.substring(0, this.textEntry.length-1);
    }
    else if (key === ".") {
      if (!this.decimalWasPressed) {
        this.textEntry += key;
        this.decimalWasPressed = true;
      }
    }
    else {
      this.textEntry = parseFloat(this.textEntry + key) + "";
    }
    this.onAnswer();
  }

  reset() {
    if (!this.props.hasBeenAnswered) {
      this.textEntry = "";
      this.decimalWasPressed = false;
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
      responses: [parseFloat(this.textEntry)],
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
          InputProps={{
                    readOnly: true,
                  }}
          margin="normal"
          variant="outlined"
        />
        <div>
          {
            keyboard.map((item, index) => {
              return <Button variant="contained" onClick={() => this.keyboardPressed(item)}>{item}</Button>
            })
          }
        </div>
        </div>
      </div>
    );
  }
}

export default TextEntryComponent;
