import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import PauseIcon from '@material-ui/icons/PauseCircleOutline';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';

import DataExportationComponent from '../components/Data/DataExportationComponent';

import ObserverMode from './ObserverMode';
import PlayerMode from './PlayerMode';

import wamp from '../core/wamp';

import './IntroductionScreen.css';
import './ObserverMode.css';

import ThemeProvider from '@material-ui/styles/ThemeProvider';
import { withTheme } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

class IntroductionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isParticipantsPaused: false
    }
    this.gotoPage = this.gotoPageHandler.bind(this);

    this.onPauseAllPressed = this.onPausePlayPressed.bind(this);
  }

  gotoPageHandler(route){
    this.props.history.push(route);
  }

  onPausePlayPressed(){
    wamp.broadcastCommands(JSON.stringify({
                            commandType: !this.state.isParticipantsPaused ? "PAUSE" : "RESUME",
                            participantId: -1
                           }));

    this.setState({
      isParticipantsPaused: !this.state.isParticipantsPaused
    });
  }

  render() {
    let theme = this.props.theme;

    var buttonIcon = null;
    var buttonLabel = "";
    if(!this.state.isParticipantsPaused){
      buttonIcon = <PauseIcon style={{display:'flex', position: 'relative', height: '100%', width:'25%'}} />;
      buttonLabel = "Pause all";
    }
    else{
      buttonIcon = <PlayIcon style={{display:'flex', position: 'relative', height: '100%', width: '25%'}} />;
      buttonLabel = "Resume all";
    }

    let leftBG = theme.palette.type === "light" ? theme.palette.primary.dark : theme.palette.primary.main;
    let rightBG = theme.palette.type === "light" ? theme.palette.primary.main : theme.palette.primary.dark;

    return(

    <div className="introductionScreenContainer">
      <div style={{backgroundColor:leftBG}} className="IntroViewer">
        <div style={{borderColor:'grey'}} className="IntroViewerTitle">
          <div className="IntroViewerTitleText"><Typography color="textPrimary" variant="h4">Studies</Typography></div>
          <Button className="IntroDataExportBtnContainer" onClick={(e) => this.gotoPage("EditorMode")}
            style={{borderLeftStyle:'solid', borderWidth:'thin', borderRadius: 10, borderColor:'grey'}}>
            <EditIcon />
          </Button>
        </div>
        <PlayerMode gotoPage={this.gotoPage.bind(this)}/>
      </div>
      <div style={{paddingLeft:5, backgroundColor:rightBG}} className="IntroContentWrapper">
        <div className="IntroContentTitle">
          <div className="IntroTitleText"><Typography color="textPrimary" variant="h4">Observer</Typography></div>
          <Button style={{display:'flex', position: 'relative', flexGrow: 1, width: 190,
                  borderRadius:10, borderColor:'#BDBDBD', borderWidth:'thin', borderLeftStyle:'solid'}}
           onClick={this.onPauseAllPressed}>
            {buttonLabel}
            {buttonIcon}
          </Button>
          <div className="IntroDataExportBtnContainer">
            <DataExportationComponent />
          </div>
        </div>
        <div className="IntroContent">
          <ObserverMode isParticipantsPaused={this.state.isParticipantsPaused}/>
        </div>
      </div>
    </div>
    );
  }
}
export default withTheme(IntroductionScreen);
