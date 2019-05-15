import React, {Component} from 'react';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import SearchBar from '../components/SearchBar';

import TaskListComponent from '../components/TaskListComponent';

//Dialogs
import CreateTaskDialog from '../components/dialogs/CreateTaskDialog';

//icons
import AddIcon from '@material-ui/icons/AddToQueue';
import NavigationIcon from '@material-ui/icons/NavigateNextTwoTone';

import './TaskSetCreation.css';
import * as dbFunctions from '../core/db_helper.js';

import store from '../core/store';

class TaskSetCreation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
      taskList: [],
      allowRegex: false,
      showCreateTaskDialog: false,
    };

    //Database callbacks
    this.dbCallback = this.dbCallbackFunction.bind(this);
    this.dbQueryCallback = this.onDatabaseSearched.bind(this);

    //Search bar callbacks
    this.taskSearchCallback = this.onTaskSearchInputChanged.bind(this);
    this.taskSetSearchCallback = this.onTaskSetSearchInputChanged.bind(this);

    //Task dialog related
    this.closeTaskDialog = this.onCloseCreateTaskDialog.bind(this);

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
      dbFunctions.getAllQuestionsFromDb(this.dbCallback);
    }
  }

  //---------------------------component functions------------------------------
  componentWillMount() {
    this.testDatabase();
  }

  dbCallbackFunction(dbQueryResult) {
    console.log(dbQueryResult);
    this.setState({taskList: dbQueryResult});
  }

  onDatabaseSearched(queryTasks, result){
    if(queryTasks){
      this.setState({taskList: result.tasks});
    }
    console.log(queryTasks);
    console.log(result);
  }

  testDatabase() {
    dbFunctions.getAllQuestionsFromDb(this.dbCallback);
  }

  //actions callbacks
  onAddAOIs(task, AOIs) {
    console.log("edit AOIs", task, AOIs);
    task.aois = AOIs;
    this.updateDB(task);
  }

  onAddResponse(task, response) {
    task.response = response;
    this.updateDB(task);
  }

  selectTask(task) {
    console.log("selectTask_Hoa", task);
    this.setState({selectedTask: task, editing: true});
  }

  removeTask(task) {
    console.log("deleteTask", task);
    dbFunctions.deleteQuestionFromDb(task._id);
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

    dbFunctions.queryQuestionsFromDb(true, searchString, this.dbQueryCallback);
  }
  onTaskSetSearchInputChanged(e){
    var searchString = "";
    if(typeof(e)==='object'){
      searchString = this.escapeRegExp(e.target.value);

      if(!this.state.allowRegex){
        searchString = this.escapeRegExp(searchString);
      }
    }

    dbFunctions.queryQuestionsFromDb(false, searchString, this.dbQueryCallback);
  }

  //bottom button handler
  onPlayButtonClick() {
    var action = {
      type: 'SET_TASK_LIST',
      taskList: this.state.taskList
    }
    store.dispatch(action);
    this.props.history.push('/PlayScreen');
  }

  render() {
    return (< div className = "page" >
      <div className = "QuestionsList" >
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
        < TaskListComponent taskList={ this.state.taskList } selectTask={ this.selectTask.bind(this) } removeTask={this.removeTask.bind(this)}/ >
        <div className="playButtonWrapper">
          <Button variant="fab" onClick={this.onPlayButtonClick.bind(this)} className="playButton">
            <NavigationIcon fontSize="large"/>
          </Button>
        </div>
      < / div>

      <div className = "QuestionSetList" >
      <AppBar position = "static" >
        <Toolbar className="appBar">
          <IconButton className = "MenuButton" color = "inherit" aria-label = "Open drawer" >
            <MenuIcon / >
          < /IconButton>
          < Typography className="TasksTitle" variant="h6" color="inherit" noWrap>
            Task Sets
          < /Typography >
          <SearchBar onChange={this.taskSetSearchCallback} searchID="taskSetSearch"/>
          <Button >
            <AddIcon fontSize = "large" / >
          < /Button>
          <div className ="Grow"/ >
        < /Toolbar>
      < /AppBar >
      < /div >

      <CreateTaskDialog openTaskDialog={this.state.showCreateTaskDialog} closeTaskDialog={this.closeTaskDialog} isEditing={false}/>
    < /div>);
  }
}
export default TaskSetCreation;
