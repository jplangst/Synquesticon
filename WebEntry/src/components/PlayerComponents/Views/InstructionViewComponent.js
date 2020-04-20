import React, { Component } from 'react';

import { Typography } from '@material-ui/core';

import store from '../../../core/store';

class InstructionViewComponent extends Component {
  constructor(props) {
    super(props);
    this.onAnswer();
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
    //this is for accommodating the legacy
    return (
      <div className={this.props.className}>
        <Typography ref={this.textRef} variant="h3" color="textPrimary" align="center" style={{whiteSpace:"pre-line"}}>{this.props.task.displayText}</Typography>
      </div>
    );
  }
}

export default InstructionViewComponent;
