import React, { useState, Component } from 'react';

import './Menu.css';

import store from '../../core/store';
import db_helper from '../../core/db_helper';

import DeviceIDDialog from './Dialogs/DeviceIDDialog';
import MQTTDialog from './Dialogs/MQTTDialog';
import SpeechDialog from './Dialogs/SpeechDialog';
import EyeTrackerSelector from './EyeTrackerSelector';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';

var myStorage = window.localStorage;

const Menu = (props) => {
  const [showMenu, setShowMenu] = useState(true);
  const [openDeviceIDSettings, setOpenDeviceIDSettings] = useState(false);
  const [openSpeechSettings, setOpenSpeechSettings] = useState(false);
  const [openMQTTSettings, setOpenMQTTSettings] = useState(false);

  const onFullscreen = (e) => {
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

  const onOpenDeviceIDSettings = (e) => setOpenDeviceIDSettings(true);
  const onCloseDeviceIDSettings = (e) => setOpenDeviceIDSettings(false);
  const onOpenMQTTSettings = (e) => setOpenMQTTSettings(true);
  const onCloseMQTTSettings= (e) => setOpenMQTTSettings(false);

  //-----------Speech Settings------------
  const onOpenSpeechSettings = (e) => setOpenSpeechSettings(true);
  const onCloseSpeechSettings = (e) => setOpenSpeechSettings(false);

  //TODO move this into a utility file or something
  //var synth = window.speechSynthesis;
  const speak = (synth, inputTxt) => {
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
  const openSettingsMenu = () => {
    console.log("open");
    //setShowMenu(true);
  }
  const closeSettingsMenu = (e) => {
    console.log("close");
    setShowMenu(false);
  }
  const onToggleThemeChange = () => {
    var toggleThemeAction = {
      type: 'TOGGLE_THEME_TYPE',
    };
    store.dispatch(toggleThemeAction);
  }

  const onEmptySets = () => db_helper.deleteAllTaskSetsFromDb();

  const onEmptyLegacyTasks = () => db_helper.deleteAllLegacyTasksFromDb();

  var deviceName = myStorage.getItem('deviceID');
  if (!deviceName || deviceName === "") {
    deviceName="Device ID";
  }

  let speechSettings = props.showSpeechSettings ?
    <ListItem button key="Speech Settings" onClick={onOpenSpeechSettings}>
      <ListItemText primary="Speech Settings" />
    </ListItem> :
    null;

  return(
    <span >
      <Drawer anchor="right" open={props.showMenu} onClose={props.closeSettingsMenu}>
        <div
          tabIndex={0}
          role="button"
          onClick={props.openSettingsMenu}
          style={{minWidth: 200, height:'100%'}}
        >
          <List >
            <ListItem button key="Device ID" onClick={onOpenDeviceIDSettings}>
              <ListItemText primary={deviceName} />
            </ListItem>
            <ListItem button key="MQTT Settings" onClick={onOpenMQTTSettings}>
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
                onChange={onToggleThemeChange}
                value="checkedB"
                color="secondary"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </div>
            <ListItem button key="Fullscreen" onClick={onFullscreen}>
              <ListItemText primary="Fullscreen" />
            </ListItem>
            <EyeTrackerSelector />
          </List>
          <List>
            <ListItem key="Version">
              <ListItemText primary="Version 1.0" />
            </ListItem>
           </List>
          <List>
            <ListItem button key="DummySet" onClick={onEmptySets}>
              <ListItemText primary="Empty Sets" />
            </ListItem>
            <ListItem button key="DummyLegacy" onClick={onEmptyLegacyTasks}>
              <ListItemText primary="Empty Legacy Tasks" />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <DeviceIDDialog openDeviceIDSettings={openDeviceIDSettings}
        closeDeviceIDSettings={onCloseDeviceIDSettings} myStorage={myStorage} />
      <MQTTDialog openMQTTSettings={openMQTTSettings}
        closeMQTTSettings={onCloseMQTTSettings} myStorage={myStorage}/>
      <SpeechDialog openSpeechSettings={openSpeechSettings}
        closeSpeechSettings={onCloseSpeechSettings} myStorage={myStorage}/>
    </span>
  );
}
export default Menu;
