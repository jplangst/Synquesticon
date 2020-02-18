import React, { Component } from 'react';

import { withTheme } from '@material-ui/styles';

import PlayableSetListComponent from '../components/TaskList/PlayableSetListComponent';

import Snackbar from '@material-ui/core/Snackbar';

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
    db_helper.queryTasksFromDb(false, "experiment", this.dbTaskSetCallback);
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

  //bottom button handler TODO get the information from the store instead of the state for the eye tracker
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

    this.setState({
      openSnackBar: true
    });
  }

  handleCloseSnackbar(event, reason) {
    this.setState({
      openSnackBar: false
    });
  }

  render() {
    var url = window.location.href + 'study?id=';
    if (this.selectedTaskSet) {
       url += this.selectedTaskSet._id;
       url = this.appendEyeTrackerInfo(url);
    }

    return (
      <div className="PlayerViewerContent">
        <div className="TaskSetContainer">
          < PlayableSetListComponent taskList={ this.state.taskSets }
                  runSetCallback={ this.onPlayButtonClick.bind(this) }
                  getLinkCallback={ this.onGetLinkCallback.bind(this) }
                  showEditButton={false}/>
        </div>

         <Snackbar
           style = {{bottom: 200}}
           anchorOrigin={{
             vertical: 'bottom',
             horizontal: 'center',
           }}
           open={this.state.openSnackBar}
           autoHideDuration={2000}
           onClose={this.handleCloseSnackbar.bind(this)}
           ContentProps={{
             'aria-describedby': 'message-id',
           }}
           message={<span id="message-id">Link copied to clipboard</span>}
         />
      </div>
      );
  }
}

export default withTheme(PlayerMode);
