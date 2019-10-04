import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

import './InstructionViewComponent.css';

class InstructionViewComponent extends Component {
  constructor(props) {
    super(props);
    this.onAnswer();
  }
  onAnswer() {
    if (this.props.newTask) {
      var answerObj = {
        responses: [],
        correctlyAnswered: "notApplicable",
        taskID: this.props.task._id,
        mapID: this.props.mapID,
      }
      this.props.answerCallback(answerObj);
    }
  }
  render() {
    return (
      <div className={this.props.className}>
        <Typography variant="h3" color="textPrimary">{this.props.task.instruction}</Typography>
      </div>
    );
  }
}

export default InstructionViewComponent;
