import React, { Component } from 'react';

import { withTheme } from '@material-ui/styles';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';

import { Typography } from '@material-ui/core';

import store from '../core/store';
import wampStore from '../core/wampStore';

class EyeTrackerSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTracker: store.getState().selectedEyeTracker ? store.getState().selectedEyeTracker : ''
    }

    this.remoteEyeTrackers = store.getState().remoteEyeTrackers;
  }

  componentWillMount() {
    wampStore.addNewRemoteTrackerListener(this.onNewRemoteTracker.bind(this));
  }

  componentWillUnmount() {
    wampStore.removeNewRemoteTrackerListener(this.onNewRemoteTracker.bind(this));
  }

  onNewRemoteTracker() {
    if (!this.remoteEyeTrackers.includes(wampStore.getCurrentRemoteTracker())) {
      wampStore.confirmRecevingRemoteTracker();
      this.remoteEyeTrackers.push(wampStore.getCurrentRemoteTracker());

      this.forceUpdate();
    }
  }

  onSelectRemoteTracker(e) {
    var setETAction = {
      type: 'SET_SELECTED_EYETRACKER',
      selectedEyeTracker: e.target.value
    };
    console.log(setETAction);
    store.dispatch(setETAction);

    this.setState({
      selectedTracker: e.target.value
    });
  }

  render() {
    let theme = this.props.theme;
    let textColor = theme.palette.type === "light" ? "textSecondary" : "textPrimary";

    return (
          <FormControl style={{width:'100%', height:75, marginTop:20, alignItems:'center', display:'flex'}}>
            <InputLabel style={{paddingLeft: theme.spacing(1)}} htmlFor="outlined-age-simple"><Typography color={textColor} variant="h6">Eye Tracker</Typography></InputLabel>
            <Select
              style={{width:'100%', height:'100%', position:'relative', outlined:{height:'100%', width:'100%'}}}
              autoWidth={true}
              value={this.state.selectedTracker}
              onChange={this.onSelectRemoteTracker.bind(this)}
              input={<OutlinedInput style={{marginRight: theme.spacing(1)}} name="selectedTracker" id="selectedTracker-helper" />}
            >
              {
                this.remoteEyeTrackers.map((item, index) => {
                  return <MenuItem key={index} value={item} id={index}>{item}</MenuItem>
                })
              }
            </Select>
          </FormControl>
      );
  }
}

export default withTheme(EyeTrackerSelector);
