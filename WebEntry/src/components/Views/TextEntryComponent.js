import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';

import './TextEntryComponent.css';

class TextEntryComponent extends Component {
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
        <TextField
          id="outlined-name"
          label="Name"
          className="textField"
          value={values.name}
          onChange={handleChange('name')}
          margin="normal"
          variant="outlined"
        />
        </div>
      </div>
    );
  }
}

export default TextEntryComponent;
