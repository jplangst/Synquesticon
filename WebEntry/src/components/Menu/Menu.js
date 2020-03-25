import React, { Component } from 'react';

import './Menu.css';

//Components
import DeviceIDDialog from '../dialogs/DeviceIDDialog';
import MQTTDialog from '../dialogs/MQTTDialog';
import SpeechDialog from '../dialogs/SpeechDialog';
import EyeTrackerSelector from '../../core/EyeTrackerSelector';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';

import store from '../../core/store';

var myStorage = window.localStorage;

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDeviceIDSettings: false,
      openSpeechSettings: false,
      openMQTTSettings: false
    }
  }

  //Menus
  onFullscreen(e) {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||
     (!document.mozFullScreen && !document.webkitIsFullScreen)) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  onOpenDeviceIDSettings(e) {
    this.setState({
      openDeviceIDSettings: true
    });
  }

  onCloseDeviceIDSettings(e) {
    this.setState({
      openDeviceIDSettings: false
    });
  }

  onOpenMQTTSettings(e) {
    this.setState({
      openMQTTSettings: true
    });
  }

  onCloseMQTTSettings(e) {
    this.setState({
      openMQTTSettings: false
    });
  }

  //-----------Speech Settings------------
  onOpenSpeechSettings(e) {
    this.setState({
      openSpeechSettings: true
    });
  }

  onCloseSpeechSettings(e) {
    this.setState({
      openSpeechSettings: false
    });
  }

  //TODO move this into a utility file or something
  //var synth = window.speechSynthesis;
  speak(synth, inputTxt) {
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    if (inputTxt !== '') {
      var utterThis = new SpeechSynthesisUtterance(inputTxt);
      utterThis.onend = function (event) {
          console.log('SpeechSynthesisUtterance.onend');
      }
      utterThis.onerror = function (event) {
          console.error('SpeechSynthesisUtterance.onerror');
      }
      synth.speak(utterThis);
    }
  }

  //button click handlers
  openSettingsMenu() {
    this.setState({showMenu: true});
  }

  closeSettingsMenu(e) {
    this.setState({showMenu: false});
  }

  onToggleThemeChange(){
    var toggleThemeAction = {
      type: 'TOGGLE_THEME_TYPE',
    };

    store.dispatch(toggleThemeAction);
  }

  render() {
    var deviceName = myStorage.getItem('deviceID');
    if (!deviceName || deviceName === "") {
      deviceName="Device ID";
    }

    let speechSettings = this.props.showSpeechSettings ?
          <ListItem button key="Speech Settings" onClick={this.onOpenSpeechSettings.bind(this)}>
            <ListItemText primary="Speech Settings" />
          </ListItem> :
          null;

    return(
      <span >
        <Drawer anchor="right" open={this.props.showMenu} onClose={this.props.closeSettingsMenu}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.props.openSettingsMenu}
            style={{minWidth: 200, height:'100%'}}
          >
            <List >
              <ListItem button key="Device ID" onClick={this.onOpenDeviceIDSettings.bind(this)}>
                <ListItemText primary={deviceName} />
              </ListItem>
              <ListItem button key="MQTT Settings" onClick={this.onOpenMQTTSettings.bind(this)}>
                <ListItemText primary="MQTT Settings" />
              </ListItem>
              {speechSettings}
            </List>
            <Divider />
            <List>
              <div style={{display:'flex', flexDirection:'row', alignItems: 'center'}}>
                <ListItem key="ToggleTheme">
                  <ListItemText primary="Dark Theme" />
                </ListItem>
                <Switch
                  checked={store.getState().theme.palette.type !== "light"}
                  onChange={this.onToggleThemeChange.bind(this)}
                  value="checkedB"
                  color="secondary"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              </div>
              <ListItem button key="Fullscreen" onClick={this.onFullscreen.bind(this)}>
                <ListItemText primary="Fullscreen" />
              </ListItem>
              <EyeTrackerSelector />
            </List>
            <List>
              <ListItem key="Version">
                <ListItemText primary="Version 1.0" />
              </ListItem>
            </List>
          </div>
        </Drawer>
        <DeviceIDDialog openDeviceIDSettings={this.state.openDeviceIDSettings}
          closeDeviceIDSettings={this.onCloseDeviceIDSettings.bind(this)} myStorage={myStorage} />
        <MQTTDialog openMQTTSettings={this.state.openMQTTSettings}
          closeMQTTSettings={this.onCloseMQTTSettings.bind(this)} myStorage={myStorage}/>
        <SpeechDialog openSpeechSettings={this.state.openSpeechSettings}
          closeSpeechSettings={this.onCloseSpeechSettings.bind(this)} myStorage={myStorage}/>
      </span>
    );
  }
}
export default Menu;
