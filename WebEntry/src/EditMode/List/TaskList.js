import React from 'react';

import TaskItem from './TaskItem';

import * as listUtils from '../../core/db_objects_utility_functions';

import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

import { withTheme } from '@material-ui/styles';

import './TaskList.css';

import Button from '@material-ui/core/Button';
import DragIcon from '@material-ui/icons/ControlCamera';
import { Typography } from '@material-ui/core';

/* Used to leave a visual clone behind during drag */
const TaskClone = styled.div`
    display: flex;
    user-select: none;
    align-items: flex-start;
    align-content: flex-start;
`;

const Clone = styled(TaskClone)`
    ~ div {
        transform: none !important;
    }
`;

const TaskList = props => {
  const onSelectTask = (e) => {
    props.selectTask(e);
  }

  const { theme } = props;
  let bgColor = theme.palette.type === "light" ? theme.palette.primary.dark : theme.palette.primary.main;

  return(
    <Droppable droppableId={props.droppableId} isDropDisabled={true} >
      {(provided, snapshot) => (
      <div className="taskListComponentContainer" ref={provided.innerRef}>
        {
          props.taskList.map((item, index) => {
            var highlightBG = null;
            if(props.selectedTask && item && item._id === props.selectedTask._id){
              highlightBG = true;
            }

            var content = listUtils.getTaskContent(item);
            var clonedContent= <div
              className={"listItem"} style={{backgroundColor:bgColor}}>
              <div className="listItemTextContainer" >
                <div className="listItemText">
                  <Typography color="textPrimary" noWrap> {content} </Typography>
                </div>
              </div>
              <div className="listItemDragBtnContainer" style={{backgroundColor:bgColor}}>
                <Button style={{cursor:'move',width: '100%', height: '100%', minWidth: '30px', minHeight: '30px'}}
                  className="listItemDragBtn" size="small" fullWidth >
                  <DragIcon className="dragBtnIcon"/>
                </Button>
              </div>
            </div>;

            return(
              <Draggable key={item._id + props.idSuffix} draggableId={item._id + '_' + props.idSuffix}
                index={index} shouldRespectForceTouch={false} isDragDisabled={!props.dragEnabled}>
              {(provided, snapshot) => (
                <React.Fragment>
                  <TaskItem domRef={provided.innerRef} provided={provided} dragEnabled={props.dragEnabled}
                    isDragging={snapshot.isDragging} snapshot={snapshot}
                    highlight={highlightBG} placeholder={false} task={item} itemType={props.itemType}
                    handleDrop={props.dragDropCallback} onSelectedCallback={onSelectTask} content={content}
                  />
                  {snapshot.isDragging && (
                    <Clone>{clonedContent}</Clone>
                  )}
                </React.Fragment>
              )}
              </Draggable>
            );
          })}
            <div style={{display: 'none'}}>{provided.placeholder}</div>
        </div>
    )}
    </Droppable>
  );
}

export default withTheme(TaskList);