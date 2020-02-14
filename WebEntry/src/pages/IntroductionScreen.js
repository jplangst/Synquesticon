import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import PauseIcon from '@material-ui/icons/PauseCircleOutline';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';

import ObserverMode from './ObserverMode';
import PlayerMode from './PlayerMode';

import wamp from '../core/wamp';

import './IntroductionScreen.css';
import './ObserverMode.css';

import { withTheme } from '@material-ui/styles';

class IntroductionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isParticipantsPaused: false
    }
    this.gotoPage = this.gotoPageHandler.bind(this);

    //this.onPauseAllPressed = this.onPausePlayPressed.bind(this);
  }

  gotoPageHandler(route){
    this.props.history.push(route);
  }

  /*onPausePlayPressed(){
    wamp.broadcastCommands(JSON.stringify({
                            commandType: !this.state.isParticipantsPaused ? "PAUSE" : "RESUME",
                            participantId: -1
                           }));

    this.setState({
      isParticipantsPaused: !this.state.isParticipantsPaused
    });
  }*/

  render() {
    let theme = this.props.theme;

    var buttonIcon = null;
    var buttonLabel = "";
    if(!this.state.isParticipantsPaused){
      buttonIcon = <PauseIcon fontSize="large" />;
      buttonLabel = "Pause all";
    }
    else{
      buttonIcon = <PlayIcon fontSize="large" />;
      buttonLabel = "Resume all";
    }

    let leftBG = theme.palette.type === "light" ? theme.palette.primary.dark : theme.palette.primary.main;
    let rightBG = theme.palette.type === "light" ? theme.palette.primary.main : theme.palette.primary.dark;

    return(

    <div className="introductionScreenContainer">
      <div style={{backgroundColor:leftBG}} className="IntroViewer">
        <PlayerMode gotoPage={this.gotoPage.bind(this)}/>
      </div>
      <div style={{paddingLeft:5, backgroundColor:rightBG}} className="IntroContentWrapper">
        <Button style={{display:'flex', position: 'relative', left: 'calc(100% - 150px)', width: 150, height: 50,
                borderRadius:10, borderColor:'#BDBDBD', borderWidth:'thin', borderLeftStyle:'solid'}}
                onClick={this.onPauseAllPressed}>
          {buttonLabel}
          {buttonIcon}
        </Button>
        <div className="IntroContent">
          <ObserverMode isParticipantsPaused={this.state.isParticipantsPaused}/>
        </div>
      </div>
    </div>
    );
  }
}
export default withTheme(IntroductionScreen);
