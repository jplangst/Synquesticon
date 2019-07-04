import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import './MultipleChoiceComponent.css';

class MultipleChoiceComponent extends Component {
  constructor() {
    super();
    this.pickedItems = [];
  }

  reset() {
    if (!this.props.hasBeenAnswered) {
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
          {
            this.props.task.responses.map((item, index)=>{
              if (this.pickedItems.includes(item)) {
                return (
                  <Button variant="contained" className="picked" color="primary" disabled={true} onClick={() => this.onAnswer(item)}>{item}</Button>)
              }
              return (<Button variant="contained" className="picked" onClick={() => this.onAnswer(item)}>{item}</Button>);
            })
          }
        </div>
      </div>
    );
  }
}

export default MultipleChoiceComponent;
