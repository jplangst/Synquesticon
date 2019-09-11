import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

class InstructionComponent extends Component {
  render() {
    return(
        <TextField
          required
          
          padding="dense"
          style={{width:"calc(96% + 10px)"}}
          id="instructionText"
          defaultValue={this.props.task.instruction}
          placeholder="Write your instruction here"
          label="Instructions"
          ref="instructionTextRef"
          fullWidth
          multiline
          rows="3"
          onChange={(e)=>{this.props.task.instruction = e.target.value}}
        />
    );
  }
}

export default InstructionComponent;
