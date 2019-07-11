import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import './InstructionViewComponent.css';

class InstructionViewComponent extends Component {
  constructor(props) {
    super(props);
    this.onAnswer();
  }
  onAnswer() {
    if (!this.props.hasBeenAnswered) {
      var answerObj = {
        responses: [],
        correctlyAnswered: "notApplicable"
      }
      this.props.answerCallback(answerObj);
    }
  }
  render() {
    return (
      <div className="questionDisplay">
        {this.props.task.instruction}
      </div>
    );
  }
}

export default InstructionViewComponent;
