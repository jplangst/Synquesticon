import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import DragIcon from '@material-ui/icons/ControlCamera';

import './TaskItemComponent.css';

import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';

import * as dnd from '../../core/beautifulDND.js';

class TaskItemComponent extends Component {
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

    var dragButton = this.props.dragEnabled ? <div className="listItemDragBtnContainer" style={{backgroundColor:dragHighlight}}><Button style={{cursor:'move',width: '100%', height: '100%', minWidth: '30px', minHeight: '30px'}}
      className="listItemDragBtn" size="small" fullWidth >
      <DragIcon className="dragBtnIcon"/>
    </Button></div> : null;

    var dragStyle = dnd.getItemStyle( //Was style={backgroundColor:leftBG}
        snapshot.isDragging,
        provided.draggableProps.style,
        leftBG,
        leftBG
    );

    var content = <div ref={this.setRef}{...provided.draggableProps}{...provided.dragHandleProps}
      className={"listItem"} style={{...dragStyle, ...{opacity:opacityValue}}}
      onClick={()=>this.props.onSelectedCallback(this.props.task)}>
      <div className="listItemTextContainer" >
        <div className="listItemText">
          <Typography color="textPrimary" noWrap> {this.props.content} </Typography>
        </div>
      </div>
      {dragButton}
    </div>;

    return( content );
  }
}

export default withTheme(TaskItemComponent);
