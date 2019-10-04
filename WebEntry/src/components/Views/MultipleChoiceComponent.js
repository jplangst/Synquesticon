import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';

import './MultipleChoiceComponent.css';

class MultipleChoiceComponent extends Component {
  constructor() {
    super();
    this.pickedItems = [];
  }

  reset() {
    if (this.props.newTask) {
      this.pickedItems = [];
    }
  }

  checkAnswer() {
    if (this.props.task.correctResponses === undefined || this.props.task.correctResponses.length == 0) {
      return "notApplicable";
    }
    for (var i = 0; i < this.props.task.correctResponses.length; i++) {
        if (!this.pickedItems.includes(this.props.task.correctResponses[i])) {
          return "incorrect";
        }
    }
    return "correct";
  }

  onAnswer(item) {
    this.pickedItems.push(item);
    var answerObj = {
      responses: this.pickedItems,
      correctlyAnswered: this.checkAnswer(),
      taskID: this.props.task._id,
      mapID: this.props.mapID,
    }
    this.props.answerCallback(answerObj);
  }

  render() {
    let theme = this.props.theme;
    this.reset();
    return (
      <div className={this.props.className}>
        <Typography variant="h3" color="textPrimary">{this.props.task.question}</Typography>
        <div className="responsesButtons">
          {
            this.props.task.responses.map((item, index)=>{
              if (this.pickedItems.includes(item)) {
                return (
                  <span className="inputButton" key={index}><Button  variant="contained" style={{color:theme.palette.text.secondary}} disabled={true} onClick={() => this.onAnswer(item)}>{item}</Button></span>)
              }
              return (<span className="inputButton" key={index}><Button  variant="contained" onClick={() => this.onAnswer(item)}>{item}</Button></span>);
            })
          }
        </div>
      </div>
    );
  }
}

export default withTheme(MultipleChoiceComponent);
