import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import PlayIcon from '@material-ui/icons/PlayArrow';

import store from '../../core/store';

import './TaskItemComponent.css';

class PlayableSetComponent extends Component {
  render() {
    var buttonSize = store.getState().windowSize.width > 500 ? 40 : 20;


    var content =
        <div  className={"listItem "}>
          <div className="listItemTextContainer dotLongText">
            <div className="listItemText ">
              {this.props.content}
            </div>
          </div>
          <Button style={{display:'flex', position: 'relative', flexGrow: 1, flexShrink:1, minWidth:buttonSize, maxWidth:buttonSize}}
                  size="small" className="playableSetButton" >
            <EditIcon style={{display:'flex', position: 'absolute', maxHeight:25, width: '100%'}}/>
          </Button>
          <Button style={{display:'flex', position: 'relative', flexGrow: 1, flexShrink:1, minWidth:buttonSize, maxWidth:buttonSize, marginLeft:4}}
                  size="small" className="playableSetButton"
                  onClick={()=>{this.props.runSetCallback(this.props.task)}} >
            <PlayIcon style={{display:'flex', position: 'absolute', maxHeight:25, width: '100%'}}/>
          </Button>
        </div>;

    return( content );
  }
}

export default PlayableSetComponent;
