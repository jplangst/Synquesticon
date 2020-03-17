import React, { Component } from 'react';

import { withTheme } from '@material-ui/styles';

import PlayableSetListComponent from '../components/TaskList/PlayableSetListComponent';

import store from '../core/store';

import db_helper from '../core/db_helper.js';

import './PlayerMode.css';

class PlayerMode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      taskSets: [],
      openGetLinkDialog: false
    }

    this.selectedTaskSet = null;

    //Database callbacks
    this.dbTaskSetCallback = this.dbTaskSetCallbackFunction.bind(this);
  }

  componentWillMount() {
    //save data into DB before closing
    db_helper.queryTasksFromDb("set", "experiment", this.dbTaskSetCallback);
  }

  //query all tasksets with experiment tag
  dbTaskSetCallbackFunction(queryTasks, data) {
    this.setState({taskSets: data.tasks});
  }

  appendEyeTrackerInfo(url){
    let storeState = store.getState();
    console.log(storeState);
    if (storeState.selectedEyeTracker !== "" && storeState.selectedEyeTracker !== undefined) {
      url = url + '&tracker=' + storeState.selectedEyeTracker;
    }
    return url;
  }

  onEditButtonClick(taskSet) {
    var setEditSetAction = {
      type: 'SET_SHOULD_EDIT',
      shouldEdit: true,
      objectToEdit:taskSet,
      typeToEdit:'set'
    };
    store.dispatch(setEditSetAction);

    this.props.gotoPage("/EditorMode");
  }

  onPlayButtonClick(taskSet) {
    this.selectedTaskSet = taskSet;
    var url = '/study?id=' + this.selectedTaskSet._id;
    url = this.appendEyeTrackerInfo(url);
    this.props.gotoPage(url);
  }

  onGetLinkCallback(taskSet) {
    this.selectedTaskSet = taskSet;
    this.copyToClipboard();
  }

  copyToClipboard() {
    var url = window.location.href + 'study?id=';
    if (this.selectedTaskSet) {
       url += this.selectedTaskSet._id;
       url = this.appendEyeTrackerInfo(url);
    }
    navigator.clipboard.writeText(url);

    var snackbarAction = {
      type: 'TOAST_SNACKBAR_MESSAGE',
      snackbarOpen: true,
      snackbarMessage: "Link copied to clipboard"
    };
    store.dispatch(snackbarAction);
  }

  render() {
    return (
      <div className="PlayerViewerContent">
        <div className="TaskSetContainer">
          < PlayableSetListComponent taskList={ this.state.taskSets }
                  runSetCallback={ this.onPlayButtonClick.bind(this) }
                  getLinkCallback={ this.onGetLinkCallback.bind(this) }
                  editSetCallback={ this.onEditButtonClick.bind(this) }
                  showEditButton={true}/>
        </div>
      </div>
      );
  }
}

export default withTheme(PlayerMode);
