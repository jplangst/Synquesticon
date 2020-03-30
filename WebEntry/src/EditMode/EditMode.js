import React, {Component} from 'react';

import Button from '@material-ui/core/Button';
import {FilterList, AddCircleOutline} from '@material-ui/icons';

import FilterDialog from './FilterDialog';
import SearchBar from './SearchBar';
import CollapsableContainer from '../components/Containers/CollapsableContainer';
import TaskList from './List/TaskList';
import EditTask from './Task/Task';
import EditSet from './Set/Set';
import { withTheme } from '@material-ui/styles';

import { DragDropContext } from 'react-beautiful-dnd';

import db_helper from '../core/db_helper.js';
import * as db_objects from '../core/db_objects.js'

import store from '../core/store';

import './EditMode.css';

class EditMode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
      taskSetList: [],
      synquestitaskList: [],
      allowRegex: true,
      assetEditorContext: "empty",
      assetEditorObject: null,

      //Filter dialog states
      openFilterDialog: false,
      filterQueryType: db_objects.ObjectTypes.TASK,
      filterStateMap: this.initFilterMap()
    };

    //Database callbacks
    this.dbSynquestitaskCallback = this.dbSynquestitaskCallbackFunction.bind(this);
    this.dbTaskSetCallback = this.dbTaskSetCallbackFunction.bind(this);

    //Filter callback
    this.onFiltersChanged = this.filtersUpdated.bind(this);

    //Callback when querying the databaseusing the search fields
    this.dbQueryCallback = this.onDatabaseSearched.bind(this);

    this.gotoPage = this.gotoPageHandler.bind(this);

    //Asset Editor Component Key. Used to force reconstruction...
    this.assetEditorCompKey = 0;
    this.filterDialogKey = 0;

    this.assetViewerQueryDatabase();
  }

  gotoPageHandler(e, route){
    this.props.history.push(route);
  }

  initFilterMap(){
    let filterMap = new Map();

    let objectTypes = Object.values(db_objects.ObjectTypes);
    for(let i = 0; i < objectTypes.length; i++){
      filterMap.set(objectTypes[i],{
        tagFilters:[],
        searchStrings:[],
        queryCombination:"OR"
      });
    }

    return filterMap;
  }

  //---------------------------component functions------------------------------
  componentWillMount() {
    let storeState = store.getState();
    if(storeState.shouldEdit){

      var setEditSetAction = {
        type: 'SET_SHOULD_EDIT',
        shouldEdit: false,
        objectToEdit:null,
        typeToEdit:''
      };
      store.dispatch(setEditSetAction);
      this.selectTaskSet(storeState.objectToEdit);
    }
  }

  groupTasksByTags(tasks){
    let tagMap = new Map();
    for(let i = 0; i < tasks.length;i++){
      let task = tasks[i];

      //If the task contains tags we iterate over and add them with value to our map
      if(task.tags.length > 0){
        for(let y = 0; y < task.tags.length;y++){
          let tag = task.tags[y];
          if(tagMap.has(tag)){
            let newValue = tagMap.get(tag);
            newValue.push(task);
            tagMap.set(tag,newValue);
          }
          else{
            let objectList = [];
            objectList.push(task);
            tagMap.set(tag, objectList);
          }
        }
      } //Otherwise we add the task to the No Tag section
      else{
        let key = "No Tag";
        if(tagMap.has(key)){
          let newValue = tagMap.get(key);
          newValue.push(task);
          tagMap.set(key,newValue);
        }
        else{
          let objectList = [];
          objectList.push(task);
          tagMap.set(key, objectList);
        }
      }
    }
    return tagMap;
  }

  dbSynquestitaskCallbackFunction(dbQueryResult) {
    this.setState({synquestitaskList: dbQueryResult});
  }

  dbTaskCallbackFunction(dbQueryResult) {
    this.setState({taskList: dbQueryResult});
  }

  dbTaskSetCallbackFunction(dbQueryResult) {
    this.setState({taskSetList: dbQueryResult});
  }

  //Callback after querying the database using the search fields
  onDatabaseSearched(queryType, result){
    if(queryType === db_objects.ObjectTypes.SET){
      this.setState({taskSetList: result.tasks});
    }
    else if(queryType === db_objects.ObjectTypes.TASK){
      this.setState({synquestitaskList: result.tasks});
    }
  }

  assetViewerQueryDatabase() {
    db_helper.getAllTasksFromDb(this.dbSynquestitaskCallback);
    db_helper.getAllTaskSetsFromDb(this.dbTaskSetCallback);
  }

  selectSynquestitask(task) {
    this.assetEditorCompKey += 1;

    var assetObject = <EditTask isEditing={true} synquestitask={task}
      closeTaskCallback={this.assetEditorObjectClosed.bind(this)}
      key={this.assetEditorCompKey}
    />;

    this.setState(state => ({selectedTaskSet:null, selectedTask: null, selectedSynquestitask: task, assetEditorObject: assetObject}));
  }

  selectTaskSet(taskSet) {
    this.assetEditorCompKey += 1;
    this.editSetComponentRef = React.createRef();

    var assetObject = <EditSet isEditing={true}
      setObject={taskSet} closeSetCallback={this.assetEditorObjectClosed.bind(this)}
      key={this.assetEditorCompKey} ref={this.editSetComponentRef}
      runTestSet={()=>{this.props.history.push('/DisplayTaskComponent')}}/>;

    this.setState({selectedTask: null, selectedSynquestitask:null, selectedTaskSet:taskSet, assetEditorObject: assetObject});
  }

  //Callback from the asset editor object if an object has been changed that requires a refresh of the page
  assetEditorObjectClosed(dbChanged, shouldCloseAsset){
    if(shouldCloseAsset){
      this.clearAssetEditorObject();
    }

    if(dbChanged){
      db_helper.getAllTasksFromDb(this.dbSynquestitaskCallback);
      db_helper.getAllTaskSetsFromDb(this.dbTaskSetCallback);
    }

    let storeState = store.getState();
    if(storeState.shouldEdit){
      if(storeState.typeToEdit === 'set'){
        this.selectTaskSet(storeState.objectToEdit);
      }
      else if(storeState.typeToEdit === 'synquestitask'){
        this.selectSynquestitask(storeState.objectToEdit);
      }

      var setEditAction = {
        type: 'SET_SHOULD_EDIT',
        shouldEdit: false,
        typeToEdit: ''
      }
      store.dispatch(setEditAction);
    }
  }

  //Closes the current objecy being viewed in the asset editor view
  clearAssetEditorObject(){
    this.setState({assetEditorContext: "empty", assetEditorObject: null, selectedTaskSet: null, selectedSynquestitask:null});
  }

  removeTaskSet(taskSet) {
    db_helper.deleteTaskSetFromDb(taskSet._id);
  }

  //Adds escape characters in fornt of all common regex symbols
  escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  addSynquestitaskCallback(){
    this.assetEditorCompKey += 1;
    this.clearAssetEditorObject();
    this.setState({assetEditorObject: <EditTask isEditing={false}
      closeTaskCallback={this.assetEditorObjectClosed.bind(this)}
      key={this.assetEditorCompKey} />});
  }

  addSetCallback(){
    this.assetEditorCompKey += 1;
    this.clearAssetEditorObject();
    this.editSetComponentRef = React.createRef();
    this.setState({assetEditorObject: <EditSet isEditing={false}
      closeSetCallback={this.assetEditorObjectClosed.bind(this)}
      key={this.assetEditorCompKey} ref={this.editSetComponentRef}/>});
  }

  //On drag end callback
  onDragEnd = result => {
      const { source, destination } = result;

      // dropped outside the list
      if (!destination) {
          return;
      }

      //If the source is the same as the destination we just move the element inside the list
      if (source.droppableId === destination.droppableId) {
          this.editSetComponentRef.current.moveTask(source.index,destination.index);
      } else { //Otherwise we add to the list at the desired location
          var itemType;
          if(source.droppableId === "Sets"){
            itemType = "TaskSet";
          }
          else if(source.droppableId === "Tasks"){
            itemType = "Synquestitask";
          }
          else{
            console.log("Unknown type dragged");
            return;
          }

          let id = result.draggableId;
          if(id.includes('_')){
            id = result.draggableId.split('_')[0];
          }

          var dragableItem = {objType:itemType,_id:id};
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

  //Filter button callback, the type determines which collection we are filtering
  filterButtonPressed(type, e){

    this.filterDialogKey += 1;
    this.setState({
      openFilterDialog: true,
      filterQueryType: type
    });
  }

  //Callback when filters have been selected in the filters dialog
  filtersUpdated(type, filters, searchType){

    let updatedMap = new Map(this.state.filterStateMap);
    let updatedObject = updatedMap.get(type);
    updatedObject.tagFilters = filters;
    updatedObject.queryCombination = searchType;
    updatedMap.set(type,
      updatedObject
    );

    this.setState({
      openFilterDialog: false,
      filterStateMap:updatedMap
    });

    this.filterMap = updatedMap;

    this.querySearchTasksFromDB(type);
  }

  //Callback close filter dialog
  onCloseFilterDialog() {
    this.setState({
      openFilterDialog: false
    });
  }

  onSearchInputChanged(type, e){
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
      else{
        searchString = [searchString];
      }
    }

    let updatedMap = new Map(this.state.filterStateMap);
    let updatedObject = updatedMap.get(type);
    updatedObject.searchStrings = searchString;
    updatedMap.set(type,
      updatedObject
    );

    this.setState({
      filterStateMap:updatedMap
    });

    this.filterMap = updatedMap;

    this.querySearchTasksFromDB(type);
  }

  querySearchTasksFromDB(type){

    let filterObject = this.filterMap.get(type);

    let combinedSearch = filterObject.tagFilters.concat(filterObject.searchStrings);
    combinedSearch = combinedSearch.filter(Boolean); //Remove empty values

    if(combinedSearch.length === 1 && filterObject.searchStrings.length === 1){
      combinedSearch = combinedSearch[0];
    }
    if(combinedSearch.length === 0){
      combinedSearch = "";
    }

    db_helper.queryTasksFromDb(type, combinedSearch, filterObject.queryCombination, this.dbQueryCallback);
  }

  //
  getCollapsableHeaderButtons(activeFilters, searchCallback, addCallback, filterCallback, searchBarID){

    var filterButton = null;
    if(filterCallback !== null){
      filterButton = <Button style={{position:"relative", width: '100%', height: '100%', minWidth:0, minHeight:0}}
      className="collapsableHeaderBtns" size="small" onClick={filterCallback} >
        <FilterList color={activeFilters?"secondary":"inherit"} fontSize="large"/>
      </Button>;
    }

    var collapsableTaskHeaderButtons =
    <div className="collapsableHeaderBtnsContainer">
      <div className="searchWrapperDiv"><SearchBar onChange={searchCallback} searchID={searchBarID}/></div>
      <div className="collapsableBtns">
        {filterButton}
        <Button style={{position:"relative", width: '100%', height: '100%', minWidth:0, minHeight:0}} size="small" onClick={addCallback} >
          <AddCircleOutline fontSize="large"/>
        </Button>
      </div>
    </div>;

    return collapsableTaskHeaderButtons;
  }

  getTaskTypeContainer(taskType, taskMap){
    var dragEnabled = false;
    if(this.state.assetEditorObject && this.state.assetEditorObject.type === EditSet){
      dragEnabled = true;
    }

    let containerContent = [];

    let selectedTask = null;
    let selectCallback = null;
    let addCallback = null;
    let activeFilters = this.state.filterStateMap.get(taskType).tagFilters.length > 0 ? true : false;

    if(taskType === db_objects.ObjectTypes.TASK){
      selectedTask = this.state.selectedSynquestitask;
      selectCallback = this.selectSynquestitask.bind(this);
      addCallback = this.addSynquestitaskCallback.bind(this);
    }
    else if(taskType === db_objects.ObjectTypes.SET){
      selectedTask = this.state.selectedTaskSet;
      selectCallback = this.selectTaskSet.bind(this);
      addCallback = this.addSetCallback.bind(this);
    }
    else{
      console.log("unknown task type: ", taskType);
      return null;
    }

    let collapsableHeaderButtons = this.getCollapsableHeaderButtons(activeFilters, this.onSearchInputChanged.bind(this, taskType),
      addCallback, this.filterButtonPressed.bind(this, taskType), taskType+"SearchBar");

    //let index = 0;
    //Nested lists based on task groups
    //let taskMap = this.groupTasksByTags(taskMap);
    /*for (const [key, value] of taskMap.entries()) {
      containerContent.push(<CollapsableContainer headerTitle={key} useMediaQuery={false}
      hideHeaderComponents={true} open={true} key={key+index}>
          < TaskListComponent dragEnabled={dragEnabled} taskList={ value }
            selectTask={ selectCallback } selectedTask={selectedTask}
            itemType={taskType} droppableId={taskType} idSuffix={key}/ >
      </CollapsableContainer>);
      index++;
    }*/

    //No nested lists
    containerContent = < TaskList dragEnabled={dragEnabled} taskList={ taskMap }
      selectTask={ selectCallback } selectedTask={selectedTask}
      itemType={taskType} droppableId={taskType} idSuffix={""}/ >;


    let container =
    <CollapsableContainer headerTitle={taskType} useMediaQuery={true}
    headerComponents={collapsableHeaderButtons} hideHeaderComponents={true} open={true}>
      {containerContent}
    </CollapsableContainer>;

    return container;
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

    return (
    <DragDropContext onDragEnd={this.onDragEnd}>
      <div className = "editorScreenContainer">

        <div style={{backgroundColor:leftBG}} className = "AssetViewer">
          <div className="AssetViewerContent">
            {this.getTaskTypeContainer(db_objects.ObjectTypes.TASK, this.state.synquestitaskList)}
            {this.getTaskTypeContainer(db_objects.ObjectTypes.SET, this.state.taskSetList)}
          </div>
        </div>

        {this.getAssetEditorObject()}

        <FilterDialog openDialog={this.state.openFilterDialog} key={"filterDialog"+this.filterDialogKey}
                      closeDialog={this.onCloseFilterDialog.bind(this)}
                      filterType={this.state.filterQueryType}
                      filterObject = {this.state.filterStateMap.get(this.state.filterQueryType)}
                      onFiltersUpdated={this.onFiltersChanged}/>
      < /div>
    </DragDropContext>
    );
  }
}

export default withTheme(EditMode);
