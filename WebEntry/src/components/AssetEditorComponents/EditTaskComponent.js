import React, { Component } from 'react';

import * as dbFunctions from '../../core/db_helper';
import * as dbObjects from '../../core/db_objects';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import './EditTaskComponent.css';

const taskTypeOptions = [
  'Instruction',
  'Question',
];

const responseTypeOptions = [
  'Free text',
  'Single Choice',
  'Numerical',
];

class EditTaskComponent extends Component {
  constructor(props){
    super(props);



    //If we already have a type from props use it. Otherwise set default to Question
    this.state = {
      taskType: this.props.taskType ? this.props.taskType : "Question",
      responseType: this.props.responseType ? this.props.responseType : "Free text",
      task: null,
    };

    this.responseHandler = this.onResponsesChanged;
    this.handleQuestionCallback = this.onDBCallback.bind(this);
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentWillMount() {
    this.setupComponent();
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(){
    this.setupComponent();


  }

  setupComponent(){
    console.log("RecieveProps");
    var task;
    if(this.props.isEditing){
      task = this.props.taskObject;
    }
    else{
      task = new dbObjects.TaskObject();
    }

    this.setState(
      {
        taskType: this.props.taskType ? this.props.taskType : "Question",
        responseType: this.props.responseType ? this.props.responseType : "Free text",
        task: task,
      }
    );
  }

  onDBCallback(questionDBID){
    console.log("Question saved: ", questionDBID);

    //this.props.closeTaskDialog(questionDBID, true);
    //TODO close and reopen as editing instead. Highlight the task in the left menu
    this.closeTaskComponent(true);
  }

  onChangeTaskSettings(){
    var task = this.state.task;
    task.taskType = this.state.taskType;
    task.responseType = this.state.responseType;
    this.setState({task: task});

    if(this.props.isEditing){
      dbFunctions.updateTaskFromDb(this.state.task._id, this.state.task, this.handleQuestionCallback);
    }
    else{
      console.log(this.state.task);
      dbFunctions.addTaskToDb(this.state.task, this.handleQuestionCallback);
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
    var task = this.state.task;
    if(target==="Responses"){
      task.responses = response;
    }
    else if(target==="Tags"){
      task.tags = response;
    }
    else if(target==="AOIs"){
      //this.task.aois = response;
      //TODO: implement interface for this functionality

      task.aois = [{
          name: "window1",
          boundingbox: [[0.07234043, 0.156989247], [0.07234043, 0.56774193], [0.440425545, 0.56774193], [0.440425545, 0.156989247]]
        },
        {
          name: "window2",
          boundingbox: [[0.6, 0.156989247], [0.6, 0.688172042], [0.976595759, 0.688172042], [0.976595759, 0.156989247]]
        },
        {
          name: "fish",
          boundingbox: [[0.385106385, 0.677419364], [0.385106385, 0.8731183], [0.568085134, 0.8731183], [0.568085134, 0.677419364]]
        }
      ];
    }
    else if(target==="Answers"){
      task.correctResponses = response;
    }
    this.setState({task: task});

    console.log(response);
  }

  removeTask() {
    console.log("deleteTask", this.state.task._id);
    dbFunctions.deleteTaskFromDb(this.state.task._id);

    //TODO Dialog prompt "Are you sure you want to delte "Task", it will also be removed from the data base...

    this.closeTaskComponent(true);
  }

  closeTaskComponent(componentChanged){
    //TODO check if anything changes, pass true if it did, otherwise pass false
    this.props.closeTaskCallback(componentChanged);
  }

  render() {
    var headerTitle = this.props.isEditing ? "Edit task" : "Create Task";

    var questionTypeContent = null;
    var questionResponseType = null;

    console.log(this.state.task);

    if(this.state.taskType === "Question"){
      questionTypeContent =
      <div>
        <TextField
          required
          autoFocus
          margin="dense"
          style={{width:"calc(96% + 10px)"}}
          id="questionText"
          defaultValue={this.state.task.question}
          placeholder="What is your favorite colour? What is thy quest? What is the air speed velocity of a Swallow? What do you mean? Is it an African Swallow or a European Swallow?"
          label="Question"
          ref="questionTextRef"
          fullWidth
          multiline
          rows="3"
          onChange={(e)=>{
            var task = this.state.task;
            task.question = e.target.value;
            this.setState({task: task});}}
        />

        <TextField
          required
          autoFocus
          margin="dense"
          style={{marginRight:"10px", width:"48%"}}
          id="responses"
          defaultValue={this.state.task.responses.join(',')}
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
          defaultValue={this.state.task.responseUnit}
          placeholder="%"
          helperText="The unit of the responses if they are numerical"
          label="Unit"
          ref="unitRef"
          onChange={(e)=> {
            var task = this.state.task;
            task.responseUnit = e.target.value;
            this.setState({task: task});}
          }
        />

        <TextField
          required
          autoFocus
          margin="dense"
          style={{marginRight:"10px", width:"48%"}}
          id="tags"
          defaultValue={this.state.task.correctResponses.join(',')}
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
          defaultValue={this.state.task.tags.join(',')}
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
          defaultValue={this.state.task.aois.join(',')}
          placeholder="Screen A, Screen B"
          helperText="AOIs seperated by a comma"
          label="AOIs"
          ref="aoisTextRef"
          fullWidth
          onChange={(e)=> this.responseHandler(e, e.target.value, "AOIs")}
        />
        </div>;

        questionResponseType =
        <FormControl className="formControl">
          <InputLabel htmlFor="ResponseType">Response Type</InputLabel>
          <Select
            value={this.state.responseType}
            onChange={this.handleChange}
            style={{width:"96%"}}
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
    }

    var instructionTypeContent = null;
    if(this.state.taskType === "Instruction"){

    }

    var removeCloseBtnCallback = this.props.isEditing ? this.removeTask : this.closeTaskComponent;
    var removeCloseBtnLabel = this.props.isEditing ? "Delete Task" : "Cancel";

    var deleteTaskBtn = null;
    if(this.props.isEditing){
      deleteTaskBtn = <Button onClick={this.removeTask.bind(this)} color="primary">
        Delete Task
        </Button>;
    }

    return(
      <div className="componentContainer">
        <form className="formRoot" autoComplete="off">
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

            {questionResponseType}
            {questionTypeContent}
            {instructionTypeContent}

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
