import React, { Component } from 'react';

import { withTheme } from '@material-ui/styles';

import PlayableSetListComponent from '../components/TaskList/PlayableSetListComponent';

import ShareExperimentDialog from '../components/dialogs/ShareExperimentDialog';

import { Typography } from '@material-ui/core';

import store from '../core/store';

import db_helper from '../core/db_helper.js';
import * as dbObjects from '../core/db_objects';

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

    if (storeState.selectedEyeTracker != "" && storeState.selectedEyeTracker != undefined) {
      url += '&tracker=' + storeState.selectedEyeTracker;
    }
    return url;
  }

  //bottom button handler TODO get the information from the store instead of the state for the eye tracker
  onPlayButtonClick(taskSet) {
    this.selectedTaskSet = taskSet;
    /* db_helper.getTasksOrTaskSetsWithIDs(this.selectedTaskSet, (dbQueryResult, count) => {
    //   db_helper.addParticipantToDb(new dbObjects.ParticipantObject(this.selectedTaskSet._id), (returnedIdFromDB)=> {
    //     var action = {
    //       type: 'SET_EXPERIMENT_INFO',
    //       experimentInfo: {
    //         experimentId: "",
    //         participantLabel: playerUtils.getDeviceName(),
    //         startTimestamp: playerUtils.getFormattedCurrentTime(),
    //         participantId: returnedIdFromDB,
    //         mainTaskSetId: this.selectedTaskSet.name,
    //         taskSet: dbQueryResult,
    //         taskSetCount: count,
    //         selectedTaskSetObject: this.selectedTaskSet,
    //         selectedTracker: this.state.selectedTracker
    //       }
    //     }
    //
    //     store.dispatch(action);
    //
    //     var layoutAction = {
    //       type: 'SET_SHOW_HEADER',
    //       showHeader: false
    //     }
    //
    //     store.dispatch(layoutAction);
    //
    //     this.props.gotoPage('/study');
    //   })
    // }); */
    var url = '/study?id=' + this.selectedTaskSet._id;
    this.appendEyeTrackerInfo(url);
    this.props.gotoPage(url);
  }

  onGetLinkCallback(taskSet) {
    this.selectedTaskSet = taskSet;

    this.setState({
      openGetLinkDialog: true
    });
  }

  closeGetLinkDialog() {
    this.setState({
      openGetLinkDialog: false
    });
  }

  render() {
    let theme = this.props.theme;
    let textColor = theme.palette.type === "light" ? "textSecondary" : "textPrimary";

    var url = window.location.href + 'study?id=';
    if (this.selectedTaskSet) {
       url += this.selectedTaskSet._id;
       this.appendEyeTrackerInfo(url);
    }

    return (
      <div className="PlayerViewerContent">
        <div className="TaskSetContainer">
          < PlayableSetListComponent taskList={ this.state.taskSets }
                  runSetCallback={ this.onPlayButtonClick.bind(this) }
                  getLinkCallback={ this.onGetLinkCallback.bind(this) }
                  showEditButton={false}/>
        </div>
        <ShareExperimentDialog link={url}
                               openDialog={this.state.openGetLinkDialog}
                               closeDialog={this.closeGetLinkDialog.bind(this)}/>
      </div>
      );
  }
}

export default withTheme(PlayerMode);
