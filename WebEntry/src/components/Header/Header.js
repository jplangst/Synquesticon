import React, { Component } from 'react';

import './Header.css';

//Components
import Menu from '../Menu/Menu';

import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';

//Icons
import Settings from '@material-ui/icons/Settings';
import BackArrowNavigation from '@material-ui/icons/ChevronLeft';

import store from '../../core/store';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false
    }
  }

  handleBackwardsNavigation(){
    this.props.history.push("/");
  }

  //button click handlers
  openSettingsMenu() {
    this.setState({showMenu: true});
  }

  closeSettingsMenu(e) {
    this.setState({showMenu: false});
  }

  render() {
    let storeState = store.getState();
    if (storeState.showHeader) {
      //var fontSize = Math.max(28, Math.min(storeState.windowSize.height * 0.04, storeState.windowSize.width * 0.04));

      return(
          <AppBar style={{ backgroundColor:this.props.theme.palette.primary.light, margin: 0, padding: 0, display:'flex', flexGrow: 1, flexShrink:1, position: 'relative', minHeight:50, maxHeight:'6%', width:'100%'}}>
            <Toolbar variant="dense" style={{margin: 0, padding: 0, display:'flex', flexDirection:'row', position:'relative', width:'100%', height:'100%'}}>
               <Button style={{display:'flex', position: 'relative', flexGrow: 1, flexShrink:1, minWidth:10, maxWidth:150, height:'100%'}}
                onClick={this.handleBackwardsNavigation.bind(this)} >
                 <BackArrowNavigation style={{display:'flex', position: 'absolute', height: '100%', width: 'auto', maxWidth: '100%', flexGrow: 1}} />
               </Button>
               <div className="AppName"><Typography color='textPrimary' variant="h3">Synquesticon</Typography></div>
               <Button style={{display:'flex', position: 'relative', flexGrow: 1, flexShrink:1, minWidth:10, maxWidth:150, height:"100%"}}
                 onClick={this.openSettingsMenu.bind(this)}>
                 <Settings size='large' style={{display:'flex', position: 'absolute', height: '100%', width: 'auto', maxWidth: '100%', flexGrow: 1}} />
               </Button>
              <Menu openSettingsMenu={this.openSettingsMenu.bind(this)}
                    closeSettingsMenu={this.closeSettingsMenu.bind(this)}
                    showMenu={this.state.showMenu}/>
            </Toolbar>
          </AppBar>
      );
    }
    else { //If the header flag is False we return null
      return null;
    }
  }
}
export default withTheme(Header);
