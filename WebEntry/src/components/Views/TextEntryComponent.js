import React, { Component } from 'react';

import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import store from '../../core/store';

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
    if (this.props.task.correctResponses === undefined || this.props.task.correctResponses.length === 0) {
      return "notApplicable";
    }

    //if the response matches a list of responses we are ok
    if(this.props.task.correctResponses.includes(this.textEntry)) {
      return "correct";
    }
    //If the response has two values then we treat the second as how much the answer can differ and still be valid
    else if(this.props.task.correctResponses.length > 1){
      let answer = parseFloat(this.textEntry);
      let correctAnswer = this.props.task.correctResponses[0];
      let threshold = this.props.task.correctResponses[1];
      if(answer > correctAnswer-threshold && answer < correctAnswer+threshold){
        return "correct";
      }
    } //Otherwise we just check if it matches the correct response

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
          <Typography ref={this.textRef} variant="h3" align="center" style={{whiteSpace:"pre-line"}} color="textPrimary">{this.props.task.question}</Typography>
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
