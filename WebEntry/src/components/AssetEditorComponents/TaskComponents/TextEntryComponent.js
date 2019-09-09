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

    if(target==="Tags"){
      this.props.task.tags = response;
    }
    else if(target==="AOIs"){
      //this.task.aois = response;
      //TODO: implement interface for this functionality
      this.props.task.aois = [{
          name: "window1",
          boundingbox: [[0.440425545, 0.156989247], [0.07234043, 0.156989247], [0.07234043, 0.56774193], [0.440425545, 0.56774193]]
        },
        {
          name: "window2",
          boundingbox: [[0.6, 0.156989247], [0.976595759, 0.156989247], [0.976595759, 0.688172042], [0.6, 0.688172042]]
        },
        {
          name: "fish",
          boundingbox: [[0.385106385, 0.677419364], [0.568085134, 0.677419364], [0.568085134, 0.8731183], [0.385106385, 0.8731183]]
        }
      ];
    }
  }

  render() {
    var textEntryContent =
      <div className="questionTypeContainer">
        <TextField label="Question"
          required
          autoFocus
          margin="dense"
          fullWidth
          id="questionText"
          defaultValue={this.props.task.question}
          placeholder="Enter your question here"
          ref="questionTextRef"
          multiline
          rows="3"
          onChange={(e)=>{this.props.task.question = e.target.value}}
        />
        <TextField label="Text Entry Rows"
          required
          autoFocus
          margin="dense"
          fullWidth
          id="freeTextRows"
          defaultValue={this.props.task.freeTextRows}
          placeholder="Enter how many rows you want the text entry to be"
          ref="entryRowsRef"
          onChange={(e)=>{this.props.task.freeTextRows = e.target.value}}
        />
        <TextField label="AOIs"
          autoFocus
          margin="dense"
          id="aoisText"
          defaultValue={this.props.task.aois.join(',')}
          placeholder="Screen A, Screen B"
          helperText="AOIs seperated by a comma"
          ref="aoisTextRef"
          fullWidth
          onChange={(e)=> this.responseHandler(e, e.target.value, "AOIs")}
        />
        <TextField label="Tags"
          required
          autoFocus
          margin="dense"
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
          margin="dense"
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
