import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

//icons
import NavigationIcon from '@material-ui/icons/NavigateNext';
import TextField from '@material-ui/core/TextField';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FilledInput from '@material-ui/core/FilledInput';

import TaskListComponent from '../components/TaskList/TaskListComponent';

import store from '../core/store';

import * as dbFunctions from '../core/db_helper.js';
import './PlayerMode.css';

class PlayerMode extends Component {
  constructor() {
    super();

    this.state = {
      experiment: '',
      participant: '',
      selectedTaskSet: null,
      selectedTracker: '',
      taskSets: []
    }

    //Database callbacks
    this.dbTaskSetCallback = this.dbTaskSetCallbackFunction.bind(this);
    this.dbTasksCallback = this.dbTasksCallbackFunction.bind(this);
  }

  componentWillMount() {
    dbFunctions.getAllTaskSetsFromDb(this.dbTaskSetCallback);
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  dbTaskSetCallbackFunction(dbQueryResult) {
    console.log(dbQueryResult);
    //5ce55a585ed92d33d4c33a32
    //5ce7a7d4b3258d5910a303c5
    //5ce7a7fdb3258d5910a303c9
    //5ce7a812b3258d5910a303cd

    //set: 5ce55a645ed92d33d4c33a36
    this.setState({taskSets: dbQueryResult});
  }

  dbTasksCallbackFunction(dbQueryResult) {

    //5cdc1bfbce788a06b852777e
    var action = {
      type: 'SET_EXPERIMENT_INFO',
      experimentInfo: {
        experimentId: this.state.experiment,
        participantId: this.state.participant,
        taskSet: dbQueryResult,
        selectedTracker: this.state.selectedTracker
      }
    }
    console.log("dispatch contain", action);
    store.dispatch(action);
    this.props.history.push('/RunTasksMode');
  }

  onSelectTaskSet(taskSet) {
    this.setState({selectedTaskSet: taskSet});
  }

  //bottom button handler
  onPlayButtonClick() {
    dbFunctions.getTasksWithIDs(this.state.selectedTaskSet.taskIds, this.dbTasksCallback);
  }

  render() {
    return (
      <div className="page">
        <div className="textinput">
          <TextField
            id="experiment-name"
            label="Experiment"
            value={this.state.experiment}
            onChange={this.handleChange('experiment')}
            margin="normal"
          />
        </div>
        <div className="textinput">
          <TextField
            id="participant-code"
            label="Participant"
            value={this.state.participant}
            onChange={this.handleChange('participant')}
            margin="normal"
          />
        </div>
        <FormControl className="textinput">
          <InputLabel htmlFor="age-simple">Remote Eye Tracker</InputLabel>
          <Select
            value={this.state.selectedTracker}
            onChange={this.handleChange('selectedTracker')}
            input={<FilledInput name="selectedTracker" id="selectedTracker-helper" />}
          >
            {
              store.getState().remoteEyeTrackers.map((item, index) => {
                return <MenuItem value={item} id={index}>{item}</MenuItem>
              })
            }
          </Select>
        </FormControl>
        < TaskListComponent selectedTask={this.state.selectedTaskSet} reorderDisabled={true} reorderID="tasksReorder" taskList={ this.state.taskSets } selectTask={ this.onSelectTaskSet.bind(this) } editable={false}/ >
        <div className="playButtonWrapper">
          <Button onClick={this.onPlayButtonClick.bind(this)}
                  className="playButton" disabled={(!this.state.experiment)||(!this.state.participant)||(!this.state.selectedTaskSet)}>
            <NavigationIcon fontSize="large"/>
          </Button>
        </div>
        <div className="footer">
        </div>
      </div>
      );
  }
}

export default PlayerMode;
