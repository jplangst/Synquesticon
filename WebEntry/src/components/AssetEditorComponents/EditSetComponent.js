import React, { Component } from 'react';

import * as dbFunctions from '../../core/db_helper';
import * as dbObjects from '../../core/db_objects';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import EditSetListComponent from '../TaskList/EditSetListComponent';

import update from 'immutability-helper'

import './EditSetComponent.css';

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

  //Returns true if adding the task will result in a circular reference
  willCauseCircularReference(task){
    //We only need to check if the task we are adding is a TaskSet
    if(task.objType === "TaskSet"){
      //Try to get the data contained in the task set we are trying to add as we need this information to check for a circular reference
      var query = {id: task._id, objType: task.objType};
      var queryList = [];
      queryList.push(query);
      dbFunctions.getTasksOrTaskSetsWithIDsPromise(queryList).then(result =>{
        //If the query was successful
        if(result){
          //Extract the child set ids of the set we are trying to add as well as the set id
          var addingTaskChildSets = this.getChildSetIDs(result[0],[result[0]._id]);

          //Check that we are not adding a set containing the set we are editing now
          if(addingTaskChildSets.includes(this.set._id)){
            //If we are it would cause a circular reference
            this.handleAddTaskAllowed(false, task);
            return;
          }

          //Get the task set list that is currently being edited
          var outerList = this.state.taskListObjects;

          //Iterate over the task set being edited and examine all child sets
          for(var i = 0; i < outerList.legnth; i++){
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
      console.log("Can't add set to itself. It would result in a circular reference");
    }
    //perform a deeper check for circular references. This will in turn add the task if it is ok to do so.
    this.willCauseCircularReference(task);
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
      //TODO give a toast warning that this would result in an infinite experiment
      console.log("Not allowed to add task!");
    }
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
            < EditSetListComponent removeCallback={this.removeTaskFromListCallback} taskListObjects={this.state.taskListObjects} reactDND={true}
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
