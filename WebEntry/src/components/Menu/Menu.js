import React, { Component } from 'react';

import './Menu.css';

//Components
import DeviceIDDialog from '../dialogs/DeviceIDDialog';
import CrossbarDialog from '../dialogs/CrossbarDialog';
import SpeechDialog from '../dialogs/SpeechDialog';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

var myStorage = window.localStorage;

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDeviceIDSettings: false,
      openCrossbarSettings: false,
      openSpeechSettings: false
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

  onOpenCrossbarSettings(e) {
    this.setState({
      openCrossbarSettings: true
    });
  }

  onCloseCrossbarSettings(e) {
    this.setState({
      openCrossbarSettings: false
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

  render() {
    var deviceName = myStorage.getItem('deviceID');
    if (!deviceName || deviceName === "") {
      deviceName="Unnamed";
    }
    return(
      <div >
        <Drawer anchor="right" open={this.props.showMenu} onClose={this.props.closeSettingsMenu}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.props.openSettingsMenu}
          >
            <List>
              <ListItem button key="Device ID" onClick={this.onOpenDeviceIDSettings.bind(this)}>
                <ListItemText primary={deviceName} />
              </ListItem>
              <ListItem button key="Crossbar Settings" onClick={this.onOpenCrossbarSettings.bind(this)}>
                <ListItemText primary="Crossbar Settings" />
              </ListItem>
              <ListItem button key="Speech Settings" onClick={this.onOpenSpeechSettings.bind(this)}>
                <ListItemText primary="Speech Settings" />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem button key="Fullscreen" onClick={this.onFullscreen.bind(this)}>
                <ListItemText primary="Fullscreen" />
              </ListItem>
            </List>
          </div>
        </Drawer>
        <DeviceIDDialog openDeviceIDSettings={this.state.openDeviceIDSettings} closeDeviceIDSettings={this.onCloseDeviceIDSettings.bind(this)} myStorage={myStorage} />
        <CrossbarDialog openCrossbarSettings={this.state.openCrossbarSettings} closeCrossbarSettings={this.onCloseCrossbarSettings.bind(this)} myStorage={myStorage}/>
        <SpeechDialog openSpeechSettings={this.state.openSpeechSettings} closeSpeechSettings={this.onCloseSpeechSettings.bind(this)} myStorage={myStorage}/>
      </div>
    );
  }
}
export default Menu;
