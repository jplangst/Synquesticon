import React, {Component} from 'react';

import CollapsableContainer from '../components/Containers/CollapsableContainer';

import Button from '@material-ui/core/Button';

import SearchBar from '../components/SearchBar';

import TaskListComponent from '../components/TaskList/TaskListComponent';

//Asset Editor components
import EditTaskComponent from '../components/AssetEditorComponents/EditTaskComponent';
import EditSetComponent from '../components/AssetEditorComponents/EditSetComponent';

import {FilterList, AddCircleOutline} from '@material-ui/icons';

import './CreatorMode.css';
import * as dbFunctions from '../core/db_helper.js';

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
      assetEditorContext: "empty",
      assetEditorObject: null,
    };

    //Database callbacks
    this.dbTaskCallback = this.dbTaskCallbackFunction.bind(this);
    this.dbTaskSetCallback = this.dbTaskSetCallbackFunction.bind(this);
    this.dbQueryCallback = this.onDatabaseSearched.bind(this);

    //Search bar callbacks
    this.taskSearchCallback = this.onTaskSearchInputChanged.bind(this);
    this.taskSetSearchCallback = this.onTaskSetSearchInputChanged.bind(this);

    this.gotoPage = this.gotoPageHandler.bind(this);

    //Asset Editor Component Key. Used to force reconstruction...
    this.assetEditorCompKey = 0;
  }

  gotoPageHandler(e, route){
    this.props.history.push(route);
  }

  //---------------------------component functions------------------------------
  componentWillMount() {
    this.assetViewerQueryDatabase();
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

  assetViewerQueryDatabase() {
    dbFunctions.getAllTasksFromDb(this.dbTaskCallback);
    dbFunctions.getAllTaskSetsFromDb(this.dbTaskSetCallback);
  }

  //actions callbacks
  selectTask(task) {
    this.assetEditorCompKey += 1;
    var assetObject = <EditTaskComponent isEditing={true} taskObject={task}
      closeTaskCallback={this.assetEditorObjectClosed.bind(this)}
      key={this.assetEditorCompKey}
    />;

    this.setState(state => ({selectedTaskSet:null, selectedTask: task, assetEditorObject: assetObject}));
  }

  selectTaskSet(taskSet) {
    this.assetEditorCompKey += 1;
    this.setState({selectedTask: null, selectedTaskSet:taskSet, assetEditorObject: <EditSetComponent isEditing={true}
      setObject={taskSet} closeSetCallback={this.assetEditorObjectClosed.bind(this)}
      key={this.assetEditorCompKey}/>});
  }

  assetEditorObjectClosed(dbChanged, editedObject){
    this.clearAssetEditorObject();

    if(dbChanged){
      dbFunctions.getAllTasksFromDb(this.dbTaskCallback);
      dbFunctions.getAllTaskSetsFromDb(this.dbTaskSetCallback);
    }
  }

  clearAssetEditorObject(){
    this.setState({selectedTask: null, assetEditorContext: "empty", assetEditorObject: null, selectedTaskSet: null});
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
    this.assetEditorCompKey += 1;
    this.clearAssetEditorObject();
    this.setState({assetEditorObject: <EditTaskComponent isEditing={false}
      closeTaskCallback={this.assetEditorObjectClosed.bind(this)}
      key={this.assetEditorCompKey} />});
  }

  addSetCallback(){
    this.assetEditorCompKey += 1;
    this.clearAssetEditorObject();
    this.setState({assetEditorObject: <EditSetComponent isEditing={false}
      closeSetCallback={this.assetEditorObjectClosed.bind(this)}
      key={this.assetEditorCompKey} />});
  }

  filterTasksCallback(){

  }

  filterSetsCallback(){

  }

  startDragCallback(dragableItem){
    console.log("start drag");
  }

  render() {
    var collapsableTaskHeaderButtons =
    <div className="collapsableHeaderBtnsContainer">
      <SearchBar classes ={{search: "searchContainer"}} onChange={this.taskSearchCallback} searchID="taskSearch"/>
      <div className="collapsableBtns">
        <Button className="collapsableHeaderBtns" size="small" onClick={this.addTaskCallback.bind(this)} >
          <AddCircleOutline fontSize="large" className="addItemsIcon" />
        </Button>
        <Button className="collapsableHeaderBtns" size="small" onClick={this.filterTasksCallback.bind(this)} >
          <FilterList fontSize="large" className="addItemsIcon" />
        </Button>
      </div>
    </div>;

    var collapsableSetHeaderButtons =
    <div className="collapsableHeaderBtnsContainer">
      <SearchBar classes ={{search: "searchContainer"}} onChange={this.taskSetSearchCallback} searchID="taskSetSearch"/>
      <div className="collapsableBtns">
        <Button className="collapsableHeaderBtns" size="small" onClick={this.addSetCallback.bind(this)} >
          <AddCircleOutline fontSize="large" className="addItemsIcon" />
        </Button>
        <Button className="collapsableHeaderBtns" size="small" onClick={this.filterSetsCallback.bind(this)} >
          <FilterList fontSize="large" className="addItemsIcon" />
        </Button>
      </div>
    </div>;

    return (
    <div className = "Background">
      <div className = "AssetViewer">
        <div className="AssetViewerTitle">Asset viewer</div>
          <CollapsableContainer classNames="ContainerSeperator" style={{height: "5%"}} headerTitle="Tasks" headerComponents={collapsableTaskHeaderButtons}>
              < TaskListComponent reorderDisabled={true} placeholderName="TaskPlaceholder" reorderID="tasksReorder" taskList={ this.state.taskList }
                selectTask={ this.selectTask.bind(this) } selectedTask={this.state.selectedTask} startDragCallback={this.startDragCallback.bind(this)}/ >
          </CollapsableContainer>
          <CollapsableContainer classNames="ContainerSeperator" headerTitle="Sets" headerComponents={collapsableSetHeaderButtons}>
              < TaskListComponent selectedTask={this.state.selectedTaskSet} reorderDisabled={false} placeholderName="TaskSetPlaceholder" reorderID="taskSetsReorder"
                taskList={ this.state.taskSetList } selectTask={ this.selectTaskSet.bind(this) } startDragCallback={this.startDragCallback.bind(this)}/ >
          </CollapsableContainer>
          <CollapsableContainer classNames="ContainerSeperator TaskSetContainer" headerTitle="Images">
          </CollapsableContainer>
          <CollapsableContainer classNames="ContainerSeperator TaskSetContainer" headerTitle="Templates">
          </CollapsableContainer>
      </div>

      <div className = "AssetEditor">
        <div className="AssetEditorTitle">Asset editor</div>
        <div className="AssetEditorContent">
          {this.state.assetEditorObject}
        </div>
      </div>
    < /div>);
  }
}
export default CreatorMode;
