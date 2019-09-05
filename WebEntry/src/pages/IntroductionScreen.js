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
    if(this.state.isParticipantsPaused){
      buttonIcon = <PauseIcon style={{display:'flex', position: 'absolute', height: '75%', width: 'auto', maxWidth: '75%', flexGrow: 1}} />;
    }
    else{
      buttonIcon = <PlayIcon style={{display:'flex', position: 'absolute', height: '75%', width: 'auto', maxWidth: '75%', flexGrow: 1}} />;
    }

    let bgColor = theme.palette.type === "light" ? theme.palette.secondary.dark : theme.palette.primary.dark;
    let textColor = theme.palette.type === "light" ? "textSecondary" : "textPrimary";

    return(
    <div className="introductionScreenContainer">
      <div style={{backgroundColor:theme.palette.primary.main}} className="IntroViewer">
        <div style={{borderColor:'grey'}} className="IntroViewerTitle">
          <div className="IntroViewerTitleText"><Typography color={textColor} variant="h5">Studies</Typography></div>
          <Button className="IntroDataExportBtnContainer" onClick={(e) => this.gotoPage("EditorMode")}
            style={{borderLeftStyle:'solid', borderWidth:'thin', borderRadius: 10, borderColor:'grey'}}>
            <EditIcon />
          </Button>
        </div>
        <PlayerMode gotoPage={this.gotoPage.bind(this)}/>
      </div>
      <div style={{paddingLeft:5, backgroundColor:theme.palette.primary.light}} className="IntroContentWrapper">
        <div className="IntroContentTitle">
          <div className="IntroTitleText"><Typography color="textPrimary" variant="h5">Observer</Typography></div>
          <Button style={{display:'flex', position: 'relative', flexGrow: 1, flexShrink:1,
                  borderRadius:10, borderColor:'#BDBDBD', borderWidth:'thin', borderLeftStyle:'solid'}}
           onClick={this.onPauseAllPressed}>
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
