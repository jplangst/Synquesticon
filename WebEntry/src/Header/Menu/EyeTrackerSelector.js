import React, { useState, useEffect } from 'react';

import { withTheme } from '@material-ui/styles';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';

import { Typography } from '@material-ui/core';

import store from '../../core/store';
import eventStore from '../../core/eventStore';

const EyeTrackerSelector = props => {
  const [selectedTracker, setSelectedTracker] = useState(store.getState().selectedEyeTracker ? store.getState().selectedEyeTracker : '');
  const remoteEyeTrackers = store.getState().remoteEyeTrackers;

  useEffect( () => {
    eventStore.addNewRemoteTrackerListener(onNewRemoteTracker);
    return () => eventStore.removeNewRemoteTrackerListener(onNewRemoteTracker);
  }, []);

  const onNewRemoteTracker = () => {
    if (!remoteEyeTrackers.includes(eventStore.getCurrentRemoteTracker())) {
      eventStore.confirmRecevingRemoteTracker();
      remoteEyeTrackers.push(eventStore.getCurrentRemoteTracker());
    }
  }

  const onSelectRemoteTracker = e => {
    var setETAction = {
      type: 'SET_SELECTED_EYETRACKER',
      selectedEyeTracker: e.target.value
    };
    store.dispatch(setETAction);

    setSelectedTracker(e.target.value);
  }

  let theme = props.theme;
  let textColor = theme.palette.type === "light" ? "textSecondary" : "textPrimary";

  return (
    <FormControl style={{width:'100%', height:75, marginTop:20, alignItems:'center', display:'flex'}}>
      <InputLabel style={{paddingLeft: theme.spacing(1)}} htmlFor="outlined-age-simple"><Typography color={textColor} variant="h6">Eye Tracker</Typography></InputLabel>
      <Select
        style={{width:'100%', height:'100%', position:'relative', outlined:{height:'100%', width:'100%'}}}
        autoWidth={true}
        value={selectedTracker}
        onChange={onSelectRemoteTracker}
        input={<OutlinedInput style={{marginRight: theme.spacing(1)}} name="selectedTracker" id="selectedTracker-helper" />}
      >
        {
          remoteEyeTrackers.map((item, index) => {
            return <MenuItem key={index} value={item} id={index}>{item}</MenuItem>
          })
        }
      </Select>
    </FormControl>
  );
}

export default withTheme(EyeTrackerSelector);
