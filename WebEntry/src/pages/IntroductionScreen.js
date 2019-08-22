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
      buttonIcon = <PauseIcon style={{display:'flex', position: 'absolute', height: '100%', width: 'auto', maxWidth: '100%', flexGrow: 1}} />;
    }
    else{
      buttonIcon = <PlayIcon style={{display:'flex', position: 'absolute', height: '100%', width: 'auto', maxWidth: '100%', flexGrow: 1}} />;
    }

    return(
    <div className="introductionScreenContainer">
      <div className = "AssetViewer">
        <div className="AssetViewerTitle">
          <div className="AssetViewerTitleText">Studies</div>
          <div className="EditorButton">
            <Button className="listItemDragBtnContainer" onClick={(e) => this.gotoPage("EditorMode")} >
              <EditIcon/>
            </Button>
          </div>
        </div>
        <PlayerMode gotoPage={this.gotoPage.bind(this)}/>
      </div>
      <div className = "AssetEditor">
        <div className="AssetViewerTitle">
          <div className="AssetViewerTitleText">Observer</div>
          <Button style={{display:'flex', position: 'relative', flexGrow: 1, flexShrink:1, minWidth:20, maxWidth:60, minHeight:20, maxHeight:60, marginRight: 300}}
           onClick={this.onPauseAllPressed}>
            {buttonIcon}
          </Button>
          <div className="listItemDragBtnContainer">
            <DataExportationComponent />
          </div>
        </div>
        <ObserverMode isParticipantsPaused={this.state.isParticipantsPaused}/>
      </div>
    </div>
    );
  }
}
export default IntroductionScreen;
