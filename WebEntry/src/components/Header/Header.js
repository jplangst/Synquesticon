import React, { Component } from 'react';

import './Header.css';

//Components
import Menu from '../Menu/Menu';

import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

//Icons
import Settings from '@material-ui/icons/Settings';
import BackArrowNavigation from '@material-ui/icons/ChevronLeft';

import store from '../../core/store';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  handleBackwardsNavigation(){
    this.props.history.push("/");
  }

  render() {
    let storeState = store.getState();
    if (storeState.showHeader) {
      var fontSize = Math.max(28, Math.min(storeState.windowSize.height * 0.04, storeState.windowSize.width * 0.04));

      return(
          <AppBar style={{margin: 0, padding: 0, display:'flex', flexGrow: 1, flexShrink:1, position: 'relative', minHeight:50, maxHeight:'6%', width:'100%'}}>
            <Toolbar variant="dense" style={{margin: 0, padding: 0, display:'flex', flexDirection:'row', position:'relative', width:'100%', height:'100%'}}>
               <Button style={{display:'flex', position: 'relative', flexGrow: 1, flexShrink:1, minWidth:10, maxWidth:150, height:'100%'}}
                onClick={this.handleBackwardsNavigation.bind(this)} >
                 <BackArrowNavigation style={{display:'flex', position: 'absolute', height: '100%', width: 'auto', maxWidth: '100%', flexGrow: 1}} />
               </Button>
               <div style={{fontSize: fontSize}} className="AppName"><div className="centredHeaderTitle"> Synquesticon </div></div>
              <Menu/>
            </Toolbar>
          </AppBar>
      );
    }
    else { //If the header flag is False we return null
      return null;
    }
  }
}
export default Header;
