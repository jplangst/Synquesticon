import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';

import store from '../../../core/store';
import './ButtonViewComponent.css';

class ButtonViewComponent extends Component {
  constructor() {
    super();
    this.pickedItem = [];
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
    console.log("resest");
    this.pickedItems = [];
    this.forceUpdate();
  }

  checkAnswer() {
    if (this.props.task.correctResponses === undefined || this.props.task.correctResponses.length === 0) {
      return "notApplicable";
    }

    if (this.props.task.singleChoice) { //single choice
      if (this.props.task.correctResponses.includes(this.pickedItem)) {
        return "correct";
      }
      return "incorrect";
    }
    else { //multiple choice
      for (var i = 0; i < this.props.task.correctResponses.length; i++) {
          if (!this.pickedItems.includes(this.props.task.correctResponses[i])) {
            return "incorrect";
          }
      }
      return "correct";
    }
  }

  onAnswer(response) {
    console.log("resetResponses?", this.props.task);

    if (this.props.task.singleChoice) { //single choice
      if (this.pickedItems.length <= 0) {
        this.pickedItems.push(response);
      }
    }
    else { //multiple choice
      this.pickedItems.push(response);
    }
    var answerObj = {
      responses: [this.pickedItem],
      correctlyAnswered: this.checkAnswer(),
      taskID: this.props.task._id,
      mapID: this.props.mapID,
    }


    this.props.answerCallback(answerObj);

    if (this.props.task.resetResponses) {
      //setTimeout(this.reset(), 1000);
    }
  }
  render() {
    console.log("buttonview??????????????");
    let theme=this.props.theme;

    return (
      <div className={this.props.className}>
        <div>
          <Typography ref={this.textRef} variant="h3" color="textPrimary" align="center" style={{whiteSpace:"pre-line"}}>{this.props.task.displayText}</Typography>
        </div>
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

export default withTheme(ButtonViewComponent);
