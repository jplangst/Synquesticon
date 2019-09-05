import React, { Component } from 'react';

import { withTheme } from '@material-ui/styles';

import Button from '@material-ui/core/Button';
import NavigationIcon from '@material-ui/icons/NavigateNext';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';

import PlayableSetListComponent from '../components/TaskList/PlayableSetListComponent';
import TaskListComponent from '../components/TaskList/TaskListComponent';

import { Typography } from '@material-ui/core';

import store from '../core/store';
import shuffle from '../core/shuffle';
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
    let theme = this.props.theme;
    let textColor = theme.palette.type === "light" ? "textSecondary" : "textPrimary";

    return (
      <div className="PlayerViewerContent">
        <div className="TaskSetContainer">
          < PlayableSetListComponent taskList={ this.state.taskSets }
                  runSetCallback={ this.onPlayButtonClick.bind(this) } />
        </div>
        <div className="RemoteTrackerContainer">
          <FormControl className="textinput">
            <InputLabel style={{marginLeft: theme.spacing(1)}} htmlFor="outlined-age-simple"><Typography color={textColor} variant="h6">Remote Eye Tracker</Typography></InputLabel>
            <Select
              style={{width:'100%', height:'100%', marginRight: theme.spacing(1)}}
              value={this.state.selectedTracker}
              onChange={this.onSelectRemoteTracker.bind(this)}
              input={<OutlinedInput style={{marginRight: theme.spacing(1)}} name="selectedTracker" id="selectedTracker-helper" />}
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

export default withTheme(PlayerMode);
