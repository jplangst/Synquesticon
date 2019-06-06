import React, {Component} from 'react';

import CollapsableContainer from '../components/Containers/CollapsableContainer';
import CustomDragLayer from '../components/Containers/CustomDragLayer';

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
    this.setState({taskList: dbQueryResult});
  }

  dbTaskSetCallbackFunction(dbQueryResult) {
    this.setState({taskSetList: dbQueryResult});
  }

  onDatabaseSearched(queryTasks, result){
    if(queryTasks){
      this.setState({taskList: result.tasks});
    }
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
    this.editSetComponentRef = React.createRef();
    this.setState({selectedTask: null, selectedTaskSet:taskSet, assetEditorObject: <EditSetComponent isEditing={true}
      setObject={taskSet} closeSetCallback={this.assetEditorObjectClosed.bind(this)}
      key={this.assetEditorCompKey} ref={this.editSetComponentRef}/>});
  }

  //Callback from the asset editor object if an object has been changed that requires a refresh of the page
  assetEditorObjectClosed(dbChanged, editedObject){
    this.clearAssetEditorObject();

    if(dbChanged){
      dbFunctions.getAllTasksFromDb(this.dbTaskCallback);
      dbFunctions.getAllTaskSetsFromDb(this.dbTaskSetCallback);
    }
  }

  //Closes the current objecy being viewed in the asset editor view
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
    this.editSetComponentRef = React.createRef();
    this.setState({assetEditorObject: <EditSetComponent isEditing={false}
      closeSetCallback={this.assetEditorObjectClosed.bind(this)}
      key={this.assetEditorCompKey} ref={this.editSetComponentRef}/>});
  }

  filterTasksCallback(){

  }

  filterSetsCallback(){

  }

  //Called after a dragable item has been dropped into the task list in the asset editor
  onDragDropCallback(dragableItem, itemType){
    this.editSetComponentRef.current.addTask(dragableItem, itemType);
  }

  //Get the current asset editorObject
  getAssetEditorObject(){
    var assetEditorObject =
    <div className = "AssetEditor">
      <div className="AssetEditorTitle">Asset editor</div>
      <div className="AssetEditorContent">
        {this.state.assetEditorObject}
      </div>
    </div>;

    return assetEditorObject;
  }

  render() {
    var collapsableTaskHeaderButtons =
    <div className="collapsableHeaderBtnsContainer">
      <div className="searchWrapperDiv"><SearchBar onChange={this.taskSearchCallback} searchID="taskSearch"/></div>
      <div className="collapsableBtns">
        <Button style={{width: '50%', height: '100%', minWidth: '30px', minHeight: '30px'}}
        className="collapsableHeaderBtns" size="small" onClick={this.addTaskCallback.bind(this)} >
          <AddCircleOutline fontSize="large" className="addItemsIcon" />
        </Button>
        <Button style={{width: '50%', height: '100%', minWidth: '30px', minHeight: '30px'}}
        className="collapsableHeaderBtns" size="small" onClick={this.filterTasksCallback.bind(this)} >
          <FilterList fontSize="large" className="addItemsIcon" />
        </Button>
      </div>
    </div>;

    var collapsableSetHeaderButtons =
    <div className="collapsableHeaderBtnsContainer">
      <div className="searchWrapperDiv"><SearchBar onChange={this.taskSetSearchCallback} searchID="taskSetSearch"/></div>
      <div className="collapsableBtns">
        <Button style={{width: '50%', height: '100%', minWidth: '30px', minHeight: '30px'}}
        className="collapsableHeaderBtns" size="small" onClick={this.addSetCallback.bind(this)} >
          <AddCircleOutline fontSize="large" className="addItemsIcon" />
        </Button>
        <Button style={{width: '50%', height: '100%', minWidth: '30px', minHeight: '30px'}}
        className="collapsableHeaderBtns" size="small" onClick={this.filterSetsCallback.bind(this)} >
          <FilterList fontSize="large" className="addItemsIcon" />
        </Button>
      </div>
    </div>;

    return (
    <div className = "Background">
      <CustomDragLayer />
      <div className = "AssetViewer">
        <div className="AssetViewerTitle"><div className="AssetViewerTitleText">Asset viewer</div></div>
        <div className="AssetViewerContent">
          <CollapsableContainer classNames="ContainerSeperator" style={{height: "5%"}} headerTitle="Tasks"
          headerComponents={collapsableTaskHeaderButtons} hideHeaderComponents={true} open={true}>
              < TaskListComponent reorderDisabled={true} placeholderName="TaskPlaceholder" reorderID="tasksReorder" taskList={ this.state.taskList }
                selectTask={ this.selectTask.bind(this) } selectedTask={this.state.selectedTask} dragDropCallback={this.onDragDropCallback.bind(this)}
                reactDND={false} itemType="Task"/ >
          </CollapsableContainer>
          <CollapsableContainer classNames="ContainerSeperator" headerTitle="Sets"
          headerComponents={collapsableSetHeaderButtons} hideHeaderComponents={true}
          open={true}>
              < TaskListComponent selectedTask={this.state.selectedTaskSet} reorderDisabled={false} placeholderName="TaskSetPlaceholder" reorderID="taskSetsReorder"
                taskList={ this.state.taskSetList } selectTask={ this.selectTaskSet.bind(this) } dragDropCallback={this.onDragDropCallback.bind(this)}
                reactDND={false} itemType="TaskSet"/ >
          </CollapsableContainer>
          <CollapsableContainer classNames="ContainerSeperator TaskSetContainer" headerTitle="Images">
          </CollapsableContainer>
          <CollapsableContainer classNames="ContainerSeperator TaskSetContainer" headerTitle="Templates">
          </CollapsableContainer>
        </div>
      </div>

      {this.getAssetEditorObject()}

    < /div>);
  }
}
export default CreatorMode;
