import React, { Component } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend'
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import PlayIcon from '@material-ui/icons/PlayArrow';

import './TaskItemComponent.css';
import './PlayableSetComponent.css';

import { DragSource } from 'react-dnd'

const Types = {
 ITEM: 'taskItemComp'
}

class PlayableSetComponent extends Component {
  render() {
    var content = <div  className={"listItem "}>
          <div className="listItemTextContainer ">
            <div className="listItemText dotLongText">
              {this.props.content}
            </div>
          </div>
          <div className="playableSetIconContainer">
            <Button style={{width: '50%', height: '100%', minWidth: '30px', minHeight: '30px'}}
                    size="small" className="playableSetButton" >
              <EditIcon className="playButtonIcon"/>
            </Button>
            <Button style={{width: '50%', height: '100%', minWidth: '30px', minHeight: '30px'}}
                    size="small" className="playableSetButton"
                    onClick={()=>{this.props.runSetCallback(this.props.task)}} >
              <PlayIcon className="playButtonIcon"/>
            </Button>
          </div>
        </div>;

    return( content );
  }
}

export default PlayableSetComponent;
