import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class TextEntryComponent extends Component {
  constructor(props){
    super(props);

    this.state = {
      globalVariable: props.task.globalVariable,
    };

    this.responseHandler = this.onResponsesChanged;

    this.handleGlobalVariableChanged = this.onGlobalVariableChanged.bind(this);
  }

  //TODO this could be an interface implementable function
  onGlobalVariableChanged(e, checked){
    this.props.task.globalVariable = checked;
    this.setState({
      globalVariable: checked,
    });
  }

  //TODO this could be an interface implementable function
  onResponsesChanged(e, response, target){
    response = response.replace(/\s+/g, " ");
    response = response.trim();
    response = response.split(",");
    response = response.map((value)=>{
      value = value.trim();
      return value;
    });
    response = response.filter(Boolean); //Remove empty values

    if(target==="Tags"){
      this.props.task.tags = response;
    }

    else if(target==="Correct Responses"){
      this.props.task.correctResponses = response;
    }
  }


  render() {
    var textEntryContent =
      <div className="questionTypeContainer">
        <TextField label="Question"
          required

          padding="dense"
          fullWidth
          id="questionText"
          defaultValue={this.props.task.question}
          placeholder="Enter your question here"
          ref="questionTextRef"
          multiline
          rows="3"
          onChange={(e)=>{this.props.task.question = e.target.value}}
        />
        <TextField label="Correct Response"
          required

          padding="dense"
          style={{marginRight:"10px", width:"calc(40% - 15px)"}}
          id="correctResponses"
          defaultValue={this.props.task.correctResponses.join(',')}
          placeholder="Correct Answer, Margin(Optional)"
          helperText="Enter the correct answer and optionally a margin seperated with a comma, +- that still allows a correct answer. E.g. 5,2 would let anything between 3-7 be a correct answer"
          ref="correctResponseRef"
          onChange={(e)=> this.responseHandler(e, e.target.value, "Correct Responses")}
        />
        <TextField label="Tags"
          required

          padding="dense"
          fullWidth
          id="tags"
          defaultValue={this.props.task.tags.join(',')}
          placeholder="Valve, Steam Engine"
          helperText="Tags seperated by a comma"
          ref="tagsRef"
          onChange={(e)=> this.responseHandler(e, e.target.value, "Tags")}
        />
        <FormControlLabel label="Treat Response as Global Variable"
          value="end"
          padding="dense"
          checked={this.state.globalVariable}
          control={<Checkbox style={{width:"50px"}} color="secondary" />}
          onChange={this.handleGlobalVariableChanged}
          labelPlacement="end"
        />
      </div>;

    return(
      textEntryContent
    );
  }
}

export default TextEntryComponent;
