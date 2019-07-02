import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

class SingleChoiceComponent extends Component {
  constructor(props){
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
    else if(target==="Correct Response"){
      this.props.task.correctResponses = response;
    }
  }

  render() {
    var singleChoiceContent =
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
        <TextField label="Responses"
          required
          autoFocus
          margin="dense"
          style={{marginRight:"10px", width:"calc(50% - 5px)"}}
          id="responses"
          defaultValue={this.props.task.responses.join(',')}
          placeholder="Response A, Response B"
          helperText="Question responses seperated by a comma"
          ref="responsesRef"
          onChange={(e)=> this.responseHandler(e, e.target.value, "Responses")}
        />
        <TextField label="Correct Response"
          required
          autoFocus
          margin="dense"
          style={{width:"calc(50% - 5px)"}}
          id="tags"
          defaultValue={this.props.task.correctResponses.join(',')}
          placeholder="Response A"
          helperText="The correct response to the question"
          ref="correctResponseRef"
          onChange={(e)=> this.responseHandler(e, e.target.value, "Correct Response")}
        />
        <TextField label="Unit"
          autoFocus
          margin="dense"
          style={{marginRight:"10px", width:"calc(50% - 5px)"}}
          id="unit"
          defaultValue={this.props.task.responseUnit}
          placeholder="%"
          helperText="The unit of the responses if they are numerical"
          ref="unitRef"
          onChange={(e)=> this.props.task.responseUnit = e.target.value}
        />
        <TextField label="Tags"
          required
          autoFocus
          margin="dense"
          style={{width:"calc(50% - 5px)"}}
          id="tags"
          defaultValue={this.props.task.tags.join(',')}
          placeholder="Valve, Steam Engine"
          helperText="Tags seperated by a comma"
          ref="tagsRef"
          onChange={(e)=> this.responseHandler(e, e.target.value, "Tags")}
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
      </div>;

    return(
      singleChoiceContent
    );
  }
}

export default SingleChoiceComponent;
