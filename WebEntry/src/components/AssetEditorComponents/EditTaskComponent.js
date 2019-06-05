import React, { Component } from 'react';

import * as dbFunctions from '../../core/db_helper';
import * as dbObjects from '../../core/db_objects';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import FileSelector from '../../core/fileSelector';

import './EditTaskComponent.css';

const taskTypeOptions = [
  'Instruction',
  'Question',
  'Image',
  'Complex'
];

const responseTypeOptions = [
  'Free text',
  'Single Choice',
  'Numerical',
];

class EditTaskComponent extends Component {
  constructor(props){
    super(props);

    //If we got a taskObject passed as a prop we use it, otherwise we init with a default constructed object
    this.task = this.props.isEditing ? this.props.taskObject : new dbObjects.TaskObject();

    var taskType = "Question";
    var responseType = "Single Choice";
    if(this.props.taskObject){
      if(this.props.taskObject.taskType){
        taskType = this.props.taskObject.taskType;
      }
      if(this.props.taskObject.responseType){
        responseType = this.props.taskObject.responseType;
      }
    }

    this.state = { //We keep these fields in the state as they affect how the component is rendered
      taskType: taskType,
      responseType: responseType,
      task: this.task,
      selectedImage: this.props.taskObject ? this.props.taskObject.image : "",
    };

    this.responseHandler = this.onResponsesChanged;
    this.handleQuestionCallback = this.onDBCallback.bind(this);
    this.handleImageSelectedCallback = this.onImageFileSelected.bind(this);
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onDBCallback(questionDBID){
    //TODO close and reopen as editing instead. Highlight the task in the left menu
    this.closeTaskComponent(true);
  }

  onChangeTaskSettings(){
    this.task.taskType = this.state.taskType;
    this.task.responseType = this.state.responseType;

    if(this.props.isEditing){
      dbFunctions.updateTaskFromDb(this.task._id, this.task, this.handleQuestionCallback);
    }
    else{
      console.log(this.task);
      dbFunctions.addTaskToDb(this.task, this.handleQuestionCallback);
    }
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
      this.task.responses = response;
    }
    else if(target==="Tags"){
      this.task.tags = response;
    }
    else if(target==="AOIs"){
      //this.task.aois = response;
      //TODO: implement interface for this functionality

      this.task.aois = [{
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
    else if(target==="Answers"){
      this.task.correctResponses = response;
    }
  }

  onImageFileSelected(selectedFile){
    console.log(selectedFile);
    this.task.image = selectedFile.name;

    this.setState({selectedImage: this.task.image});
  }

  removeTask() {
    //TODO Dialog prompt "Are you sure you want to delte "Task", it will also be removed from the data base...
    dbFunctions.deleteTaskFromDb(this.state.task._id, this.handleQuestionCallback);
  }

  closeTaskComponent(componentChanged){
    this.props.closeTaskCallback(componentChanged);
  }

  render() {
    var questionTypeContent = null;
    var questionResponseType = null;

    if(this.state.taskType === "Question" || this.state.taskType === "Complex"){
      questionResponseType =
      <FormControl className="formControl">
        <InputLabel htmlFor="ResponseType">Response Type</InputLabel>
        <Select
          value={this.state.responseType}
          onChange={this.handleChange}
          fullWidth
          inputProps={{
            name: "responseType",
            id: "ResponseType"
          }}
        >
        {
          responseTypeOptions.map((responseTypeOption) => {
            return <MenuItem key={responseTypeOption} value={responseTypeOption}>{responseTypeOption}</MenuItem>
          })
        }
        </Select>
      </FormControl>;

      questionTypeContent =
      <div>
        <TextField
          required
          autoFocus
          margin="dense"
          fullWidth
          id="questionText"
          defaultValue={this.task.question}
          placeholder="What is your favorite colour? What is thy quest? What is the air speed velocity of a Swallow? What do you mean? Is it an African Swallow or a European Swallow?"
          label="Question"
          ref="questionTextRef"
          multiline
          rows="3"
          onChange={(e)=>{this.task.question = e.target.value}}
        />

        {questionResponseType}

        <TextField
          required
          autoFocus
          margin="dense"
          style={{marginRight:"10px", width:"48%"}}
          id="responses"
          defaultValue={this.task.responses.join(',')}
          placeholder="Arrrrrghhhhh, Castle Arrrrrghhh"
          helperText="Question responses seperated by a comma"
          label="Responses"
          ref="responsesRef"
          onChange={(e)=> this.responseHandler(e, e.target.value, "Responses")}
        />
        <TextField
          autoFocus
          margin="dense"
          style={{width:"48%"}}
          id="unit"
          defaultValue={this.task.responseUnit}
          placeholder="%"
          helperText="The unit of the responses if they are numerical"
          label="Unit"
          ref="unitRef"
          onChange={(e)=> this.task.responseUnit = e.target.value}
        />

        <TextField
          required
          autoFocus
          margin="dense"
          style={{marginRight:"10px", width:"48%"}}
          id="tags"
          defaultValue={this.task.correctResponses.join(',')}
          placeholder="What do you mean? Is it an African swallow or a European swallow?"
          helperText="The correct answer to the question"
          label="Correct Answers"
          ref="answerRef"
          onChange={(e)=> this.responseHandler(e, e.target.value, "Answers")}
        />
        <TextField
          required
          autoFocus
          margin="dense"
          style={{width:"48%"}}
          id="tags"
          defaultValue={this.task.tags.join(',')}
          placeholder="SillyWalks, Swallows"
          helperText="Tags seperated by a comma"
          label="Tags"
          ref="tagsRef"
          onChange={(e)=> this.responseHandler(e, e.target.value, "Tags")}
        />
        <TextField
          autoFocus
          margin="dense"
          style={{width:"calc(96% + 10px)"}}
          id="aoisText"
          defaultValue={this.task.aois.join(',')}
          placeholder="Screen A, Screen B"
          helperText="AOIs seperated by a comma"
          label="AOIs"
          ref="aoisTextRef"
          fullWidth
          onChange={(e)=> this.responseHandler(e, e.target.value, "AOIs")}
        />
        </div>;


    }

    var instructionTypeContent = null;
    if(this.state.taskType === "Instruction" || this.state.taskType === "Complex"){
      instructionTypeContent =
      <div>
        <TextField
          required
          autoFocus
          margin="dense"
          style={{width:"calc(96% + 10px)"}}
          id="instructionText"
          defaultValue={this.task.instruction}
          placeholder="What is your favorite colour? What is thy quest? What is the air speed velocity of a Swallow? What do you mean? Is it an African Swallow or a European Swallow?"
          label="Instructions"
          ref="instructionTextRef"
          fullWidth
          multiline
          rows="3"
          onChange={(e)=>{this.task.instruction = e.target.value}}
        />
      </div>;
    }

    FileSelector
    var imageTypeContent = null;
    if(this.state.taskType === "Image" || this.state.taskType === "Complex"){
      var previewImage = null;
      if(this.task.image && this.task.image !== ""){
        previewImage = <img src={"Images/"+this.task.image} alt="Task Image" />;
      }

      imageTypeContent =
      <div className="imageTypeContainer">
        <div className="imageContainer">{previewImage}</div>
        <div className="fileSelectorContainer"><FileSelector handleSelectionCallback={this.handleImageSelectedCallback}/></div>
      </div>;
    }
    //TODO add image preview here

    var deleteTaskBtn = null;
    if(this.props.isEditing){
      deleteTaskBtn = <Button onClick={this.removeTask.bind(this)} color="primary">
        Delete Task
        </Button>;
    }

    return(
      <div className="componentContainer">
        <form className="formRoot" autoComplete="off" id="formRootId">
            <FormControl className="formControl">
              <InputLabel htmlFor="TaskType">Task Type</InputLabel>
              <Select
                value={this.state.taskType}
                onChange={this.handleChange}
                style={{width:"96%",marginRight:"10px"}}
                inputProps={{
                  name: "taskType",
                  id: "TaskType"
                }}
              >
              {
                taskTypeOptions.map((taskTypeOption) => {
                  return <MenuItem key={taskTypeOption} value={taskTypeOption}>{taskTypeOption}</MenuItem>
                })
              }
              </Select>
            </FormControl>

            {instructionTypeContent}
            {imageTypeContent}
            {questionTypeContent}

        </form>
          <Button onClick={this.closeTaskComponent.bind(this, false)} color="primary">
            Cancel
          </Button>
          {deleteTaskBtn}
          <Button onClick={this.onChangeTaskSettings.bind(this)} color="primary">
            {this.props.isEditing ? "Edit" : "Create"}
          </Button>
      </div>
    );
  }
}

export default EditTaskComponent;
