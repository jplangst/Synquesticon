import React, { Component } from 'react';

import './Header.css';

//Components
import Menu from '../Menu/Menu';
import DataExportationComponent from '../Data/DataExportationComponent';

import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';
import {withRouter} from 'react-router-dom';

//Icons
import Settings from '@material-ui/icons/Settings';
import EditIcon from '@material-ui/icons/Edit';
import PlayIcon from '@material-ui/icons/PlayArrow';

import store from '../../core/store';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false
    }

    this.gotoPage = this.gotoPageHandler.bind(this);
  }

  gotoPageHandler(route){
    this.props.history.push(route);
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

  getModeButtons(){
    var activeColor = this.props.theme.palette.secondary.main+"66";
    var modeButtons = [];
    modeButtons.push(
      <Button key="/"
        style={{display:'flex', position: 'relative', flexGrow: 1, flexShrink:1, minWidth:10, maxWidth:100, height:'100%',
              backgroundColor:this.props.history.location.pathname==="/"?activeColor:""}}
       onClick={this.handleBackwardsNavigation.bind(this)} >
        <PlayIcon fontSize='large'/>
      </Button>);
    modeButtons.push(
      <Button key="/EditorMode"
        className="IntroDataExportBtnContainer" onClick={(e) => this.gotoPage("EditorMode")}
        style={{display:'flex', position: 'relative', flexGrow: 1, flexShrink:1, minWidth:10, maxWidth:100, height:"100%",
              backgroundColor:this.props.history.location.pathname.includes("/EditorMode")?activeColor:""}}>
        <EditIcon fontSize='large' />
      </Button>);
    return modeButtons;
  }

  render() {
    let storeState = store.getState();
    if (storeState.showHeader) {
      return(
          <AppBar style={{ backgroundColor:this.props.theme.palette.primary.light, padding: 0, display:'flex', flexGrow: 1, position: 'relative', minHeight:50, maxHeight:'6%', width:'100%'}}>
            <Toolbar variant="dense" style={{padding: 0, display:'flex', flexDirection:'row', position:'relative', width:'100%', height:'100%'}}>
               {this.getModeButtons()}

               <div className="AppName"><Typography color='textPrimary' variant="h3">Synquesticon</Typography></div>

               <DataExportationComponent exportButtonStyle={{display:'flex', position: 'relative', flexGrow: 1, flexShrink:1, minWidth:10, maxWidth:100, height:"100%"}}/>
               <Button style={{display:'flex', position: 'relative', flexGrow: 1, flexShrink:1, minWidth:10, maxWidth:100, height:"100%"}}
                 onClick={this.openSettingsMenu.bind(this)}>
                 <Settings fontSize='large' />
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
export default withRouter(withTheme(Header));
