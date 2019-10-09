import React, { Component } from 'react';

//import TextField from '@material-ui/core/TextField';
import InputBase from '@material-ui/core/InputBase';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import './TextEntryComponent.css';

const first_line_keyboard = [0, 1, 2, 3, 4]
const second_line_keyboard = [5, 6, 7, 8, 9]
const third_line_keyboard = ['.', '<--']

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
    if (this.props.newTask) {
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
      correctlyAnswered: this.checkAnswer(),
      taskID: this.props.task._id,
      mapID: this.props.mapID,
    }
    this.props.answerCallback(answerObj);
  }

  render() {
    /* SAVE FOR LATER
    <TextField
      id="outlined-name"
      className="textField"
      value={this.textEntry}
      InputProps={{
                readOnly: true
              }}
      padding="normal"
      variant="outlined"
      onClick={(e)=>{e.preventDefault(); e.stopPropagation()}}
    />

    */


    this.reset();

    var getKeyboardLine = (keyboard, css) => {
      return (<div className={css}>
              {keyboard.map((item, index) => {
                  return <span className="inputButton" key={index}>
                            <Button key={index} variant="contained" onClick={() => this.keyboardPressed(item)}>
                              {item}
                            </Button>
                         </span>
                  }
                )
              }
              </div>);
    }

    return (
      <div className={this.props.className + " TextEntry"} >
        <div className="questionDisplay">
          <Typography variant="h3" color="textPrimary">{this.props.task.question}</Typography>
        </div>
        <div className="inputField">
          <Typography color="textPrimary">{this.textEntry}</Typography>
        </div>
        {getKeyboardLine(first_line_keyboard, "firstLine")}
        {getKeyboardLine(second_line_keyboard, "firstLine")}
        {getKeyboardLine(third_line_keyboard, "thirdLine")}
      </div>
    );
  }
}

export default TextEntryComponent;
