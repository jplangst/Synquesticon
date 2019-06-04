import React, { Component } from 'react';

import * as dbFunctions from '../../core/db_helper';
import * as dbObjects from '../../core/db_objects';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import EditSetListComponent from '../TaskList/EditSetListComponent';

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
    };

    this.removeTaskFromListCallback = this.removeTask.bind(this);

    this.responseHandler = this.onResponsesChanged;
    this.handleDBCallback = this.onDBCallback.bind(this);
    this.handleRetrieveSetChildTasks = this.onRetrievedSetChildTasks.bind(this);

    if(this.state.taskList && this.state.taskList.length > 0){
      dbFunctions.getTasksOrTaskSetsWithIDs(this.state.taskList, this.handleRetrieveSetChildTasks);
    }
  }

  onRetrievedSetChildTasks(retrievedObjects){
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
      console.log(this.task);
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

    console.log(response);
  }

  //TODO extend to check for circular dependency
  //Returns true if the list already contains the specified id
  listContainsID(ID){
    //Check if we are trying to add the set to itself
    if(this.set._id === ID){
      return true;
    }

    //Check if we already have the item in the list
    for(var i = 0; i < this.state.taskList.length; i++){
      if(this.state.taskList[i].id === ID){
        return true;
      }
    }
    return false;
  }

  //Add a task to the list of tasks in the set
  addTask(task, taskType){
    //Check if we already have the item in the list, if we do we do nothing
    if(!this.listContainsID(task._id)){
      var newTasks = [];
      newTasks.push({id:task._id, objType:taskType});

      var updatedTaskList = this.state.taskList.concat(newTasks);
      this.set.childIds = updatedTaskList;

      this.setState({taskList:updatedTaskList});
    }
  }

  //Remove a task from the list of tasks in the set
  removeTask(taskId){
    var newList = this.state.taskList;
    for( var i = 0; i < newList.length; i++){
      if ( newList[i].id === taskId) {
       newList.splice(i, 1);
       return;
      }
    }
    this.set.childIds = newList;
    this.setState({taskList:newList});
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
        <TextField
          required
          autoFocus
          margin="dense"
          style={{width:"calc(96% + 10px)"}}
          id="questionText"
          defaultValue={this.set.name}
          placeholder="Valve questions"
          label="Set Name"
          ref="setTextRef"
          fullWidth
          multiline
          rows="3"
          onChange={(e)=>{this.set.name = e.target.value}}
        />

        <TextField
          required
          autoFocus
          margin="dense"
          style={{width:"48%"}}
          id="tags"
          defaultValue={this.set.tags.join(',')}
          placeholder="SillyWalks, Swallows"
          helperText="Tags seperated by a comma"
          label="Tags"
          ref="tagsRef"
          onChange={(e)=> this.responseHandler(e, e.target.value, "Tags")}
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
          <div className="setTaskListTitle">Set Tasks</div>
          <div className="setTaskListViewer">
            < EditSetListComponent reorderDisabled={false} taskList={ this.state.taskListObjects } reactDND={true}
              removeTaskCallback={this.removeTaskFromListCallback} / >
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
