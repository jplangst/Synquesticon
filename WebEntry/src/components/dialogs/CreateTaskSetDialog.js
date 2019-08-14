import React, { Component } from 'react';

import db_helper from '../../core/db_helper';
import * as dbObjects from '../../core/db_objects';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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

class CreateTaskSetDialog extends Component {
  constructor(props){
    super(props);

    //If we already have a type from props use it. Otherwise set default to Question
    this.state = {

    };

    this.taskSet = new dbObjects.TaskSetObject();
    this.responseHandler = this.onResponsesChanged;
    this.handleTaskSetCallback = this.onDBCallback.bind(this);
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentWillMount() {

  }

  componentWillUnmount() {
  }

  onDBCallback(taskSetDBID){
    console.log("Task set saved: ", taskSetDBID);
    this.props.closeTaskSetDialog(taskSetDBID, true);
  }

  onChangeTaskSettings(){
    if(this.props.isEditing){ //Need the question ID here, should pass as prop when editing
      //db_helper.addQuestionToDb(this.task, this.handleQuestionCallback);
    }
    else{
      db_helper.addTaskSetToDb(this.taskSet, this.handleTaskSetCallback);
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

    if(target==="Tasks"){
      this.taskSet.tasks = response;
    }
    else if(target==="Tags"){
      this.taskSet.tags = response;
    }

    console.log(response);
  }

  render() {
    var headerTitle = this.props.isEditing ? "Edit Task Set" : "Create Task Set";
    var dialogContent =
    <div>
      <TextField
        required
        autoFocus
        margin="dense"
        style={{width:"calc(96% + 10px)"}}
        id="taskSetnameText"
        defaultValue=""
        placeholder="Task set name"
        label="Name"
        ref="nameTextRef"
        fullWidth
        multiline
        rows="3"
        onChange={(e)=>{this.taskSet.name = e.target.value}}
      />
      <TextField
        required
        autoFocus
        margin="dense"
        style={{width:"48%"}}
        id="tags"
        defaultValue=""
        placeholder="Experiment, Valves"
        helperText="Tags seperated by a comma"
        label="Tags"
        ref="tagsRef"
        onChange={(e)=> this.responseHandler(e, e.target.value, "Tags")}
      />
      </div>;

    return(
      <Dialog
          open={this.props.openTaskSetDialog}
          onClose={this.props.closeTaskSetDialog}
          aria-labelledby="form-dialog-title"
          disableBackdropClick={true}
          disableEscapeKeyDown={true}
        >

          <DialogTitle id="form-dialog-title">{headerTitle}</DialogTitle>
          <DialogContent>
                {dialogContent}
          </DialogContent>

          <DialogActions>
            <Button onClick={this.props.closeTaskSetDialog} color="primary">
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

export default CreateTaskSetDialog;
