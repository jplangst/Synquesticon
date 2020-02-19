import React, {Component} from 'react';

import Button from '@material-ui/core/Button';
import {FilterList, AddCircleOutline} from '@material-ui/icons';

//The custom drag layer let's us define the appearance of dragged elements.
//Without this the default browser drag will be used, which looks bad in our case.
import CustomDragLayer from '../components/Containers/CustomDragLayer';
import SearchBar from '../components/SearchBar';
import CollapsableContainer from '../components/Containers/CollapsableContainer';
import TaskListComponent from '../components/TaskList/TaskListComponent';
import EditTaskComponent from '../components/AssetEditorComponents/EditTaskComponent';
import EditSetComponent from '../components/AssetEditorComponents/EditSetComponent';
import { withTheme } from '@material-ui/styles';

import { DragDropContext } from 'react-beautiful-dnd';
import * as dnd from '../core/beautifulDND.js';

import db_helper from '../core/db_helper.js';

import store from '../core/store';

import './EditorMode.css';

class EditorMode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
      taskList: [],
      taskSetList: [],
      allowRegex: true,
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

    let storeState = store.getState();
    if(storeState.shouldEditSet){
      var setEditSetAction = {
        type: 'SET_SHOULD_EDIT_SET',
        shouldEditSet: false,
        setToEdit:null
      };
      store.dispatch(setEditSetAction);
      this.selectTaskSet(storeState.setToEdit);
    }
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
    else{
      this.setState({taskSetList: result.tasks});
    }
  }

  assetViewerQueryDatabase() {
    db_helper.getAllTasksFromDb(this.dbTaskCallback);
    db_helper.getAllTaskSetsFromDb(this.dbTaskSetCallback);
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
      key={this.assetEditorCompKey} ref={this.editSetComponentRef}
      runTestSet={()=>{this.props.history.push('/DisplayTaskComponent')}}/>});
  }

  //Callback from the asset editor object if an object has been changed that requires a refresh of the page
  assetEditorObjectClosed(dbChanged, shouldCloseAsset){
    if(shouldCloseAsset){
      this.clearAssetEditorObject();
    }

    if(dbChanged){
      db_helper.getAllTasksFromDb(this.dbTaskCallback);
      db_helper.getAllTaskSetsFromDb(this.dbTaskSetCallback);
    }

    let storeState = store.getState();
    if(storeState.shouldEditSet){
      this.selectTaskSet(storeState.setToEdit);
      var setEditSetAction = {
        type: 'SET_SHOULD_EDIT_SET',
        shouldEditSet: false,
        setToEdit:null
      };
      store.dispatch(setEditSetAction);
    }
    else if(storeState.shouldEditTask){
      this.selectTask(storeState.taskToEdit);
      var taskEditSetAction = {
        type: 'SET_SHOULD_EDIT_TASK',
        shouldEditTask: false,
        taskToEdit:null
      };
      store.dispatch(taskEditSetAction);
    }
  }

  //Closes the current objecy being viewed in the asset editor view
  clearAssetEditorObject(){
    this.setState({selectedTask: null, assetEditorContext: "empty", assetEditorObject: null, selectedTaskSet: null});
  }

  removeTaskSet(taskSet) {
    db_helper.deleteTaskSetFromDb(taskSet._id);
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

      if(searchString.includes(",")){
        searchString = searchString.split(",");
        searchString = searchString.map((value)=>{
          return value.trim();
        });
        searchString = searchString.filter(Boolean); //Remove empty values

        if(searchString.length === 1){
          searchString = searchString[0];
        }
      }
    }

    db_helper.queryTasksFromDb(true, searchString, this.dbQueryCallback);
  }
  onTaskSetSearchInputChanged(e){
    var searchString = "";
    if(typeof(e)==='object'){
      searchString = e.target.value;

      if(!this.state.allowRegex){
        searchString = this.escapeRegExp(searchString);
      }

      if(searchString.includes(",")){
        searchString = searchString.split(",");
        searchString = searchString.map((value)=>{
          return value.trim();
        });
        searchString = searchString.filter(Boolean); //Remove empty values
      }
    }

    db_helper.queryTasksFromDb(false, searchString, this.dbQueryCallback);
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

  //On drag end callback
  onDragEnd = result => {
      const { source, destination } = result;

      // dropped outside the list
      if (!destination) {
          return;
      }

      //If the sourc eis the same as the destination we just move the element inside the list
      if (source.droppableId === destination.droppableId) {
          this.editSetComponentRef.current.moveTask(source.index,destination.index);
      } else { //Otherwise we add to the list at the desired location
          var itemType = source.droppableId ==="sets" ? "TaskSet" : "Task";
          var dragableItem = {objType:itemType,_id:result.draggableId};
          this.editSetComponentRef.current.addTask(dragableItem, destination.index);
      }
  };

  //Get the current asset editorObject
  getAssetEditorObject(){
    let theme = this.props.theme;
    let rightBG = theme.palette.type === "light" ? theme.palette.primary.main : theme.palette.primary.dark;

    var assetEditorObject =
    <div className="AssetEditor" style={{paddingLeft:5, backgroundColor:rightBG}}>
      <div className="AssetEditorContent">
        {this.state.assetEditorObject}
      </div>
    </div>;

    return assetEditorObject;
  }

  //
  getCollapsableHeaderButtons(searchCallback, addCallback, filterCallback, searchBarID){

    var filterButton = null;
    if(filterCallback !== null){
      filterButton = <Button style={{width: '100%', height: '100%'}}
      className="collapsableHeaderBtns" size="small" onClick={filterCallback} >
        <FilterList fontSize="large"/>
      </Button>;
    }

    var collapsableTaskHeaderButtons =
    <div className="collapsableHeaderBtnsContainer">
      <div className="searchWrapperDiv"><SearchBar onChange={searchCallback} searchID={searchBarID}/></div>
      <div className="collapsableBtns">
        <Button style={{position:"relative", width: '100%', height: '100%', minWidth:0, minHeight:0}} size="small" onClick={addCallback} >
          <AddCircleOutline fontSize="large"/>
        </Button>
        {filterButton}
      </div>
    </div>;

    //Currently filter is not implemented so we don't render it

    return collapsableTaskHeaderButtons;
  }

  /*
██████  ███████ ███    ██ ██████  ███████ ██████
██   ██ ██      ████   ██ ██   ██ ██      ██   ██
██████  █████   ██ ██  ██ ██   ██ █████   ██████
██   ██ ██      ██  ██ ██ ██   ██ ██      ██   ██
██   ██ ███████ ██   ████ ██████  ███████ ██   ██
*/

  render() {
    let theme = this.props.theme;
    let leftBG = theme.palette.type === "light" ? theme.palette.primary.dark : theme.palette.primary.main;

    var collapsableTaskHeaderButtons = this.getCollapsableHeaderButtons(this.taskSearchCallback, this.addTaskCallback.bind(this), null, "taskSearchBar");
    var collapsableSetHeaderButtons = this.getCollapsableHeaderButtons(this.taskSetSearchCallback, this.addSetCallback.bind(this), null, "setSearchBar");

    var dragEnabled = false;
    if(this.state.assetEditorObject && this.state.assetEditorObject.type === EditSetComponent){
      dragEnabled = true;
    }

    return (
    <DragDropContext onDragEnd={this.onDragEnd}>
      <div className = "editorScreenContainer">

        <div style={{backgroundColor:leftBG}} className = "AssetViewer">
          <div className="AssetViewerContent">
            <CollapsableContainer headerTitle="Tasks" useMediaQuery={true}
            headerComponents={collapsableTaskHeaderButtons} hideHeaderComponents={true} open={true}>
                < TaskListComponent dragEnabled={dragEnabled} taskList={ this.state.taskList }
                  selectTask={ this.selectTask.bind(this) } selectedTask={this.state.selectedTask}
                  itemType="Task" droppableId="tasks"/ >
            </CollapsableContainer>

            <CollapsableContainer headerTitle="Sets" useMediaQuery={true}
            headerComponents={collapsableSetHeaderButtons} hideHeaderComponents={true}
            open={true}>
                < TaskListComponent dragEnabled={dragEnabled} selectedTask={this.state.selectedTaskSet}
                  taskList={ this.state.taskSetList } selectTask={ this.selectTaskSet.bind(this) }
                  itemType="TaskSet" droppableId="sets"/ >
            </CollapsableContainer>

          </div>
        </div>

        {this.getAssetEditorObject()}

      < /div>
    </DragDropContext>
    );
  }
}

export default withTheme(EditorMode);
