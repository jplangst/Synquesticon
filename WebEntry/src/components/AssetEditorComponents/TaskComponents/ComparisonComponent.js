import React, { Component } from 'react';

import db_helper from '../../../core/db_helper';
import * as dbObjects from '../../../core/db_objects';

//Material UI imports
import Button from '@material-ui/core/Button';
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from '@material-ui/core/TextField';

//Component imports
import SelectImageComponent from './SelectImageComponent';

import '../EditTaskComponent.css';

const subTaskTypeOptions = [
  'Text',
  'Image'
];

class TextComponent extends Component {
  constructor(props) {
    super(props);
    this.responseHandler = this.onResponsesChanged;
  }

  render() {
    return (<div>
      <TextField
        required
        padding="dense"
        id="instructionText"
        defaultValue={this.props.task.label}
        placeholder="Write your label here"
        label="Label"
        ref="instructionTextRef"
        fullWidth
        multiline
        rows="3"
        onChange={(e)=>{this.props.task.label = e.target.value}}
      />
      <TextField
        required
        padding="dense"
        id="instructionText"
        defaultValue={this.props.task.text}
        placeholder="Write your text here"
        label="Text"
        ref="instructionTextRef"
        fullWidth
        multiline
        rows="3"
        onChange={(e)=>{this.props.task.text = e.target.value}}
      />
    </div>);
  }
}

class SubTaskComponent extends Component {
  constructor(props) {
    super(props);
  }

  onPickingTaskType(e) {
    this.props.task.subType = e.target.value;
    this.forceUpdate();
  }

  onSelectImage(should, image) {
    this.shouldUpload = should;
    this.imageToUpload = image;
  }

  render() {
    var taskContent = null;
    if(this.props.task.subType === "Text"){
      taskContent = <TextComponent task={this.props.task}/>;
    }
    else if(this.props.task.subType === "Image"){
      taskContent = <SelectImageComponent task={this.props.task} selectImageCallback={this.onSelectImage.bind(this)}/>;
    }
    return (<div>
        <FormControl className="formControl">

          <Select
            value={this.props.task.subType}
            onChange={this.onPickingTaskType.bind(this)}
            style={{width:"96%",marginRight:"10px"}}
            inputProps={{
              name: "taskType",
              id: "TaskType"
            }}
          >
          {
            subTaskTypeOptions.map((taskTypeOption) => {
              return <MenuItem key={taskTypeOption} value={taskTypeOption}>{taskTypeOption}</MenuItem>
            })
          }
          </Select>
        </FormControl>
        {taskContent}
      </div>);
  }
}

class ComparisonComponent extends Component {
  constructor(props){
    super(props);

    //If we got a taskObject passed as a prop we use it, otherwise we init with a default constructed object
    this.state = { //We keep these fields in the state as they affect how the component is rendered
      selectedImage: this.props.taskObject ? this.props.taskObject.image : "",
    };

    this.shouldUpload = false;
    this.imageToUpload = null;
  }

  onSelectImage(should, image) {
    this.shouldUpload = should;
    this.imageToUpload = image;
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

  uploadImages() {
    if (this.imageToUpload) {
      const formData = new FormData();
      formData.append('images',this.imageToUpload);
      //formData.set('filename', this.props.task.image);

      const config = {
          headers: {
              'content-type': 'multipart/form-data'
          }
      };
      db_helper.uploadImage(this.imageToUpload, formData, config, null);
    }
  }

  /*
██████  ███████ ███    ██ ██████  ███████ ██████
██   ██ ██      ████   ██ ██   ██ ██      ██   ██
██████  █████   ██ ██  ██ ██   ██ █████   ██████
██   ██ ██      ██  ██ ██ ██   ██ ██      ██   ██
██   ██ ███████ ██   ████ ██████  ███████ ██   ██
*/

  render() {
    console.log("ComparisonComponent", this.props.task);
    return(
      <div className="taskComponentContainer">
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
        <SubTaskComponent task={this.props.task.subTasks[0]} />
        <SubTaskComponent task={this.props.task.subTasks[1]} />
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
      </div>

    );
  }
}

export default ComparisonComponent;
