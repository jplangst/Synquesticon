import React, { Component } from 'react';

import ObserverMode from './ObserverMode';
import PlayerMode from './PlayerMode';

import { Typography } from '@material-ui/core';

import wamp from '../core/wamp';

import './IntroductionScreen.css';

import { withTheme } from '@material-ui/styles';

class IntroductionScreen extends Component {
  constructor(props) {
    super(props);
    this.gotoPage = this.gotoPageHandler.bind(this);
  }

  gotoPageHandler(route){
    this.props.history.push(route);
  }

  render() {
    let theme = this.props.theme;
    let viewerBG = theme.palette.type === "light" ? theme.palette.primary.main : theme.palette.primary.dark;

    return(
    <div className="introductionScreenContainer">
      <div className="experimentsHeader" style={{backgroundColor:viewerBG}}>
        <Typography style={{marginLeft:20, marginTop:20}} variant="h4" color="textPrimary">Experiments</Typography>
      </div>
      <div style={{backgroundColor:viewerBG}} className="IntroViewer">
        <PlayerMode gotoPage={this.gotoPage.bind(this)}/>
      </div>
    </div>
    );
  }
}
export default withTheme(IntroductionScreen);
