import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import DragIcon from '@material-ui/icons/ControlCamera';

import './TypeList.css';

import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';

import * as dnd from '../../core/beautifulDND.js';

class TaskTypeItem extends Component {
  setRef = ref => {
    // keep a reference to the dom ref as an instance property
    this.ref = ref;
    // give the dom ref to react-beautiful-dnd
    this.props.domRef(ref);
  };

  render() {
    const { theme, provided, isDragging, snapshot} = this.props;

    //let bgColor = this.props.highlight ? theme.palette.secondary.main + "66" : null;
    let leftBG = theme.palette.type === "light" ? theme.palette.primary.dark : theme.palette.primary.main;
    let dragHighlight = isDragging ? theme.palette.secondary.main + "66" : leftBG;
    const opacityValue = isDragging ? 0.8 : 1;
    if(provided === undefined){
      return null;
    }

    let highlightColor = null;
    if(this.props.highlight){
      highlightColor = {backgroundColor:theme.palette.secondary.main + "66"};
    }

    var dragButton = this.props.dragEnabled ? <div className="synquestiListItemDragBtnContainer" style={{backgroundColor:dragHighlight}}><Button style={{cursor:'move',width: '100%', height: '100%', minWidth: '30px', minHeight: '30px'}}
      className="synquestiListItemDragBtn" size="small" fullWidth >
      <DragIcon className="synquestiDragBtnIcon"/>
    </Button></div> : null;

    var dragStyle = dnd.getItemStyle(
        snapshot.isDragging,
        provided.draggableProps.style,
        leftBG,
        leftBG
    );

    var content = <div ref={this.setRef}{...provided.draggableProps}{...provided.dragHandleProps}
      className={"synquestiListItem " + this.props.marginClass} style={{...dragStyle, ...{opacity:opacityValue},...highlightColor}}>
      <div className="synquestiListItemTextContainer" >
        <div className="synquestiListItemText">
          <Typography color="textPrimary" noWrap> {this.props.content} </Typography>
        </div>
      </div>
      {dragButton}
    </div>;

    return( content );
  }
}

export default withTheme(TaskTypeItem);
