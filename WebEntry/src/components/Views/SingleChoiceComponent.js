import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import './SingleChoiceComponent.css';

class SingleChoiceComponent extends Component {
  constructor() {
    super();
    this.state = {
      answerItem : "",
      hasBeenAnswered: false
    }
  }

  onAnswer(response) {
    this.setState({
      answerItem: response,
      hasBeenAnswered: true
    });
    this.props.answerCallback(response);
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
              if (item === this.props.answerItem) {
                return (
                  <Button variant="contained" className="picked" disabled={this.props.hasBeenAnswered} onClick={() => this.onAnswer(item)}>{item}</Button>)
              }
              return (<Button variant="contained" className="picked" disabled={this.props.hasBeenAnswered} onClick={() => this.onAnswer(item)}>{item}</Button>);
            })
          }
        </div>
      </div>
    );
  }
}

export default SingleChoiceComponent;
