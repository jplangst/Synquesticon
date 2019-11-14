import React, { Component } from 'react';

import { Typography } from '@material-ui/core';

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
        <Typography variant="h3" color="textPrimary" align="center" style={{whiteSpace:"pre-line"}}>{this.props.task.instruction}</Typography>
      </div>
    );
  }
}

export default InstructionViewComponent;
