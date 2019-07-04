import React, { Component } from 'react';

import './Header.css';

//Components
import CrossbarDialog from '../dialogs/CrossbarDialog';
import SpeechDialog from '../dialogs/SpeechDialog';

import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

//Icons
import Settings from '@material-ui/icons/Settings';
import BackArrowNavigation from '@material-ui/icons/ChevronLeft';

import store from '../../core/store';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      openCrossbarSettings: false,
      openSpeechSettings: false
    }

    this.closeCrossbarSettings = this.onCloseCrossbarSettings.bind(this);
    this.closeSpeechSettings = this.onCloseSpeechSettings.bind(this);
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


  //button click handlers
  openSettingsMenu() {
    this.setState({showMenu: true});
  }

  closeSettingsMenu(e) {
    this.setState({showMenu: false});
  }

  handleBackwardsNavigation(){
    this.props.history.goBack();
  }

  render() {
    if (store.getState().showHeader) {
      return(
        <AppBar position="sticky" style={{width:"100%", height:"6%"}}>
           <Toolbar variant="dense" position="absolute">
             <Button size="small" style={{width:"10px", height:"90%"}} onClick={this.handleBackwardsNavigation.bind(this)} >
               <BackArrowNavigation fontSize="large" className="headerIcon"/>
             </Button>
             <div className="spacer"/>
            <Button style={{width:"10px", height:"90%"}} onClick={this.openSettingsMenu.bind(this)} >
              <Settings fontSize="large" className="headerIcon"/>
            </Button>
          </Toolbar>

          <Drawer anchor="right" open={this.state.showMenu} onClose={this.closeSettingsMenu.bind(this)}>
            <div
              tabIndex={0}
              role="button"
              onClick={this.openSettingsMenu.bind(this)}
            >
              <List>
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
          <CrossbarDialog openCrossbarSettings={this.state.openCrossbarSettings} closeCrossbarSettings={this.closeCrossbarSettings}/>
          <SpeechDialog openSpeechSettings={this.state.openSpeechSettings} closeSpeechSettings={this.closeSpeechSettings}/>
        </AppBar>
      );
    }
    else {
      return <div />;
    }
  }
}
export default Header;
