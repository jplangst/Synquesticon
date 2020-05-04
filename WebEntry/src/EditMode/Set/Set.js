import React, { Component } from 'react';

import db_helper from '../../core/db_helper';
import * as db_utils from '../../core/db_objects_utility_functions';
import * as dbObjects from '../../core/db_objects';

import store from '../../core/store';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import EditSetList from './SetList';

import { Droppable } from 'react-beautiful-dnd';

import './Set.css';

class EditSet extends Component {
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
      logOneLine: this.set.logOneLine,
    };

    this.removeTaskFromListCallback = this.removeTask.bind(this);
    this.moveTaskCallback = this.moveTask.bind(this);

    this.responseHandler = this.onResponsesChanged;
    this.handleDBCallback = this.onDBCallback.bind(this);
    this.handleRetrieveSetChildTasks = this.onRetrievedSetChildTasks.bind(this);
    this.handleUpdateSetChildTasks = this.onRetrievedSetChildTasksAddToSet.bind(this);

    this.handleSetTaskOrderChange = this.onSetTaskOrderChanged.bind(this);
    this.handleLogOneLineChange = this.onLogOneLineChanged.bind(this);

    //The index where a new task will be placed
    this.destinationIndex = 0;

    //Used to determine if the object should be closed
    this.shouldCloseAsset = false;
  }

  componentDidMount(){
    this.refreshSetChildList();
  }

  onRetrievedSetChildTasks(retrievedObjects){
    this.setState({taskListObjects: retrievedObjects.data});
  }

  refreshSetChildList(){
    if(this.state.taskList && this.state.taskList.length > 0){
      db_helper.getTasksOrTaskSetsWithIDs(this.set._id, this.handleRetrieveSetChildTasks);
    }
    else{ //If the list is empty we clear the list in the state
      this.setState({taskListObjects: []});
    }
  }

  onRetrievedSetChildTasksAddToSet(retrievedObject){
    //Clone the array since we can't mutate the state directly
    var updatedObjects = this.state.taskListObjects.slice();

    //Replace the dummy object with the actual object
    updatedObjects[this.destinationIndex] = retrievedObject;

    //Create a new task object for the taskList
    var newTask = {id:retrievedObject._id, objType:retrievedObject.objType}
    //Clone the array since we can't mutate the state directly
    var updatedTaskList = this.state.taskList.slice();

    //Replace the dummy object with the actual object
    updatedTaskList[this.destinationIndex] = newTask;

    this.setState({
      taskListObjects: updatedObjects,
      taskList: updatedTaskList
    });

    this.set.childIds = updatedTaskList;
  }

  updateSetChildList(taskToAdd){
    this.shouldCloseAsset = false;

    if (taskToAdd.objType === "TaskSet"){
      db_helper.getTasksOrTaskSetsWithIDs(taskToAdd._id, this.handleUpdateSetChildTasks);
    }
    else if(taskToAdd.objType === "Synquestitask"){
      db_helper.getTaskWithID(taskToAdd._id, this.handleUpdateSetChildTasks);
    }
  }

  onDBCallback(setDBID){
    if(this.shouldReopen){
      this.shouldReopen = false;
      var setEditSetAction = {
        type: 'SET_SHOULD_EDIT',
        shouldEdit: true,
        typeToEdit: 'set',
        objectToEdit:{...this.set,...{_id:setDBID}}
      };
      store.dispatch(setEditSetAction);
    }

    this.closeSetComponent(true, this.shouldCloseAsset);
  }

  onChangeSetSettings(){
    if(this.props.isEditing){
      this.shouldCloseAsset = false;
      db_helper.updateTaskSetFromDb(this.set._id, this.set, this.handleDBCallback);
      let snackbarAction = {
        type: 'TOAST_SNACKBAR_MESSAGE',
        snackbarOpen: true,
        snackbarMessage: "Set saved"
      };
      store.dispatch(snackbarAction);
    }
    else{
      this.shouldCloseAsset = true;
      this.shouldReopen = true;
      db_helper.addTaskSetToDb(this.set, this.handleDBCallback);
      let snackbarAction = {
        type: 'TOAST_SNACKBAR_MESSAGE',
        snackbarOpen: true,
        snackbarMessage: "Set created"
      };
      store.dispatch(snackbarAction);
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
    else if(target==="Repeat" && response[0]){
      response = response[0].replace(/\D/g,'');
      response = response === "" ? "0" : response;
      this.set.repeatSetThreshold = Number(response);
    }
  }

  //Callback from checkbox pressed
  onSetTaskOrderChanged(e, checked){
    this.set.setTaskOrder = checked ? "Random" : "InOrder";
    this.setState({
      randomizeSet: checked
    });
  }

  onLogOneLineChanged(e, checked){
    this.set.logOneLine = checked;
    this.setState({
      logOneLine: checked
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

      db_helper.getTasksOrTaskSetsWithIDsPromise(task).then(data =>{
        //If the query was successful
        if(data){
          //Extract the child set ids of the set we are trying to add as well as the set id
          var addingTaskChildSets = this.getChildSetIDs(data,[data._id]);

          //Check that we are not adding a set containing the set we are editing now
          if(addingTaskChildSets.includes(this.set._id)){
            //If we are it would cause a circular reference
            this.handleAddTaskAllowed(false, task, "The set you are trying to add already includes this set and would cause a circular reference");
            return;
          }

          //No circular reference detected
          var result_message = task.objType === "TaskSet" ? "Set successfully added" : "Task successfully added";
          this.handleAddTaskAllowed(true, task, result_message);
        }
        //Otherwise we do not add as we don't know if it will be ok
        else{
          this.handleAddTaskAllowed(false, task, "Unable to query the database, did not add " + task.objType === "TaskSet" ? "set" : "task");
        }
      });
    }
    else{
      this.handleAddTaskAllowed(true, task, "Task successfully added");
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
  addTask(task, destinationIndex){
    if(this.set._id === task._id){
      var snackbarAction = {
        type: 'TOAST_SNACKBAR_MESSAGE',
        snackbarOpen: true,
        snackbarMessage: "Cannot add the same set to itself"
      };
      store.dispatch(snackbarAction);
    }
    else{
      this.destinationIndex = destinationIndex;
      //perform a deeper check for circular references. This will in turn add the task if it is ok to do so.
      this.willCauseCircularReference(task);
    }
  }

  handleAddTaskAllowed(allowed, task, message){
    if(allowed){
      //Add a dummy object to the list while we wait for the callback
      var dummyObject = {_id:task._id, question:"Adding...", objType:"Task", taskType:"Image"}
      //Clone the array since we can't mutate the state directly
      var updatedObjects = this.state.taskListObjects.slice();
      //Insert the dummy at the index stored when add task was called
      updatedObjects.splice(this.destinationIndex, 0, dummyObject);

      //Create a dummy task object for the taskList
      var dummyTask = {id:task._id, objType:task.objType}
      //Clone the array since we can't mutate the state directly
      var updatedTaskList = this.state.taskList.slice();
      //Insert the dummy task at the index stored when add task was called
      updatedTaskList.splice(this.destinationIndex, 0, dummyTask);

      this.set.childIds = updatedTaskList;
      this.updateSetChildList(task);

      let snackbarAction = {
        type: 'TOAST_SNACKBAR_MESSAGE',
        snackbarOpen: true,
        snackbarMessage: message
      };
      store.dispatch(snackbarAction);

      this.setState({
        taskListObjects: updatedObjects,
        taskList: updatedTaskList,
      });
    }
    else{
      let snackbarAction = {
        type: 'TOAST_SNACKBAR_MESSAGE',
        snackbarOpen: true,
        snackbarMessage: message
      };
      store.dispatch(snackbarAction);
    }
  }

  //Remove a task from the list of tasks in the set
  removeTask(taskId){
    var newList = [...this.state.taskList];
    for( let i = 0; i < newList.length; i++){
      if ( newList[i].id === taskId) {
       newList.splice(i, 1);
       break;
      }
    }
    var newObjectList = [...this.state.taskListObjects];
    for( let i = 0; i < newObjectList.length; i++){
      if ( newObjectList[i]._id === taskId) {
       newObjectList.splice(i, 1);
       break;
      }
    }

    this.set.childIds = newList;

    var snackbarAction = {
      type: 'TOAST_SNACKBAR_MESSAGE',
      snackbarOpen: true,
      snackbarMessage: "Set removed"
    };
    store.dispatch(snackbarAction);

    this.setState({
      taskList:newList,
      taskListObjects: newObjectList,
    });
  }

  moveTask(dragIndex, hoverIndex) {
    var updatedTaskList = this.state.taskList.slice();
    db_utils.arrayMove(updatedTaskList, dragIndex, hoverIndex);
    //updatedTaskList.splice(dragIndex, 1, updatedTaskList.splice(hoverIndex, 1, updatedTaskList[dragIndex])[0]);
    var updatedObjectList = this.state.taskListObjects.slice();
    db_utils.arrayMove(updatedObjectList, dragIndex, hoverIndex);
    //updatedObjectList.splice(dragIndex, 1, updatedObjectList.splice(hoverIndex, 1, updatedObjectList[dragIndex])[0]);

    this.setState({
      taskListObjects: updatedObjectList,
      taskList: updatedTaskList
    });

    this.set.childIds = updatedTaskList;
  }

  //Removes the selected set from the database
  removeSet() {
    this.shouldCloseAsset = true;

    var snackbarAction = {
      type: 'TOAST_SNACKBAR_MESSAGE',
      snackbarOpen: true,
      snackbarMessage: "Set deleted"
    };
    store.dispatch(snackbarAction);

    db_helper.deleteTaskSetFromDb(this.set._id, this.handleDBCallback);
  }

  //Calls the provided callback function that handles the closing of this component
  closeSetComponent(componentChanged, overrideShouldClose){
    let shouldClose = overrideShouldClose ? overrideShouldClose : this.shouldCloseAsset;
    this.props.closeSetCallback(componentChanged, shouldClose);
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
          style={{width:'calc(50% - 10px)', marginRight:10}}
          rows="1"
          onChange={(e)=>{this.set.name = e.target.value}}
        />
        <TextField id="tags"
          required
          padding="dense"
          defaultValue={this.set.tags.join(',')}
          placeholder="Pump, Steam"
          label="Tags(comma-separated)"
          style={{width:'50%'}}
          ref="tagsRef"
          onChange={(e)=> this.responseHandler(e, e.target.value, "Tags")}
        />
      </div>;

    var deleteTaskBtn = null;
    if(this.props.isEditing){
      deleteTaskBtn = <Button onClick={this.removeSet.bind(this)} variant="outlined">
          Delete
        </Button>;
    }

    return(
      <div className="setComponentContainer">
        <form className="setFormRoot" autoComplete="off" id="formRootId">
            {setContent}
        </form>

        <div className="setTaskListContainer">
          <div className="setTaskListViewer">
            <Droppable droppableId="setTaskListId" >
             {(provided, snapshot) => (
              <div ref={provided.innerRef} style={{width:'100%', minHeight:'100%', height:'auto'}}>
                < EditSetList removeCallback={this.removeTaskFromListCallback} taskListObjects={this.state.taskListObjects} reactDND={true}
                  removeTaskCallback={this.removeTaskFromListCallback} moveTaskCallback={this.moveTaskCallback}
                  displayIfEmpty={"Drag tasks here"} / >
                  {provided.placeholder}
              </div>
            )}
            </Droppable>
          </div>
        </div>
        <div className="editSetComponentButtons">
          <Button onClick={this.onChangeSetSettings.bind(this)} variant="outlined">
            {this.props.isEditing ? "Save" : "Create"}
          </Button>
          {deleteTaskBtn}

          <FormControlLabel label="Randomize order"
            value="start"
            padding="dense"
            style={{marginLeft:10}}
            checked={this.state.randomizeSet}
            control={<Checkbox color="secondary" />}
            onChange={this.handleSetTaskOrderChange}
            labelPlacement="end"
          />
        </div>
      </div>
    );
  }
}

/*
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
*/

export default EditSet;
