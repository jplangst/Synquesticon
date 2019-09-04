import React, { Component } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';

import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

import db_helper from '../../core/db_helper';

const DEFAULT_ROLES = ["SRO", "RO", "TO"];

class DeviceIDDialog extends Component {
  constructor(props){
    super(props);
    this.deviceName = "";
    this.selectedRole = null;
    this.state = {
      roles: DEFAULT_ROLES
    }
  }

  componentWillMount() {
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
        });
      }
      else {
        var roleArray = [];
        receivedRoles.map((role, index) => {
          roleArray.push(role.name);
        })
        this.setState({
          roles: roleArray
        });
      }
    });
  }

  componentWillUnmount() {
  }

  onChangeDeviceID(e) {
    this.props.myStorage.setItem('deviceID', this.deviceName);
    this.props.myStorage.setItem('deviceRole', this.selectedRole);
    this.props.closeDeviceIDSettings();
  }

  render() {

    return(
      <Dialog //------------------------speech settings------------------------
             open={this.props.openDeviceIDSettings}
             onClose={this.props.closeDeviceIDSettings}
             aria-labelledby="form-dialog-title"
       >
          <DialogTitle id="form-dialog-title">Device's ID</DialogTitle>
          <DialogContent>
             <DialogContentText>Enter this device's ID</DialogContentText>
             <div className="textField">
               <TextField
                  defaultValue={this.deviceName}
                  id="outlined-dense"
                  label="ID"
                  margin="dense"
                  variant="outlined"
                  onChange={(e)=>{this.deviceName = e.target.value}}
                />
              </div>
              <div className="selector">
                <FormControl>
                 <InputLabel htmlFor="uncontrolled-native">Role</InputLabel>
                 <NativeSelect
                    defaultValue={this.selectedRole}
                    input={<Input name="role" id="role-selector" />}
                    onChange={(e)=>{this.selectedRole = e.target.value}}
                  >
                    {this.state.roles.map((role, index) => {
                      return <option value={role} key={index}>{role}</option>
                    })}
                 </NativeSelect>
               </FormControl>
              </div>
          </DialogContent>
          <DialogActions>
             <Button onClick={this.props.closeDeviceIDSettings} color="primary">
               Cancel
             </Button>
             <Button onClick={this.onChangeDeviceID.bind(this)} color="primary">
               OK
             </Button>
          </DialogActions>
        </Dialog>
    );
  }
}

export default DeviceIDDialog;
