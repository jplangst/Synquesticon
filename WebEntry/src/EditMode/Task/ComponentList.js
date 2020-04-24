import React from 'react';
import Button from '@material-ui/core/Button';
import DragIcon from '@material-ui/icons/ControlCamera';
import DeleteIcon from '@material-ui/icons/Delete';
import { withTheme } from '@material-ui/styles';
import { Draggable } from 'react-beautiful-dnd';
import * as dnd from '../../core/beautifulDND.js';
import { Typography } from '@material-ui/core';

import CollapsableContainer from '../../components/Containers/CollapsableContainer';
import TaskComponentItem from './ComponentItem';
import './ComponentList.css';

var _id = 0;

const TaskComponentList = props => {
  const {theme} = props;
  let taskBgColor = theme.palette.type === "light" ? theme.palette.primary.main : theme.palette.primary.dark;

  const headerHeight = 40;

  if(props.taskComponents.length === 0){
    return <Typography variant='h5' color='textPrimary' style={{opacity:0.5, padding:5, marginLeft:5}}>{props.displayIfEmpty?props.displayIfEmpty:''}</Typography>;
  }
  const collapsableContent = props.taskComponents.map((comp, index) => {
    const dragSource =
    <div>
      <div className="editListItemDelBtnContainer">
        <Button style={{cursor:'pointer',width: '100%', height: headerHeight, minWidth: '30px', minHeight: '30px'}}
            size="small" onClick={ () => props.removeCallback(index)} >
          <DeleteIcon className="delBtnIcon"/>
        </Button>
      </div>
      <div className="editListItemDragBtnContainer">
        <Button style={{cursor:'move', width: '100%', height: headerHeight, minWidth: '30px', minHeight: '30px'}}
            size="small" >
          <DragIcon className="dragBtnIcon"/>
        </Button>
      </div>
    </div>;

    _id++;

    return(
      <Draggable key={"synquestitskListId"+index} draggableId={"synquestitskListId"+index} index={index} shouldRespectForceTouch={false}>
      {(provided, snapshot) => (
        <div className={"editSetListItem "} key={"synquestitskListId_item"+_id}
        ref={provided.innerRef}{...provided.draggableProps}
        style={{...dnd.getItemStyle(snapshot, provided.draggableProps.style, taskBgColor, taskBgColor, true),...{opacity:snapshot.isDragging?0.8:1}}}
        >
          <CollapsableContainer content={comp.displayContent} classNames="editSetCompContainer" stateChangeCallback={props.toggleChildCallback} index={index}
            contentClassNames="editSetCompContent" headerComponents={dragSource} dndDragHandle={provided.dragHandleProps} open={comp.openState} headerHeight={headerHeight}
            headerClassNames="editSetCompHeader" hideHeaderComponents={false} headerTitle={comp.label} snapshotT={snapshot}
            titleVariant="body1" indentContent={20} collasableStyles="contentOpen">
              <TaskComponentItem key={index} task={comp}/>
          </CollapsableContainer>
        </div>
      )}
      </Draggable>
    );
  });

  return <div style={{height:'100%', width:'100%', overflowY:'auto'}}>{collapsableContent}</div>;
}

export default withTheme(TaskComponentList);