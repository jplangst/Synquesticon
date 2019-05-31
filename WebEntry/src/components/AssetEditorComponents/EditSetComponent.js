import React, { Component } from 'react';

import * as dbFunctions from '../../core/db_helper';
import * as dbObjects from '../../core/db_objects';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import TaskListComponent from '../TaskList/TaskListComponent';

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
    this.set = this.props.isEditing ? this.props.setObject : new dbObjects.TaskSetObject();

    //We keep these fields in the state as they affect how the component is rendered
    this.state = {
      taskList: [],
    };

    /*this.state = {
      showMenu: false,
      taskList: [],
      taskSetList: [],
      allowRegex: false,
      showCreateTaskDialog: false,
      showCreateTaskSetDialog: false,
      assetEditorContext: "empty",
      assetEditorObject: null,
    };*/

    console.log(this.state.taskList);

    this.responseHandler = this.onResponsesChanged;
    this.handleDBCallback = this.onDBCallback.bind(this);
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

  removeSet() {
    //TODO Dialog prompt "Are you sure you want to delete "Set", it will also be removed from the data base...
    dbFunctions.deleteTaskSetFromDb(this.state.task._id, this.handleDBCallback);
  }

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
        Delete Task
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
            < TaskListComponent reorderDisabled={false} placeholderName="TaskPlaceholder"
            reorderID="setsReorder" taskList={ this.state.taskList } reactDND={true}/ >
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
