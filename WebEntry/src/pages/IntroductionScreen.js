import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import PauseIcon from '@material-ui/icons/PauseCircleOutline';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';

import DataExportationComponent from '../components/Data/DataExportationComponent';

import ObserverMode from './ObserverMode';
import PlayerMode from './PlayerMode';

import db_helper from '../core/db_helper.js';

import './IntroductionScreen.css';
import './ObserverMode.css';

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
    //TODO send WAMP message here. This will be for all participants
    //
    this.setState({
      isParticipantsPaused: !this.state.isParticipantsPaused
    });
  }

  render() {
    var buttonIcon = null;
    if(this.state.isParticipantsPaused){
      buttonIcon = <PauseIcon style={{display:'flex', position: 'absolute', height: '75%', width: 'auto', maxWidth: '75%', flexGrow: 1}} />;
    }
    else{
      buttonIcon = <PlayIcon style={{display:'flex', position: 'absolute', height: '75%', width: 'auto', maxWidth: '75%', flexGrow: 1}} />;
    }

    return(
    <div className="introductionScreenContainer">
      <div className = "IntroViewer">
        <div className="IntroViewerTitle">
          <div className="IntroViewerTitleText">Studies</div>
          <Button className="IntroDataExportBtnContainer" onClick={(e) => this.gotoPage("EditorMode")}
            style={{borderLeftStyle:'solid', borderWidth:'thin', borderRadius: 10, borderColor:'#BDBDBD'}}>
            <EditIcon/>
          </Button>
        </div>
        <PlayerMode gotoPage={this.gotoPage.bind(this)}/>
      </div>
      <div className = "IntroContentWrapper">
        <div className="IntroContentTitle">
          <div className="IntroTitleText">Observer</div>
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
export default IntroductionScreen;
