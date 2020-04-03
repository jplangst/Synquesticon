import React, { Component } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import * as mqtt from '../../../core/mqtt';

class MQTTDialog extends Component {
  componentWillMount() {
    this.mqttConfigurations();
    mqtt.startMQTT(this.mqtt);
  }

  mqttConfigurations() {
    var mqttConfig = JSON.parse(this.props.myStorage.getItem('mqtt'));
    this.mqtt = (mqttConfig && mqttConfig !== undefined && mqttConfig.ip !== undefined) ? mqttConfig : {
      ip: "127.0.0.1",
      port: "9001"
    }
  }

  onChangeMQTTSettings(e) {
    this.props.myStorage.setItem('mqtt', JSON.stringify(this.mqtt));

    //Passing true to indicate that we want to restart the mqtt client
    mqtt.startMQTT(this.mqtt, true);

    //Callback to close the dialog from the header
    this.props.closeMQTTSettings();
  }

  render() {
    return(
      <Dialog
          open={this.props.openMQTTSettings}
          onClose={this.props.closeMQTTSettings}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title" variant="h5">MQTT Settings</DialogTitle>
          <DialogContent>
            <TextField
              required
              padding="normal"
              style={{marginRight:"10px", width:"calc(50% - 5px)"}}
              id="mqttIP"
              defaultValue={this.mqtt.ip}
              label="MQTT IP Address"
              ref="MQTTIPRef"
              onChange={(e)=>{this.mqtt.ip = e.target.value}}
            />
            <TextField
              required
              padding="normal"
              id="mqttPort"
              defaultValue={this.mqtt.port}
              style={{width:"calc(50% - 5px)"}}
              label="MQTT port"
              type="number"
              ref="MQTTPortRef"
              onChange={(e)=>{this.mqtt.port = e.target.value}}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={this.props.closeMQTTSettings} >
              Cancel
            </Button>
            <Button variant="outlined" onClick={this.onChangeMQTTSettings.bind(this)} >
              OK
            </Button>
          </DialogActions>
      </Dialog>
    );
  }
}

export default MQTTDialog;
