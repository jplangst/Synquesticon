import React, { Component } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';
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

class DeviceIDDialog extends Component {
  constructor(props){
    super(props);
    this.deviceName = "";
    this.selectedRole = null;
    this.screenID = "";
    this.state = {
      roles: DEFAULT_ROLES,
      multipleScreens: false
    }

    this.handleMultipleScreens = this.multipleScreensToggled.bind(this);
  }

  componentWillMount() {
    this.screenID = store.getState().screenID;

    this.setState({multipleScreens:store.getState().multipleScreens});

    this.deviceName = this.props.myStorage.getItem('deviceID');
    this.selectedRole = this.props.myStorage.getItem('deviceRole');

    if (!this.selectedRole) {
      this.selectedRole = this.state.roles[0];
    }
    db_helper.getAllRolesFromDb((receivedRoles) => {
      if (receivedRoles.length <= 0) {
        //init the roles
        DEFAULT_ROLES.map((item, index) => {
          db_helper.addRoleToDb({name: item});
          return 1;
        });
      }
      else {
        var roleArray = [];
        receivedRoles.map((role, index) => {
          roleArray.push(role.name);
          return 1;
        })
        this.setState({
          roles: roleArray
        });
      }
      return 1;
    });
  }

  multipleScreensToggled(e, checked){
    this.setState({
      multipleScreens: checked,
    });
  }

  onChangeDeviceID(e) {
    this.props.myStorage.setItem('deviceID', this.deviceName);
    this.props.myStorage.setItem('deviceRole', this.selectedRole);

    var storeAction = {
      type: 'SET_MULTISCREEN',
      screenID: this.screenID,
      multipleScreens: this.state.multipleScreens,
    };
    store.dispatch(storeAction);

    this.props.closeDeviceIDSettings();
  }

  render() {

    return(
      <Dialog //------------------------speech settings------------------------
             open={this.props.openDeviceIDSettings}
             onClose={this.props.closeDeviceIDSettings}
             aria-labelledby="form-dialog-title"
       >
          <DialogTitle id="form-dialog-title" variant="h5">Device Settings</DialogTitle>
          <DialogContent>
            <TextField
              defaultValue={this.deviceName}
              style={{width:'calc(50% - 5px)', marginRight: 5}}
              id="deviceName"
              label="Device ID"
              padding="dense"
              variant="outlined"
              onChange={(e)=>{this.deviceName = e.target.value}}
            />
            <TextField
               defaultValue={this.screenID}
               style={{width:'calc(50% - 5px)', marginRight:5}}
               id="screenID"
               label="Screen ID"
               padding="dense"
               variant="outlined"
               onChange={(e)=>{this.screenID = e.target.value}}
             />
            <FormControl style={{width:'calc(50% - 5px)', marginRight:5}}>
             <InputLabel htmlFor="uncontrolled-native">Role</InputLabel>
             <NativeSelect
                defaultValue={this.selectedRole}

                input={<Input style={{backgroundColor:this.props.theme.palette.primary.main,
                  color:this.props.theme.palette.text.primary}} name="role" id="role-selector" />}
                onChange={(e)=>{this.selectedRole = e.target.value}}
              >
                {this.state.roles.map((role, index) => {
                  return <option style={{backgroundColor:this.props.theme.palette.primary.main, color:this.props.theme.palette.text.primary}}
                  value={role} key={index}>{role}</option>
                })}
              </NativeSelect>
            </FormControl>
             <FormControlLabel label="Multiple screens"
               style={{marginTop:5}}
               checked={this.state.multipleScreens}
               id="mScreens"

               control={<Checkbox color="secondary" />}
               onChange={this.handleMultipleScreens}
               labelPlacement="end"
             />
          </DialogContent>
          <DialogActions>
             <Button variant="outlined" onClick={this.props.closeDeviceIDSettings}>
               Cancel
             </Button>
             <Button variant="outlined" onClick={this.onChangeDeviceID.bind(this)}>
               OK
             </Button>
          </DialogActions>
        </Dialog>
    );
  }
}

export default withTheme(DeviceIDDialog);
