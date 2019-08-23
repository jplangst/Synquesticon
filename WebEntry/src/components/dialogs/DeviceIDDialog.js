import React, { Component } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';

import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';

class DeviceIDDialog extends Component {
  constructor(props){
    super(props);
    this.deviceName = "";
  }

  componentWillMount() {
    this.deviceName = this.props.myStorage.getItem('deviceID');
  }

  componentWillUnmount() {
  }

  onChangeDeviceID(e) {
    this.props.myStorage.setItem('deviceID', this.deviceName);
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
             <TextField
                id="outlined-dense"
                label="ID"
                margin="dense"
                variant="outlined"
                onChange={(e)=>{this.deviceName = e.target.value}}
              />
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
