import React from 'react';

import EditSetListItem from './ListItem';
import * as listUtils from '../../core/db_objects_utility_functions';

import { withTheme } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { Draggable } from 'react-beautiful-dnd';
import * as dnd from '../../core/beautifulDND.js';

const EditSetList = (props) => {
  const {theme} = props;
  const taskBgColor = theme.palette.type === "light" ? theme.palette.primary.main : theme.palette.primary.dark;

  if (props.taskListObjects.length === 0) {
    return <Typography variant='h5' color='textPrimary' style={{opacity:0.5, padding:5, marginLeft:5}}>{props.displayIfEmpty?props.displayIfEmpty:''}</Typography>;
  }
  const collapsableContent = props.taskListObjects.map((item, index) => {
    if(item === null){
      return item;
  }
  const content = listUtils.getTaskContent(item);

  return(
    <Draggable key={item._id+"setListId"+index} draggableId={item._id+"setListId"+index} index={index} shouldRespectForceTouch={false}>
    {(provided, snapshot) => (
      <div className={"editSetListItem "} key={item._id+"setListId_item"+index}
      ref={provided.innerRef}{...provided.draggableProps}{...provided.dragHandleProps}
      style={{...dnd.getItemStyle(snapshot.isDragging, provided.draggableProps.style, taskBgColor, taskBgColor),...{opacity:snapshot.isDragging?0.8:1}}}
      >
        <EditSetListItem index={index} item={item} content={content} componentDepth={0}
        handleDrop={props.dragDropCallback} removeCallback={props.removeTaskCallback} moveTaskCallback={props.moveTaskCallback}/>
      </div>
    )}
    </Draggable>
  )
  });

  return(<div style={{width:'100%', height:'100%'}}>{collapsableContent}</div>);
}

export default withTheme(EditSetList);
