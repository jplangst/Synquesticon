import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';

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
    }
    this.gotoPage = this.gotoPageHandler.bind(this);
  }

  gotoPageHandler(route){
    this.props.history.push(route);
  }

  render() {
    return(
    <div >
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
          <div className="listItemDragBtnContainer">
            <DataExportationComponent />
          </div>
        </div>
        <ObserverMode />
      </div>
    </div>
    );
  }
}
export default IntroductionScreen;
