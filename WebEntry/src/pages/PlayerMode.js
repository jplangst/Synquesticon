import React, { Component } from 'react';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FilledInput from '@material-ui/core/FilledInput';

import PlayableSetListComponent from '../components/TaskList/PlayableSetListComponent';

import store from '../core/store';

import wampStore from '../core/wampStore';
import db_helper from '../core/db_helper.js';
import * as dbObjects from '../core/db_objects';
import * as playerUtils from '../core/player_utility_functions';

import './PlayerMode.css';

class PlayerMode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTracker: '',
      remoteEyeTrackers: [],
      taskSets: []
    }

    this.selectedTaskSet = null;

    //Database callbacks
    this.dbTaskSetCallback = this.dbTaskSetCallbackFunction.bind(this);
  }

  componentWillMount() {
    //save data into DB before closing
    db_helper.getAllParticipantsFromDb((participants) => {
      console.log("all participants", participants);
    });
    db_helper.queryTasksFromDb(false, "experiment", this.dbTaskSetCallback);
  }

  onNewRemoteTracker() {
    console.log("new tracker coming in", wampStore.getCurrentRemoteTracker());

    if (!this.state.remoteEyeTrackers.includes(wampStore.getCurrentRemoteTracker())) {
      wampStore.confirmRecevingRemoteTracker();
      this.state.remoteEyeTrackers.push(wampStore.getCurrentRemoteTracker());

      this.forceUpdate();
    }
  }

  //query all tasksets with experiment tag
  dbTaskSetCallbackFunction(queryTasks, data) {
    this.setState({taskSets: data.tasks});
  }

  //bottom button handler
  onPlayButtonClick(taskSet) {
    this.selectedTaskSet = taskSet;
    db_helper.getTasksOrTaskSetsWithIDs(this.selectedTaskSet, (dbQueryResult, count) => {
      db_helper.addParticipantToDb(new dbObjects.ParticipantObject(this.selectedTaskSet._id), (returnedIdFromDB)=> {
        var action = {
          type: 'SET_EXPERIMENT_INFO',
          experimentInfo: {
            experimentId: "",
            participantLabel: playerUtils.getDeviceName(),
            startTimestamp: playerUtils.getFormattedCurrentTime(),
            participantId: returnedIdFromDB,
            mainTaskSetId: this.selectedTaskSet.name,
            taskSet: dbQueryResult,
            taskSetCount: count,
            selectedTaskSetObject: this.selectedTaskSet,
            selectedTracker: this.state.selectedTracker
          }
        }

        store.dispatch(action);

        var layoutAction = {
          type: 'SET_SHOW_HEADER',
          showHeader: false
        }

        store.dispatch(layoutAction);

        this.props.gotoPage('/DisplayTaskComponent');
      })
    });
  }

  onSelectRemoteTracker(e) {
    this.setState({
      selectedTracker: e.target.value
    });
  }

  render() {
    return (
      <div className="PlayerViewerContent">
        <div className="TaskSetContainer">
          < PlayableSetListComponent taskList={ this.state.taskSets }
                  runSetCallback={ this.onPlayButtonClick.bind(this) } />
        </div>
        <div className="RemoteTrackerContainer">
          <FormControl className="textinput">
            <InputLabel htmlFor="age-simple">Remote Eye Tracker</InputLabel>
            <Select
              value={this.state.selectedTracker}
              onChange={this.onSelectRemoteTracker.bind(this)}
              input={<FilledInput name="selectedTracker" id="selectedTracker-helper" />}
            >
              {
                this.state.remoteEyeTrackers.map((item, index) => {
                  return <MenuItem key={index} value={item} id={index}>{item}</MenuItem>
                })
              }
            </Select>
          </FormControl>
        </div>
      </div>
      );
  }
}

export default PlayerMode;
