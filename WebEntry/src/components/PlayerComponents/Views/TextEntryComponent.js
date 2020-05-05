import React, { Component } from 'react';

import { Typography, TextField } from '@material-ui/core';

import store from '../../../core/store';

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
        name: this.props.parentSet + '_' + this.props.task.displayText,
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
    this.textEntry = this.textEntry.replace(/\s\s+/g, ' ');
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
      <div className={this.props.className} style={{display:'flex', position:'relative', 
        flexDirection:'column', width:'100%', flexGrow:0,flexShrink:0}}>
        <Typography ref={this.textRef} variant="h3" align="center" style={{whiteSpace:"pre-line", width:'100%'}} color="textPrimary">
          {this.props.task.displayText}
        </Typography>
        <TextField
          id="outlined-name"
          className="textField"
          inputProps={{style: { overflowX:'hidden'}}}
          variant="outlined"
          value={this.textEntry}
          fullWidth
          margin='dense'
          multiline
          rows={3}
          rowsMax={10}
          onChange={(e) => this.onAnswer(e)}
        />
      </div>
    );
  }
}

export default TextEntryComponent;
