import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

class InstructionComponent extends Component {
  constructor(props) {
    super(props);
    this.responseHandler = this.onResponsesChanged;
  }

  onResponsesChanged(e, response, target){
    response = response.replace(/\s+/g, " ");
    response = response.trim();
    response = response.split(",");
    response = response.map((value)=>{
      return value.trim();
    });
    response = response.filter(Boolean); //Remove empty values

    if(target==="Responses"){
      this.props.task.responses = response;
    }
    else if(target==="Tags"){
      this.props.task.tags = response;
    }
    else if(target==="AOIs"){
      //this.task.aois = response;
      //TODO: implement interface for this functionality
    }
    else if(target==="Correct Responses"){
      this.props.task.correctResponses = response;
    }
  }

  render() {
    return(
      <div className="instructionTaskContainer">
        <TextField
          required
          padding="dense"
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
        <TextField label="Tags"
          required

          padding="dense"
          style={{width:"calc(50% - 5px)"}}
          id="tags"
          defaultValue={this.props.task.tags?this.props.task.tags.join(','):""}
          placeholder="Valve, Steam Engine"
          helperText="Tags seperated by a comma"
          ref="tagsRef"
          onChange={(e)=> this.responseHandler(e, e.target.value, "Tags")}
        />
      </div>
    );
  }
}

export default InstructionComponent;
