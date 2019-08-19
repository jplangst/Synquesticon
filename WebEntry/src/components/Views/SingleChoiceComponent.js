import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import './SingleChoiceComponent.css';

class SingleChoiceComponent extends Component {
  constructor() {
    super();
    this.pickedItem = null;
    this.hasBeenAnswered = false;
  }

  reset() {
    if (this.props.newTask) {
      this.pickedItem = null;
      this.hasBeenAnswered = false;
    }
  }

  checkAnswer() {
    if (this.props.task.correctResponses === undefined || this.props.task.correctResponses.length == 0) {
      return "notApplicable";
    }

    if (this.props.task.correctResponses.includes(this.pickedItem)) {
      return "correct";
    }
    return "incorrect";
  }

  onAnswer(response) {
    if (!this.hasBeenAnswered) {
      this.pickedItem = response;
      var answerObj = {
        responses: [this.pickedItem],
        correctlyAnswered: this.checkAnswer(),
        taskID: this.props.task._id,
        mapID: this.props.mapID,
      }
      this.props.answerCallback(answerObj);
      this.hasBeenAnswered = true;
    }
  }
  render() {
    this.reset();
    return (
      <div>
        <div className="questionDisplay">
          {this.props.task.question}
        </div>
        <div className="responsesButtons">
          {
            this.props.task.responses.map((item, index)=>{
              if (item === this.pickedItem) {
                return (
                  <span className="inputButton" key={index}><Button  variant="contained"  disabled={this.hasBeenAnswered} onClick={() => this.onAnswer(item)}>{item}</Button></span>)
              }
              return (<span className="inputButton" key={index}><Button  variant="contained" onClick={() => this.onAnswer(item)}>{item}</Button></span>);
            })
          }
        </div>
      </div>
    );
  }
}

export default SingleChoiceComponent;
