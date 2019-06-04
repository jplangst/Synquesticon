import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import './InstructionViewComponent.css';

class InstructionViewComponent extends Component {
  render() {
    return (
      <div className="instructionDisplay">
        {this.props.task.instruction}
      </div>
    );
  }
}

export default InstructionViewComponent;
