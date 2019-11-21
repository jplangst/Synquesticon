import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class MultipleChoiceComponent extends Component {
  constructor(props){
    super(props);

    this.state = {
      singleChoice: props.task.taskType === "Single Choice" ? true : false,
      globalVariable: props.task.globalVariable,
    };

    this.responseHandler = this.onResponsesChanged;
    this.handleSingleChoiceChanged = this.onSingleChoiceChanged.bind(this);
    this.handleGlobalVariableChanged = this.onGlobalVariableChanged.bind(this);
  }

  onSingleChoiceChanged(e, checked){
    this.props.task.singleChoice = checked;
    this.setState({
      singleChoice: checked,
    });
    this.props.singleChoiceCallback(checked);
  }

  onGlobalVariableChanged(e, checked){
    this.props.task.globalVariable = checked;
    this.setState({
      globalVariable: checked,
    });
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

  /*<TextField label="Unit"

    padding="dense"
    style={{marginRight:"10px", width:"calc(50% - 5px)"}}
    id="unit"
    defaultValue={this.props.task.responseUnit}
    placeholder="%"
    helperText="The unit of the responses if they are numerical"
    ref="unitRef"
    onChange={(e)=> this.props.task.responseUnit = e.target.value}
  />
  <TextField label="AOIs"

    padding="dense"
    id="aoisText"
    defaultValue={this.props.task.aois.join(',')}
    placeholder="Screen A, Screen B"
    helperText="AOIs seperated by a comma"
    ref="aoisTextRef"
    fullWidth
    onChange={(e)=> this.responseHandler(e, e.target.value, "AOIs")}
  />*/

  render() {
    var objectiveResponseContent =
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
        <TextField label="Responses"
          required

          padding="dense"
          style={{marginRight:"10px", width:"calc(40% - 15px)"}}
          id="responses"
          defaultValue={this.props.task.responses.join(',')}
          placeholder="Response A, Response B, ResponseC"
          helperText="Question responses seperated by a comma"
          ref="responsesRef"
          onChange={(e)=> this.responseHandler(e, e.target.value, "Responses")}
        />
        <TextField label="Correct Responses"
          required

          padding="dense"
          style={{marginRight:"10px", width:"calc(40% - 15px)"}}
          id="tags"
          defaultValue={this.props.task.correctResponses.join(',')}
          placeholder="Response A, Response C"
          helperText="The correct responses to the question"
          ref="correctResponseRef"
          onChange={(e)=> this.responseHandler(e, e.target.value, "Correct Responses")}
        />
        <FormControlLabel label="Single Choice"
          value="end"
          padding="dense"

          checked={this.state.singleChoice}
          control={<Checkbox style={{width:"50%"}} color="secondary" />}
          onChange={this.handleSingleChoiceChanged}
          labelPlacement="end"
        />
        <TextField label="Tags"
          required

          padding="dense"
          style={{width:"calc(50% - 5px)"}}
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
      objectiveResponseContent
    );
  }
}

export default MultipleChoiceComponent;
