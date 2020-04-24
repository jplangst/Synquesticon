import React from 'react';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import PlayIcon from '@material-ui/icons/PlayArrow';
import LinkIcon from '@material-ui/icons/Link';
import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';

import store from '../../core/store';

import './PlayableSet.css';

const PlayableSet = (props) => {
  const buttonSize = store.getState().windowSize.width > 500 ? 40 : 20;
  const textColor = props.theme.palette.type === "light" ? "textSecondary" : "textPrimary";

  const content =
    <div className={"listItem "}>
      <div className="listItemTextContainer dotLongText">
        <div className="listItemText ">
          <Typography color={textColor} noWrap variant="body1" >{props.content}</Typography>
        </div>
      </div>
      <Button style={{display:'flex', position: 'relative', flexGrow: 1, flexShrink:1, marginRight:10,minWidth:buttonSize, maxWidth:buttonSize}}
              size="small" className="playableSetButton"
              onClick={()=>{props.editSetCallback(props.task)}}>
        <EditIcon fontSize="default"/>
      </Button>
      <Button style={{display:'flex', position: 'relative', flexGrow: 1, flexShrink:1, marginRight:10,minWidth:buttonSize, maxWidth:buttonSize}}
              size="small" className="playableSetButton"
              onClick={()=>{props.getLinkCallback(props.task)}}>
        <LinkIcon fontSize="default"/>
      </Button>
      <Button style={{display:'flex', position: 'relative', flexGrow: 1, flexShrink:1, minWidth:buttonSize, maxWidth:buttonSize, paddingLeft:4}}
              size="small" className="playableSetButton"
              onClick={()=>{props.runSetCallback(props.task)}} >
        <PlayIcon fontSize="default"/>
      </Button>
    </div>;

    return( content );
}

export default withTheme(PlayableSet);
