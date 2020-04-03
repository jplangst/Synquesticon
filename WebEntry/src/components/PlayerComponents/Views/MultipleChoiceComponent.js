import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';

import store from '../../../core/store';

import './MultipleChoiceComponent.css';

class MultipleChoiceComponent extends Component {
  constructor() {
    super();
    this.pickedItems = [];
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

  reset() {
    if (this.props.newTask) {
      this.pickedItems = [];
    }
  }

  checkAnswer() {
    if (this.props.task.correctResponses === undefined || this.props.task.correctResponses.length === 0) {
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
    //this is for accommodating the legacy
    var displayText = this.props.task.question == undefined ? this.props.task.displayText : this.props.task.question;
    return (
      <div className={this.props.className}>
        <Typography ref={this.textRef} variant="h3" color="textPrimary" align="center" style={{whiteSpace:"pre-line"}}>{displayText}</Typography>
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
