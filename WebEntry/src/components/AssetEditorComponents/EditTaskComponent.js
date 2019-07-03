import React, { Component } from 'react';

import * as dbFunctions from '../../core/db_helper';
import * as dbObjects from '../../core/db_objects';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import InstructionComponent from './TaskComponents/InstructionComponent';
import SelectImageComponent from './TaskComponents/SelectImageComponent';
import TextEntryComponent from './TaskComponents/TextEntryComponent';
import MultipleChoiceComponent from './TaskComponents/MultipleChoiceComponent';

import './EditTaskComponent.css';

const taskTypeOptions = [
  'Instruction',
  'Multiple Choice',
  'Text Entry',
  'Image',
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
    this.task = this.props.isEditing ? {...(new dbObjects.TaskObject()), ...this.props.taskObject} : new dbObjects.TaskObject();

    var taskType = "Multiple Choice";
    if(this.props.taskObject){
      if(this.props.taskObject.taskType){
        taskType = this.props.taskObject.taskType;
      }
    }

    this.state = { //We keep these fields in the state as they affect how the component is rendered
      taskType: taskType,
      task: this.task,
      selectedImage: this.props.taskObject ? this.props.taskObject.image : "",
    };

    this.responseHandler = this.onResponsesChanged;
    this.handleQuestionCallback = this.onDBCallback.bind(this);
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

  removeTask() {
    //TODO Dialog prompt "Are you sure you want to delete "Task", it will also be removed from the data base...
    dbFunctions.deleteTaskFromDb(this.state.task._id, this.handleQuestionCallback);
  }

  closeTaskComponent(componentChanged){
    this.props.closeTaskCallback(componentChanged);
  }

  //Called from the MultipleChoice component when the user interacts with the single choice checkbox //TODO this and the related changes are a hack. Not a good solution
  onSingleChoiceChanged(singleChoice){
    this.setState({
      taskType: singleChoice ? "Single Choice" : "Multiple Choice",
    });
  }

  render() {
    var questionTypeContent = null;
    if(this.state.taskType === "Single Choice" || this.state.taskType === "Multiple Choice"){
      questionTypeContent = <MultipleChoiceComponent singleChoiceCallback={this.onSingleChoiceChanged.bind(this)} task={this.task} />;
    }
    else if(this.state.taskType === "Text Entry"){
      questionTypeContent = <TextEntryComponent task={this.task} />;
    }

    var instructionTypeContent = (this.state.taskType === "Instruction" || this.state.taskType === "Complex") ?
                                    <InstructionComponent task={this.task}/> : null;

    var imageTypeContent = (this.state.taskType === "Image" || this.state.taskType === "Complex") ?
                                    <SelectImageComponent task={this.task} /> : null;

    var deleteTaskBtn = this.props.isEditing ?
      <Button onClick={this.removeTask.bind(this)} color="primary">Delete Task </Button> : null;

    var value = this.state.taskType === "Single Choice" ? "Multiple Choice" : this.state.taskType;

    return(
      <div className="componentContainer">
        <form className="formRoot" autoComplete="off" id="formRootId">
            <FormControl className="formControl">
              <InputLabel htmlFor="TaskType">Task Type</InputLabel>
              <Select
                value={value}
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
            {questionTypeContent}
            {imageTypeContent}

            <div className="editTaskFormButtons">
              <Button onClick={this.closeTaskComponent.bind(this, false)} color="primary">
                Cancel
              </Button>
              {deleteTaskBtn}
              <Button onClick={this.onChangeTaskSettings.bind(this)} color="primary">
                {this.props.isEditing ? "Edit" : "Create"}
              </Button>
            </div>
        </form>
      </div>
    );
  }
}

export default EditTaskComponent;
