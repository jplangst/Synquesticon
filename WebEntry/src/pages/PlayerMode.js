import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import NavigationIcon from '@material-ui/icons/NavigateNext';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FilledInput from '@material-ui/core/FilledInput';

import PlayableSetListComponent from '../components/TaskList/PlayableSetListComponent';
import TaskListComponent from '../components/TaskList/TaskListComponent';

import store from '../core/store';
import shuffle from '../core/shuffle';
import wampStore from '../core/wampStore';
import db_helper from '../core/db_helper.js';
import * as dbObjects from '../core/db_objects';

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
    this.dbTasksCallback = this.dbTasksCallbackFunction.bind(this);
  }

  componentWillMount() {
    wampStore.addNewRemoteTrackerListener(this.onNewRemoteTracker.bind(this));

    //save data into DB before closing
    db_helper.getAllParticipantsFromDb((participants) => {
      console.log("all participants", participants);
    });
    db_helper.queryTasksFromDb(false, "experiment", this.dbTaskSetCallback);
  }

  componentWillUnmount() {
    wampStore.removeNewRemoteTrackerListener(this.onNewRemoteTracker.bind(this));
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

  dbTasksCallbackFunction(dbQueryResult) {
    var runThisTaskSet = dbQueryResult;
    if (this.selectedTaskSet.setTaskOrder === "Random") {
      runThisTaskSet = shuffle(runThisTaskSet);
    }

    db_helper.addParticipantToDb(new dbObjects.ParticipantObject(this.selectedTaskSet._id), (returnedIdFromDB)=> {
      var action = {
        type: 'SET_EXPERIMENT_INFO',
        experimentInfo: {
          experimentId: "",
          participantId: returnedIdFromDB,
          mainTaskSetId: this.selectedTaskSet.name,
          taskSet: runThisTaskSet,
          selectedTracker: this.state.selectedTracker
        }
      }

      store.dispatch(action);

      var layourAction = {
        type: 'SET_SHOW_HEADER',
        showHeader: false
      }

      store.dispatch(layourAction);

      this.props.gotoPage('/RunTasksMode');
    })
  }

  //bottom button handler
  onPlayButtonClick(taskSet) {
    this.selectedTaskSet = taskSet;
    db_helper.getTasksOrTaskSetsWithIDs(this.selectedTaskSet.childIds, this.dbTasksCallback);
  }

  onSelectRemoteTracker(e) {
    this.setState({
      selectedTracker: e.target.value
    });
  }

  render() {
    return (
      <div className="AssetViewerContent">
        <div className="ContainerSeperator TaskSetContainer">
          < PlayableSetListComponent
                              taskList={ this.state.taskSets }
                              runSetCallback={ this.onPlayButtonClick.bind(this) } />
        </div>
        <div className="ContainerSeperator RemoteTrackerContainer">
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
