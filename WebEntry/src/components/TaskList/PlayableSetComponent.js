import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import PlayIcon from '@material-ui/icons/PlayArrow';
import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';

import store from '../../core/store';

import './TaskItemComponent.css';

class PlayableSetComponent extends Component {
  render() {
    var buttonSize = store.getState().windowSize.width > 500 ? 40 : 20;
    let textColor = this.props.theme.palette.type === "light" ? "textSecondary" : "textPrimary";

    var editButton = this.props.showEditButton ? <Button style={{display:'flex', position: 'relative', flexGrow: 1, flexShrink:1, minWidth:buttonSize, maxWidth:buttonSize}}
            size="small" className="playableSetButton" >
      <EditIcon style={{display:'flex', position: 'absolute', minHeight:'25', maxHeight:25, width: '100%'}}/>
    </Button> : null;

    var content =
        <div  className={"listItem "}>
          <div className="listItemTextContainer dotLongText">
            <div className="listItemText ">
              <Typography color={textColor} noWrap variant="body1" >{this.props.content}</Typography>
            </div>
          </div>
          {editButton}
          <Button style={{display:'flex', position: 'relative', flexGrow: 1, flexShrink:1, minWidth:buttonSize, maxWidth:buttonSize, paddingLeft:4}}
                  size="small" className="playableSetButton"
                  onClick={()=>{this.props.runSetCallback(this.props.task)}} >
            <PlayIcon fontSize="default"/>
          </Button>
        </div>;

    return( content );
  }
}

export default withTheme(PlayableSetComponent);
