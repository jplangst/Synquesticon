import React, { Component } from 'react';

import * as dbFunctions from '../../core/db_helper';
import * as dbObjects from '../../core/db_objects';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

//import FormControl from '@material-ui/core/FormControl';
//import FormLabel from '@material-ui/core/FormLabel';

import EditSetListComponent from '../TaskList/EditSetListComponent';

import update from 'immutability-helper'

import './EditSetComponent.css';

/*
id: String, //The id of the TaskSet
name: String, //The name for the TaskSet
tags: [String], //A list of searchable tags
taskIds: [String], //list of the task ids referenced by this set
counterbalancingOrder: [Number] //List of the order the tasks should be played
*/

class EditSetComponent extends Component {
  constructor(props){
    super(props);

    //If we got a taskObject passed as a prop we use it, otherwise we init with a default constructed object
    //Clone the array via JSON. Otherwise we would operate directly on the original objects which we do now want
    this.set = this.props.isEditing ? JSON.parse(JSON.stringify(this.props.setObject)) : new dbObjects.TaskSetObject();

    //We keep these fields in the state as they affect how the component is rendered
    this.state = {
      taskList: this.set.childIds ? this.set.childIds : [],
      taskListObjects: [],
      randomizeSet: this.set.setTaskOrder === "Random" ? true : false,
    };

    this.removeTaskFromListCallback = this.removeTask.bind(this);
    this.moveTaskCallback = this.moveTask.bind(this);

    this.responseHandler = this.onResponsesChanged;
    this.handleDBCallback = this.onDBCallback.bind(this);
    this.handleRetrieveSetChildTasks = this.onRetrievedSetChildTasks.bind(this);

    this.handleSetTaskOrderChange = this.onSetTaskOrderChanged.bind(this);

    this.refreshSetChildList();
  }

  onRetrievedSetChildTasks(retrievedObjects){
    console.log(retrievedObjects);
    this.setState({taskListObjects: retrievedObjects});
  }

  onDBCallback(setDBID){
    console.log("Set saved: ", setDBID);
    //TODO close and reopen as editing instead. Highlight the set in the left menu
    this.closeSetComponent(true);
  }

  onChangeSetSettings(){
    if(this.props.isEditing){
      dbFunctions.updateTaskSetFromDb(this.set._id, this.set, this.handleDBCallback);
    }
    else{
      dbFunctions.addTaskSetToDb(this.set, this.handleDBCallback);
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
  }

  onSetTaskOrderChanged(e, checked){
    this.set.setTaskOrder = checked ? "Random" : "InOrder";
    this.setState({
      randomizeSet: checked
    });
  }

  //Returns true if the list contains a circular reference
  willCauseCircularReference(taskID){
    var outerList = this.state.taskListObjects;
    //First we iterate over the most outer list
    for(var i = 0; i < outerList.length; i++){
      //If it is a set we need to get all the sets referenced by the set
      if(outerList[i].objType === "TaskSet")
      {
        var childSets = this.getChildSetIDs(outerList[i], []);
        if(childSets.length > 0 && childSets.includes(taskID)) {
          console.log("Circular dependency detected!");
          return true;
        }
      }
    }

    //No circular refeence detected
    return false;
  }

  getChildSetIDs(setObject, childSets){
    //Add the object to the list
    childSets.push(setObject._id);
    //Iterate over the sets children
    console.log(setObject);
    for(var i = 0; i<setObject.data.length; i++){
      if(setObject.data[i].objType === "TaskSet"){
        this.getChildIDs(setObject.data[i], childSets)
      }
    }
    return childSets;
  }

  //Add a task to the list of tasks in the set
  addTask(task, objType){
    if(this.set._id === task._id){
      console.log("Can't add set to itself. It would result in a circular reference");
      //TODO give a toast warning that this would result in an infinite experiment
      return true;
    }

    //if(objType==="Task" || !this.willCauseCircularReference(task._id)){
      var newTasks = [];
      newTasks.push({id:task._id, objType:objType});
      var updatedTaskList = this.state.taskList.concat(newTasks);

      this.set.childIds = updatedTaskList;
      this.setState({taskList:updatedTaskList});
      this.refreshSetChildList();
    //}
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

    //this.refreshSetChildList();
  }

  refreshSetChildList(){
    if(this.state.taskList && this.state.taskList.length > 0){
      //dbFunctions.getTaskSetObject(this.set._id, this.handleRetrieveSetChildTasks);
      dbFunctions.getTasksOrTaskSetsWithIDs(this.state.taskList, this.handleRetrieveSetChildTasks);
    }
    else{ //If the list is empty we clear the list in the state
      this.setState({taskListObjects: []});
    }
  }

  //Removes the selected set from the database
  removeSet() {
    //TODO Dialog prompt "Are you sure you want to delete "Set", it will also be removed from the data base...
    dbFunctions.deleteTaskSetFromDb(this.set._id, this.handleDBCallback);
  }

  //Calls the provided callback function that handles the closing of this component
  closeSetComponent(componentChanged){
    this.props.closeSetCallback(componentChanged);
  }

  render() {
    var setContent =
      <div>
        <TextField id="questionText"
          required
          autoFocus
          margin="dense"
          defaultValue={this.set.name}
          placeholder="Valve questions"
          label="Set Name"
          ref="setTextRef"
          fullWidth
          multiline
          rows="3"
          onChange={(e)=>{this.set.name = e.target.value}}
        />
        <TextField id="tags"
          required
          autoFocus
          margin="dense"
          defaultValue={this.set.tags.join(',')}
          placeholder="SillyWalks, Swallows"
          helperText="Tags seperated by a comma"
          label="Tags"
          fullWidth
          ref="tagsRef"
          onChange={(e)=> this.responseHandler(e, e.target.value, "Tags")}
        />
        <FormControlLabel label="Randomize Set Order"
          value="start"
          checked={this.state.randomizeSet}
          control={<Checkbox color="primary" />}
          onChange={this.handleSetTaskOrderChange}
          labelPlacement="start"
        />
      </div>;

    var deleteTaskBtn = null;
    if(this.props.isEditing){
      deleteTaskBtn = <Button onClick={this.removeSet.bind(this)} color="primary">
        Delete Set
        </Button>;
    }

    return(
      <div className="componentContainer">
        <div className="setFormContainer">
          <form className="setFormRoot" autoComplete="off" id="formRootId">
              {setContent}
          </form>
        </div>

        <div className="setTaskListContainer">
          <div className="setTaskListTitle"><div className="setTaskListTitleText"> Set Tasks </div></div>
          <div className="setTaskListViewer">
            < EditSetListComponent reorderDisabled={false} taskListObjects={ this.state.taskListObjects } reactDND={true}
              removeTaskCallback={this.removeTaskFromListCallback} moveTaskCallback={this.moveTaskCallback} / >
          </div>
        </div>

        <div className="editSetComponentButtons">
          <Button onClick={this.closeSetComponent.bind(this, false)} color="primary">
            Cancel
          </Button>
          {deleteTaskBtn}
          <Button onClick={this.onChangeSetSettings.bind(this)} color="primary">
            {this.props.isEditing ? "Edit" : "Create"}
          </Button>
        </div>
      </div>
    );
  }
}

export default EditSetComponent;
