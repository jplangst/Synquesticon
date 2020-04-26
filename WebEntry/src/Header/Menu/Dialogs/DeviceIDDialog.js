import React, { useState, useEffect } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import TextField from '@material-ui/core/TextField';
import { withTheme } from '@material-ui/styles';

import Button from '@material-ui/core/Button';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

import db_helper from '../../../core/db_helper';
import store from '../../../core/store';

const DEFAULT_ROLES = ["SRO", "RO", "TO"];

const DeviceIDDialog = props => {
  let deviceName = props.myStorage.getItem('deviceID');
  let screenID = store.getState().screenID;
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [multipleScreens, setMultipleScreens] = useState(store.getState().multipleScreens);
  let selectedRole = props.myStorage.getItem('deviceRole') ? props.myStorage.getItem('deviceRole') : roles[0];  

  useEffect( () => {
    db_helper.getAllRolesFromDb((receivedRoles) => {
      if (receivedRoles.length <= 0) {
        //init the roles
        DEFAULT_ROLES.map((item, index) => {
          db_helper.addRoleToDb({name: item});
          return 1;
        });
      } else {
        var roleArray = [];
        receivedRoles.map((role, index) => {
          roleArray.push(role.name);
          return 1;
        })
        setRoles(roleArray);
      }
      return 1;
    });
  }, []);

  const multipleScreensToggled = (e, checked) => {
    setMultipleScreens(checked);
  }

  const onChangeDeviceID = e => {
    props.myStorage.setItem('deviceID', deviceName);
    props.myStorage.setItem('deviceRole', selectedRole);

    var storeAction = {
      type: 'SET_MULTISCREEN',
      screenID: screenID,
      multipleScreens: multipleScreens,
    };
    store.dispatch(storeAction);
    props.closeDeviceIDSettings();
  }

  return(
    <Dialog 
            open={props.openDeviceIDSettings}
            onClose={props.closeDeviceIDSettings}
            aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title" variant="h5">Device Settings</DialogTitle>
        <DialogContent>
          <TextField
            defaultValue={deviceName}
            style={{width:'calc(50% - 5px)', marginRight: 5}}
            id="deviceName"
            label="Device ID"
            padding="dense"
            variant="outlined"
            onChange={(e)=>{deviceName = e.target.value}}
          />
          <TextField
              defaultValue={screenID}
              style={{width:'calc(50% - 5px)', marginRight:5}}
              id="screenID"
              label="Screen ID"
              padding="dense"
              variant="outlined"
              onChange={(e)=>{screenID = e.target.value}}
            />
          <FormControl style={{width:'calc(50% - 5px)', marginRight:5}}>
            <InputLabel htmlFor="uncontrolled-native">Role</InputLabel>
            <NativeSelect
              defaultValue={selectedRole}

              input={<Input style={{backgroundColor:props.theme.palette.primary.main,
                color:props.theme.palette.text.primary}} name="role" id="role-selector" />}
              onChange={(e)=>{selectedRole = e.target.value}}
            >
              {roles.map((role, index) => {
                return <option style={{backgroundColor:props.theme.palette.primary.main, color:props.theme.palette.text.primary}}
                value={role} key={index}>{role}</option>
              })}
            </NativeSelect>
          </FormControl>
            <FormControlLabel label="Multiple screens"
              style={{marginTop:5}}
              checked={multipleScreens}
              id="mScreens"

              control={<Checkbox color="secondary" />}
              onChange={multipleScreensToggled}
              labelPlacement="end"
            />
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" onClick={props.closeDeviceIDSettings}>
              Cancel
            </Button>
            <Button variant="outlined" onClick={onChangeDeviceID}>
              OK
            </Button>
        </DialogActions>
      </Dialog>
  );
}

export default withTheme(DeviceIDDialog);