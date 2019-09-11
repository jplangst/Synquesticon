import React, { Component } from 'react';

import db_helper from '../../core/db_helper';


import * as dbObjects from '../../core/db_objects';

import shuffle from '../../core/shuffle';
import store from '../../core/store';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Snackbar from '@material-ui/core/Snackbar';

import EditSetListComponent from '../TaskList/EditSetListComponent';
import { Typography } from '@material-ui/core';

import update from 'immutability-helper'

import './EditSetComponent.css';

class EditSetComponent extends Component {
  constructor(props){
    super(props);

    //If we got a taskObject passed as a prop we use it, otherwise we init with a default constructed object
    //Clone the array via JSON. Otherwise we would operate directly on the original objects which we do not want
    this.set = this.props.isEditing ? JSON.parse(JSON.stringify(this.props.setObject)) : new dbObjects.TaskSetObject();
    if (this.set.repeatSetThreshold === undefined) {
      this.set.repeatSetThreshold = 0;
    }

    //We keep these fields in the state as they affect how the component is rendered
    this.state = {
      taskList: this.set.childIds ? this.set.childIds : [],
      taskListObjects: [],
      randomizeSet: this.set.setTaskOrder === "Random" ? true : false,
      displayOnePage: this.set.displayOnePage,
      logOneLine: this.set.logOneLine,
      snackbarOpen: false,
    };

    this.removeTaskFromListCallback = this.removeTask.bind(this);
    this.moveTaskCallback = this.moveTask.bind(this);

    this.responseHandler = this.onResponsesChanged;
    this.handleDBCallback = this.onDBCallback.bind(this);
    this.handleRetrieveSetChildTasks = this.onRetrievedSetChildTasks.bind(this);

    this.handleSetTaskOrderChange = this.onSetTaskOrderChanged.bind(this);
    this.handleDisplayOnePageChange = this.onDisplayOnePageChanged.bind(this);
    this.handleLogOneLineChange = this.onLogOneLineChanged.bind(this);

    this.refreshSetChildList();
  }

  onRetrievedSetChildTasks(retrievedObjects){
    this.setState({taskListObjects: retrievedObjects.data});
  }

  onDBCallback(setDBID){
    //TODO close and reopen as editing instead. Highlight the set in the left menu
    this.closeSetComponent(true);
  }

  onChangeSetSettings(){
    if(this.props.isEditing){
      db_helper.updateTaskSetFromDb(this.set._id, this.set, this.handleDBCallback);
    }
    else{
      db_helper.addTaskSetToDb(this.set, this.handleDBCallback);
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

    if(target==="Tags"){
      this.set.tags = response;
    }
    else if(target==="Repeat"){
      response = response[0].replace(/\D/g,'');
      response = response === "" ? "0" : response;
      this.set.repeatSetThreshold = parseInt(response);
    }
  }

  //Callback from checkbox pressed
  onSetTaskOrderChanged(e, checked){
    this.set.setTaskOrder = checked ? "Random" : "InOrder";
    this.setState({
      randomizeSet: checked
    });
  }
  onDisplayOnePageChanged(e, checked){
    this.set.displayOnePage = checked;
    this.setState({
      displayOnePage: checked
    });
  }
  onLogOneLineChanged(e, checked){
    this.set.logOneLine = checked;
    this.setState({
      logOneLine: checked
    });
  }

  onPlaySet() {
    var runThisTaskSet = this.state.taskListObjects.slice();
    if (this.state.randomizeSet === "Random") {
      runThisTaskSet = shuffle(runThisTaskSet);
    }
    var testingSet = this.set;
    testingSet.data = runThisTaskSet;

    var action = {
      type: 'SET_EXPERIMENT_INFO',
      experimentInfo: {
        experimentId: "",
        participantLabel: "",
        startTimestamp: "",
        participantId: "TESTING",
        mainTaskSetId: this.set.name,
        taskSet: testingSet,
        taskSetCount: -1,
        selectedTaskSetObject: this.set,
        selectedTracker: ""
      }
    }

    store.dispatch(action);

    var layoutAction = {
      type: 'SET_SHOW_HEADER',
      showHeader: false
    }

    store.dispatch(layoutAction);

    this.props.runTestSet();
  }

  //Returns true if adding the task will result in a circular reference
  willCauseCircularReference(task){
    //We only need to check if the task we are adding is a TaskSet
    if(task.objType === "TaskSet"){
      //Try to get the data contained in the task set we are trying to add as we need this information to check for a circular reference
      var query = {id: task._id, objType: task.objType};
      var queryList = [];
      queryList.push(query);
      db_helper.getTasksOrTaskSetsWithIDsPromise(task).then(data =>{
        //If the query was successful
        if(data){
          //Extract the child set ids of the set we are trying to add as well as the set id
          var addingTaskChildSets = this.getChildSetIDs(data,[data._id]);

          //Check that we are not adding a set containing the set we are editing now
          if(addingTaskChildSets.includes(this.set._id)){
            //If we are it would cause a circular reference
            this.handleAddTaskAllowed(false, task);
            return;
          }

          //Get the task set list that is currently being edited
          var outerList = this.state.taskListObjects;

          //Iterate over the task set being edited and examine all child sets
          for(var i = 0; i < outerList.length; i++){ //was lentgh
            //Only need to check if it is a set
            if(outerList[i].objType === "TaskSet"){
              //Extract the child set ids of the set we are trying to add as well as the set id
              var taskSetChildrenSets = this.getChildSetIDs(outerList[i], []);

              //Check if the set we are adding already references any of these sets
              for(var z = 0; z < taskSetChildrenSets.length; z++){
                if(addingTaskChildSets.includes(taskSetChildrenSets[z])){
                  this.handleAddTaskAllowed(false, task);
                  return;
                }
              }
            }
          }
          //No circular reference detected
          this.handleAddTaskAllowed(true, task);
        }
        //Otherwise we do not add as we don't know if it will be ok
        else{
          console.log("Did not add, unable to query the database");
          this.handleAddTaskAllowed(false, task);
        }
      });
    }
    else{
      this.handleAddTaskAllowed(true, task);
    }
  }

  getChildSetIDs(setObject, childSets){
    //Add the object to the list
    childSets.push(setObject._id);

    //Iterate over the sets children
    for(var i = 0; i<setObject.data.length; i++){
      if(setObject.data[i].objType === "TaskSet"){
        this.getChildSetIDs(setObject.data[i], childSets)
      }
    }
    return childSets;
  }

  //Add a task to the list of tasks in the set
  addTask(task, objType){
    if(this.set._id === task._id){
      this.setState({
        snackbarOpen: true
      });
    }
    else{
      //perform a deeper check for circular references. This will in turn add the task if it is ok to do so.
      this.willCauseCircularReference(task);
    }
  }

  handleAddTaskAllowed(allowed, task){
    if(allowed){
      var newTasks = [];
      newTasks.push({id:task._id, objType:task.objType});
      var updatedTaskList = this.state.taskList.concat(newTasks);

      this.set.childIds = updatedTaskList;
      this.setState({taskList:updatedTaskList});
      this.refreshSetChildList();
    }
    else{
      this.setState({
        snackbarOpen: true
      });
    }
  }

  handleCloseSnackbar(event, reason) {
    this.setState({
      snackbarOpen: false
    });
  }

  //Remove a task from the list of tasks in the set
  removeTask(taskId){
    var newList = this.state.taskList;
    for( var i = 0; i < newList.length; i++){
      if ( newList[i].id === taskId) {
       newList.splice(i, 1);
       break;
      }
    }
    this.set.childIds = newList;

    this.setState({taskList:newList});
    this.refreshSetChildList();
  }

  moveTask(dragIndex, hoverIndex) {
    const dragTask = this.state.taskList[dragIndex];
    const taskObject = this.state.taskListObjects[dragIndex];

    //Update the state with the new positions of the tasks
    this.setState(update(this.state, {
      taskList: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragTask]
        ]
      },
      taskListObjects: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, taskObject]
        ]
      }
    }));

    this.set.childIds = this.state.taskList;
  }

  refreshSetChildList(){
    if(this.state.taskList && this.state.taskList.length > 0){
      db_helper.getTasksOrTaskSetsWithIDs(this.set, this.handleRetrieveSetChildTasks);
    }
    else{ //If the list is empty we clear the list in the state
      this.setState({taskListObjects: []});
    }
  }

  //Removes the selected set from the database
  removeSet() {
    //TODO Dialog prompt "Are you sure you want to delete "Set", it will also be removed from the data base...
    db_helper.deleteTaskSetFromDb(this.set._id, this.handleDBCallback);
  }

  //Calls the provided callback function that handles the closing of this component
  closeSetComponent(componentChanged){
    this.props.closeSetCallback(componentChanged);
  }

  /*
██████  ███████ ███    ██ ██████  ███████ ██████
██   ██ ██      ████   ██ ██   ██ ██      ██   ██
██████  █████   ██ ██  ██ ██   ██ █████   ██████
██   ██ ██      ██  ██ ██ ██   ██ ██      ██   ██
██   ██ ███████ ██   ████ ██████  ███████ ██   ██
*/

  render() {
    var setContent =
      <div>
        <TextField id="questionText"
          required

          padding="dense"
          defaultValue={this.set.name}
          placeholder="Valve questions"
          label="Set Name"
          ref="setTextRef"
          fullWidth
          rows="1"
          onChange={(e)=>{this.set.name = e.target.value}}
        />
        <TextField id="tags"
          required

          padding="dense"
          defaultValue={this.set.tags.join(',')}
          placeholder="SillyWalks, Swallows"
          helperText="Tags seperated by a comma"
          label="Tags"
          fullWidth
          ref="tagsRef"
          onChange={(e)=> this.responseHandler(e, e.target.value, "Tags")}
        />
        <TextField id="repeatSet"

          padding="dense"
          defaultValue={this.set.repeatSetThreshold}
          placeholder="0"
          fullWidth
          helperText="The amount of tasks that must be completed, otherwise the set repeats"
          label="Repeat Set Threshold"
          ref="repeatRef"
          onChange={(e)=> this.responseHandler(e, e.target.value, "Repeat")}
        />
        <FormControlLabel label="Randomize Set Order"
          value="start"
          checked={this.state.randomizeSet}
          control={<Checkbox color="secondary" />}
          onChange={this.handleSetTaskOrderChange}
          labelPlacement="end"
        />
        <FormControlLabel label="Display on one page"
          value="start"
          checked={this.state.displayOnePage}
          control={<Checkbox color="secondary" />}
          onChange={this.handleDisplayOnePageChange}
          labelPlacement="end"
        />
        <FormControlLabel label="Log on one line"
          value="start"
          checked={this.state.logOneLine}
          control={<Checkbox color="secondary" />}
          onChange={this.handleLogOneLineChange}
          labelPlacement="end"
        />
      </div>;

    var deleteTaskBtn = null;
    var playTaskBtn = null;
    if(this.props.isEditing){
      deleteTaskBtn = <Button onClick={this.removeSet.bind(this)} variant="outlined">
        Delete Set
        </Button>;
      playTaskBtn = <Button onClick={this.onPlaySet.bind(this)} variant="outlined">
        Play
        </Button>;
    }

    return(
      <div className="setComponentContainer">
        <div className="setFormContainer">
          <form className="setFormRoot" autoComplete="off" id="formRootId">
              {setContent}
          </form>
        </div>

        <div className="setTaskListContainer">
          <div className="setTaskListTitle"><div className="setTaskListTitleText"><Typography color="textPrimary">Set Tasks</Typography></div></div>
          <div className="setTaskListViewer">
            < EditSetListComponent removeCallback={this.removeTaskFromListCallback} taskListObjects={this.state.taskListObjects} reactDND={true}
              removeTaskCallback={this.removeTaskFromListCallback} moveTaskCallback={this.moveTaskCallback} / >
          </div>
        </div>

        <div className="editSetComponentButtons">
          <Button onClick={this.closeSetComponent.bind(this, false)} variant="outlined">
            Cancel
          </Button>
          {deleteTaskBtn}
          <Button onClick={this.onChangeSetSettings.bind(this)} variant="outlined">
            {this.props.isEditing ? "Save" : "Create"}
          </Button>
          {playTaskBtn}
        </div>

        <Snackbar
        style = {{bottom: 120}}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={this.state.snackbarOpen}
        onClose={this.handleCloseSnackbar.bind(this)}
        autoHideDuration={2000}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">Illegal Action: Adding set would cause a circular reference!</span>}
      />
      </div>
    );
  }
}

export default EditSetComponent;
