import React, {Component} from 'react';

import CollapsableContainer from '../components/Containers/CollapsableContainer';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import SearchBar from '../components/SearchBar';

import TaskListComponent from '../components/TaskList/TaskListComponent';

//Dialogs
import CreateTaskDialog from '../components/dialogs/CreateTaskDialog';
import CreateTaskSetDialog from '../components/dialogs/CreateTaskSetDialog';

//icons
import AddIcon from '@material-ui/icons/AddToQueue';

import {FilterList, AddCircleOutline, Search} from '@material-ui/icons';

import './CreatorMode.css';
import * as dbFunctions from '../core/db_helper.js';

import store from '../core/store';

class CreatorMode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
      taskList: [],
      taskSetList: [],
      allowRegex: false,
      showCreateTaskDialog: false,
      showCreateTaskSetDialog: false,
    };

    //Database callbacks
    this.dbTaskCallback = this.dbTaskCallbackFunction.bind(this);
    this.dbTaskSetCallback = this.dbTaskSetCallbackFunction.bind(this);
    this.dbQueryCallback = this.onDatabaseSearched.bind(this);

    //Search bar callbacks
    this.taskSearchCallback = this.onTaskSearchInputChanged.bind(this);
    this.taskSetSearchCallback = this.onTaskSetSearchInputChanged.bind(this);

    //Task dialog related
    this.closeTaskDialog = this.onCloseCreateTaskDialog.bind(this);
    this.closeTaskSetDialog = this.onCloseCreateTaskSetDialog.bind(this);

    this.gotoPage = this.gotoPageHandler.bind(this);
  }

  gotoPageHandler(e, route){
    this.props.history.push(route);
  }

  //---------------------------create task dialog-------------------------------
  onOpenCreateTaskDialog(e) {
    this.setState({
      showCreateTaskDialog: true
    });
  }

  onCloseCreateTaskDialog(questionID, changeRegistered) {
    this.setState({
      showCreateTaskDialog: false
    });

    if(changeRegistered){
      dbFunctions.getAllTasksFromDb(this.dbTaskCallback);
    }
  }

  //---------------------------create task set dialog-------------------------------
  onOpenCreateTaskSetDialog(e) {
    this.setState({
      showCreateTaskSetDialog: true
    });
  }

  onCloseCreateTaskSetDialog(questionID, changeRegistered) {
    this.setState({
      showCreateTaskSetDialog: false
    });

    if(changeRegistered){
      dbFunctions.getAllTaskSetsFromDb(this.dbTaskSetCallback);
    }
  }

  //---------------------------component functions------------------------------
  componentWillMount() {
    this.testDatabase();
  }

  dbTaskCallbackFunction(dbQueryResult) {
    console.log(dbQueryResult);
    this.setState({taskList: dbQueryResult});
  }

  dbTaskSetCallbackFunction(dbQueryResult) {
    console.log(dbQueryResult);
    this.setState({taskSetList: dbQueryResult});
  }

  onDatabaseSearched(queryTasks, result){
    if(queryTasks){
      this.setState({taskList: result.tasks});
    }
    console.log(queryTasks);
    console.log(result);
  }

  testDatabase() {
    dbFunctions.getAllTasksFromDb(this.dbTaskCallback);
    dbFunctions.getAllTaskSetsFromDb(this.dbTaskSetCallback);
  }

  //actions callbacks
  onAddAOIs(task, AOIs) {
    console.log("edit AOIs", task, AOIs);
    task.aois = AOIs;
    //this.updateDB(task);
  }

  onAddResponse(task, response) {
    task.response = response;
    //this.updateDB(task);
  }

  selectTask(task) {
    console.log("selectTask_Hoa", task);
    this.setState({selectedTask: task, editing: true});
  }

  selectTaskSet(taskSet) {
    console.log("selectTaskSet_Hoa", taskSet);
    this.setState({selectedTaskSet: taskSet, editing: true});
  }

  removeTask(task) {
    console.log("deleteTask", task);
    dbFunctions.deleteTaskFromDb(task._id);
  }

  removeTaskSet(taskSet) {
    console.log("deleteTaskSet", taskSet);
    dbFunctions.deleteTaskSetFromDb(taskSet._id);
  }

  //Adds escape characters in fornt of all common regex symbols
  escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  onTaskSearchInputChanged(e){
    var searchString = "";
    if(typeof(e)==='object'){
      searchString = e.target.value;
      if(!this.state.allowRegex){
        searchString = this.escapeRegExp(searchString);
      }
    }

    dbFunctions.queryTasksFromDb(true, searchString, this.dbQueryCallback);
  }
  onTaskSetSearchInputChanged(e){
    var searchString = "";
    if(typeof(e)==='object'){
      searchString = this.escapeRegExp(e.target.value);

      if(!this.state.allowRegex){
        searchString = this.escapeRegExp(searchString);
      }
    }

    dbFunctions.queryTasksFromDb(false, searchString, this.dbQueryCallback);
  }

  addTaskCallback(){

  }

  searchTasksCallback(){

  }

  filterTasksCallback(){

  }

  addSetCallback(){

  }

  searchSetsCallback(){

  }

  filterSetsCallback(){

  }

  render() {
    var collapsableTaskHeaderButtons =
    <div className="collapsableHeaderBtnsContainer">
      <Button className="collapsableHeaderBtns" size="small" onClick={this.addTaskCallback.bind(this)} >
        <AddCircleOutline fontSize="medium" className="addItemsIcon" />
      </Button>
      <Button className="collapsableHeaderBtns" size="small" onClick={this.searchTasksCallback.bind(this)} >
        <Search fontSize="medium" className="addItemsIcon" />
      </Button>
      <Button className="collapsableHeaderBtns" size="small" onClick={this.filterTasksCallback.bind(this)} >
        <FilterList fontSize="medium" className="addItemsIcon" />
      </Button>
    </div>;

    var collapsableSetHeaderButtons =
    <div className="collapsableHeaderBtnsContainer">
      <Button className="collapsableHeaderBtns" size="small" onClick={this.addSetCallback.bind(this)} >
        <AddCircleOutline fontSize="medium" className="addItemsIcon" />
      </Button>
      <Button className="collapsableHeaderBtns" size="small" onClick={this.searchSetsCallback.bind(this)} >
        <Search fontSize="medium" className="addItemsIcon" />
      </Button>
      <Button className="collapsableHeaderBtns" size="small" onClick={this.filterSetsCallback.bind(this)} >
        <FilterList fontSize="medium" className="addItemsIcon" />
      </Button>
    </div>;

    return (
    <div className = "Background">
      <div className = "AssetViewer">
        <div className="AssetViewerTitle">Asset viewer</div>
        <CollapsableContainer classNames="ContainerSeperator" style={{height: "5%"}} headerTitle="Tasks" headerComponents={collapsableTaskHeaderButtons}>
          <div>
            <AppBar position = "static" >
              <Toolbar className="appBar">
                <IconButton className = "MenuButton" color = "inherit" aria-label = "Open drawer" >
                  <MenuIcon / >
                < /IconButton>
                < Typography className="TasksTitle" variant="h6" color="inherit" noWrap>
                  Tasks
                < /Typography >
                <SearchBar classes ={{search: "testSearch"}} onChange={this.taskSearchCallback} searchID="taskSearch"/>
                <Button onClick={this.onOpenCreateTaskDialog.bind(this)}>
                <AddIcon fontSize = "large" / >
              < /Button>
              <div className ="Grow"/ >
            < /Toolbar>
            < /AppBar >
            < TaskListComponent reorderDisabled={true} placeholderName="TaskPlaceholder" reorderID="tasksReorder" taskList={ this.state.taskList }
              selectTask={ this.selectTask.bind(this) } removeTask={this.removeTask.bind(this)}/ >
          < / div>
        </CollapsableContainer>

        <CollapsableContainer classNames="ContainerSeperator" headerTitle="Sets" headerComponents={collapsableSetHeaderButtons}>
        <div>
        <AppBar position = "static" >
          <Toolbar className="appBar">
            <IconButton className = "MenuButton" color = "inherit" aria-label = "Open drawer" >
              <MenuIcon / >
            < /IconButton>
            < Typography className="TasksTitle" variant="h6" color="inherit" noWrap>
              Task Sets
            < /Typography >
            <SearchBar onChange={this.taskSetSearchCallback} searchID="taskSetSearch"/>
            <Button onClick={this.onOpenCreateTaskSetDialog.bind(this)}>
              <AddIcon fontSize = "large" / >
            < /Button>
            <div className ="Grow"/ >
          < /Toolbar>
        < /AppBar >
        < TaskListComponent selectedTask={this.state.selectedTaskSet} reorderDisabled={false} placeholderName="TaskSetPlaceholder" reorderID="taskSetsReorder" taskList={ this.state.taskSetList } selectTask={ this.selectTaskSet.bind(this) } removeTask={this.removeTaskSet.bind(this)}/ >
        < /div >
        </CollapsableContainer>

        <CollapsableContainer classNames="ContainerSeperator TaskSetContainer" headerTitle="Images">
        </CollapsableContainer>

        <CollapsableContainer classNames="ContainerSeperator TaskSetContainer" headerTitle="Templates">
        </CollapsableContainer>
      </div>

      <div className = "AssetEditor">
        <div className="AssetEditorTitle">Asset editor</div>
        <div className="AssetEditorContent">
        </div>
      </div>



        <CreateTaskSetDialog openTaskSetDialog={this.state.showCreateTaskSetDialog} closeTaskSetDialog={this.closeTaskSetDialog} isEditing={false}/>
        <CreateTaskDialog openTaskDialog={this.state.showCreateTaskDialog} closeTaskDialog={this.closeTaskDialog} isEditing={false}/>
    < /div>);
  }
}
export default CreatorMode;
