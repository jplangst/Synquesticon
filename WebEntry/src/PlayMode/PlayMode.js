import React, { Component } from 'react';

import { withTheme } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

import store from '../core/store';
import db_helper from '../core/db_helper.js';
import * as db_objects from '../core/db_objects.js';
import {AppModes} from '../core/sharedObjects';
import PlayableSetListComponent from '../components/TaskList/PlayableSetListComponent';

import './PlayMode.css';

class PlayMode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      taskSets: [],
      openGetLinkDialog: false
    }

    this.selectedTaskSet = null;

    //Database callbacks
    this.dbTaskSetCallback = this.dbTaskSetCallbackFunction.bind(this);

    this.gotoPage = this.gotoPageHandler.bind(this);
  }

  gotoPageHandler(route){
    this.props.history.push(route);
  }

  componentWillMount() {
    //save data into DB before closing
    db_helper.queryTasksFromDb(db_objects.ObjectTypes.SET, ["experiment"],"OR", this.dbTaskSetCallback);
  }

  //query all tasksets with experiment tag
  dbTaskSetCallbackFunction(queryTasks, data) {
    this.setState({taskSets: data.tasks});
  }

  appendEyeTrackerInfo(url){
    let storeState = store.getState();
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

    this.gotoPage("/"+AppModes.EDIT);
  }

  onPlayButtonClick(taskSet) {
    this.selectedTaskSet = taskSet;
    var url = '/study?id=' + this.selectedTaskSet._id;
    url = this.appendEyeTrackerInfo(url);
    this.gotoPage(url);
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
    let theme = this.props.theme;
    let viewerBG = theme.palette.type === "light" ? theme.palette.primary.main : theme.palette.primary.dark;

    return(
      <div className="introductionScreenContainer">
        <div className="experimentsHeader" style={{backgroundColor:viewerBG}}>
          <Typography style={{marginLeft:20, marginTop:20}} variant="h4" color="textPrimary">
            Experiments
          </Typography>
        </div>
        <div style={{backgroundColor:viewerBG}} className="IntroViewer">
          <div className="PlayerViewerContent">
            <div className="TaskSetContainer">
              < PlayableSetListComponent taskList={ this.state.taskSets }
                      runSetCallback={ this.onPlayButtonClick.bind(this) }
                      getLinkCallback={ this.onGetLinkCallback.bind(this) }
                      editSetCallback={ this.onEditButtonClick.bind(this) }
                      showEditButton={true}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTheme(PlayMode);
