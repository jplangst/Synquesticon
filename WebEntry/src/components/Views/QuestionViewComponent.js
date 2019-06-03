import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

//icons
import CancelIcon from '@material-ui/icons/Cancel';
import NavigationIcon from '@material-ui/icons/NavigateNext';

import wamp from '../core/wamp';
import store from '../core/store';

import './QuestionViewComponent.css';

class QuestionViewComponent extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <div className="questionDisplay">
          {this.props.task.question}
        </div>
        <div className="responsesButtons">
          {
            this.props.task.responses.map((item, index)=>{
              if (item === this.state.answerItem) {
                return (
                  <Button variant="contained" className="picked" disabled={this.state.hasBeenAnswered} onClick={() => this.onAnswer(item)}>{item}</Button>)
              }
              return (<Button variant="contained" className="picked" disabled={this.state.hasBeenAnswered} onClick={() => this.onAnswer(item)}>{item}</Button>);
            })
          }
        </div>
      </div>
    );
  }
}

export default QuestionViewComponent;
