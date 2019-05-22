import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

//icons
import CancelIcon from '@material-ui/icons/Cancel';
import NavigationIcon from '@material-ui/icons/NavigateNext';
import TextField from '@material-ui/core/TextField';

import TaskListComponent from '../components/TaskListComponent';

import wamp from '../core/wamp';
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
    //5cdc1bfbce788a06b852777e
    this.setState({taskSets: dbQueryResult});
  }

  dbTasksCallbackFunction(dbQueryResult) {
    //console.log(dbQueryResult);
    //5cdc1bfbce788a06b852777e
    var action = {
      type: 'SET_TASK_LIST',
      taskList: dbQueryResult
    }
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
        < TaskListComponent selectedTask={this.state.selectedTaskSet} reorderDisabled={true} reorderID="tasksReorder" taskList={ this.state.taskSets } selectTask={ this.onSelectTaskSet.bind(this) } editable={false}/ >
        <div className="playButtonWrapper">
          <Button variant="fab" onClick={this.onPlayButtonClick.bind(this)}
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
