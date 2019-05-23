import React, { Component } from 'react';

import * as dbFunctions from '../../core/db_helper';
import * as dbObjects from '../../core/db_objects';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import './CreateTaskDialog.css';

const taskTypeOptions = [
  'Instruction',
  'Question',
];

const responseTypeOptions = [
  'Free text',
  'Single Choice',
  'Numerical',
];

class CreateTaskDialog extends Component {
  constructor(props){
    super(props);

    //If we already have a type from props use it. Otherwise set default to Question
    this.state = {
      taskType: this.props.taskType ? this.props.taskType : "Question",
      responseType: this.props.responseType ? this.props.responseType : "Free text",
    };

    this.task = new dbObjects.TaskObject();
    this.task.aois = this.props.aois ? this.props.aois : [];
    this.responseHandler = this.onResponsesChanged;
    this.handleQuestionCallback = this.onDBCallback.bind(this);
  }



  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentWillMount() {

  }

  componentWillUnmount() {
  }

  onDBCallback(questionDBID){
    console.log("Question saved: ", questionDBID);
    this.props.closeTaskDialog(questionDBID, true);
  }

  onChangeTaskSettings(){
    this.task.taskType = this.state.taskType;
    this.task.responseType = this.state.responseType;

    if(this.props.isEditing){ //Need the question ID here, should pass as prop when editing
      //dbFunctions.addQuestionToDb(this.task, this.handleQuestionCallback);
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
      this.task.correctResponses = response;
    }

    console.log(response);
  }

  render() {
    var headerTitle = this.props.isEditing ? "Edit task" : "Create Task";

    var questionTypeContent = null;
    var questionResponseType = null;
    if(this.state.taskType === "Question"){
      questionTypeContent =
      <div>
        <TextField
          required
          autoFocus
          margin="dense"
          style={{width:"calc(96% + 10px)"}}
          id="questionText"
          defaultValue=""
          placeholder="What is your favorite colour? What is thy quest? What is the air speed velocity of a Swallow? What do you mean? Is it an African Swallow or a European Swallow?"
          label="Question"
          ref="questionTextRef"
          fullWidth
          multiline
          rows="3"
          onChange={(e)=>{this.task.question = e.target.value}}
        />

        <TextField
          required
          autoFocus
          margin="dense"
          style={{marginRight:"10px", width:"48%"}}
          id="responses"
          defaultValue=""
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
          defaultValue=""
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
          defaultValue=""
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
          defaultValue=""
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
          defaultValue=""
          placeholder="Screen A, Screen B"
          helperText="AOIs seperated by a comma"
          label="AOIs"
          ref="aoisTextRef"
          fullWidth
          onChange={(e)=> this.responseHandler(e, e.target.value, "AOIs")}
        />
        </div>;

        questionResponseType = <FormControl className="formControl">
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

    return(
      <Dialog
          open={this.props.openTaskDialog}
          onClose={this.props.closeTaskDialog}
          aria-labelledby="form-dialog-title"
          disableBackdropClick={true}
          disableEscapeKeyDown={true}
        >

          <DialogTitle id="form-dialog-title">{headerTitle}</DialogTitle>
          <DialogContent>

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
          </DialogContent>

          <DialogActions>
            <Button onClick={this.props.closeTaskDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.onChangeTaskSettings.bind(this)} color="primary">
              {this.props.isEditing ? "Edit" : "Create"}
            </Button>
          </DialogActions>
      </Dialog>
    );
  }
}

export default CreateTaskDialog;
