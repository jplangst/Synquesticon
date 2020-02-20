import React, { Component } from 'react';

import db_helper from '../../core/db_helper';
import * as dbObjects from '../../core/db_objects';
import store from '../../core/store';
//Material UI imports
import Button from '@material-ui/core/Button';
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import Snackbar from '@material-ui/core/Snackbar';

//Component imports
import InstructionComponent from './TaskComponents/InstructionComponent';
import SelectImageComponent from './TaskComponents/SelectImageComponent';
import TextEntryComponent from './TaskComponents/TextEntryComponent';
import MultipleChoiceComponent from './TaskComponents/MultipleChoiceComponent';
import ComparisonComponent from './TaskComponents/ComparisonComponent';

import './EditTaskComponent.css';

const taskTypeOptions = [
  'Instruction',
  'Multiple Choice',
  'Text Entry',
  'Image',
  'Comparison'
];

class EditTaskComponent extends Component {
  constructor(props){
    super(props);

    //If we got a taskObject passed as a prop we use it, otherwise we init with a default constructed object
    var copiedTask = new dbObjects.TaskObject();
    if (this.props.isEditing) {
      copiedTask = JSON.parse(JSON.stringify(this.props.taskObject));
    }
    this.task = this.props.isEditing ? {...(new dbObjects.TaskObject()), ...copiedTask} : new dbObjects.TaskObject();

    this.state = { //We keep these fields in the state as they affect how the component is rendered
      taskType: this.task.taskType,//taskType,
      task: this.task,
      selectedImage: this.props.taskObject ? this.props.taskObject.image : "",
    };

    this.responseHandler = this.onResponsesChanged;
    this.handleQuestionCallback = this.onDBCallback.bind(this);

    this.shouldUpload = false;
    this.imageToUpload = null;

    //Used to determine if the object should be closed
    this.shouldCloseAsset = false;
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onDBCallback(questionDBID){
    if(this.shouldReopen){
      this.shouldReopen = false;
      var setEditTaskAction = {
        type: 'SET_SHOULD_EDIT_TASK',
        shouldEditTask: true,
        taskToEdit:{...this.task,...{_id:questionDBID}}
      };
      store.dispatch(setEditTaskAction);
    }
    //TODO close and reopen as editing instead. Highlight the task in the left menu
    this.closeTaskComponent(true, this.shouldCloseAsset);
  }

  onChangeTaskSettings(){
    this.setState({
      snackbarOpen: false
    });

    this.task.taskType = this.state.taskType;

    if(this.task.taskType !== "Comparison") {
      this.task.subTasks = [];
    }

    console.log("save object", typeof(this.task.subTasks));

    if(this.props.isEditing){
      this.shouldCloseAsset = false;
      db_helper.updateTaskFromDb(this.task._id, this.task, this.handleQuestionCallback);
      this.setState({
        snackbarOpen: true,
        snackbarMessage: "Set saved"
      });
    }
    else{
      this.shouldCloseAsset = true;
      this.shouldReopen = true;
      db_helper.addTaskToDb(this.task, this.handleQuestionCallback);
      this.setState({
        snackbarOpen: true,
        snackbarMessage: "Set created"
      });
    }

    console.log("on save", this.task.taskType, this.shouldUpload);
    if (this.task.taskType === "Image" && this.shouldUpload) {
      this.uploadImages();
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
    }
    else if(target==="Answers"){
      this.task.correctResponses = response;
    }
  }

  onSelectImage(should, image) {
    this.shouldUpload = should;
    this.imageToUpload = image;
  }

  removeTask() {
    this.shouldCloseAsset = true;
    this.setState({
      snackbarOpen: false
    });

    this.setState({
      snackbarOpen: true,
      snackbarMessage: "Set deleted"
    });

    db_helper.deleteTaskFromDb(this.state.task._id, this.handleQuestionCallback);
  }

  closeTaskComponent(componentChanged, overrideShouldClose){
    let shouldClose = overrideShouldClose ? overrideShouldClose : this.shouldCloseAsset;
    this.props.closeTaskCallback(componentChanged,shouldClose);
  }

  //Called from the MultipleChoice component when the user interacts with the single choice checkbox //TODO this and the related changes are a hack. Not a good solution
  onSingleChoiceChanged(singleChoice){
    this.setState({
      taskType: singleChoice ? "Single Choice" : "Multiple Choice",
    });
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

  handleCloseSnackbar(event, reason) {
    this.setState({
      snackbarOpen: false
    });
  }

  /*
██████  ███████ ███    ██ ██████  ███████ ██████
██   ██ ██      ████   ██ ██   ██ ██      ██   ██
██████  █████   ██ ██  ██ ██   ██ █████   ██████
██   ██ ██      ██  ██ ██ ██   ██ ██      ██   ██
██   ██ ███████ ██   ████ ██████  ███████ ██   ██
*/

  render() {
    var questionTypeContent = null;
    if(this.state.taskType === "Single Choice" || this.state.taskType === "Multiple Choice"){
      questionTypeContent = <MultipleChoiceComponent singleChoiceCallback={this.onSingleChoiceChanged.bind(this)} task={this.task} />;
    }
    else if(this.state.taskType === "Text Entry"){
      questionTypeContent = <TextEntryComponent task={this.task} />;
    }

    var instructionTypeContent = (this.state.taskType === "Instruction") ?
                                    <InstructionComponent task={this.task}/> : null;

    var imageTypeContent = (this.state.taskType === "Image") ?
                                    <SelectImageComponent task={this.task} selectImageCallback={this.onSelectImage.bind(this)}/> : null;

    var comparisonContent = (this.state.taskType === "Comparison") ?
                                    <ComparisonComponent task={this.task} /> : null;

    var deleteTaskBtn = this.props.isEditing ?
      <Button onClick={this.removeTask.bind(this)} variant="outlined">Delete Task </Button> : null;

    var value = this.state.taskType === "Single Choice" ? "Multiple Choice" : this.state.taskType;

    return(
      <div className="taskComponentContainer">
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

            <div className="editTaskContent">
              {instructionTypeContent}
              {questionTypeContent}
              {imageTypeContent}
              {comparisonContent}
            </div>

            <div className="editTaskFormButtons">
              <Button onClick={this.closeTaskComponent.bind(this, false)} variant="outlined">
                Close
              </Button>
              {deleteTaskBtn}
              <Button onClick={this.onChangeTaskSettings.bind(this)} variant="outlined">
                {this.props.isEditing ? "Save" : "Create"}
              </Button>
            </div>
        </form>
        <Snackbar
          style = {{bottom: 200}}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.snackbarOpen}
          onClose={this.handleCloseSnackbar.bind(this)}
          autoHideDuration={4000}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<div style={{width: '100%', height: '100%'}} id="message-id">{this.state.snackbarMessage}</div>}
        />
      </div>
    );
  }
}

export default EditTaskComponent;
