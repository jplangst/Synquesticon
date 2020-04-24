import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { withTheme } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import DragIcon from '@material-ui/icons/ControlCamera';
import { Typography } from '@material-ui/core';

import './TypeList.css';
import TaskTypeItem from './TypeItem';

const TaskClone = styled.div`
    display: flex;
    user-select: none;
    align-items: center;
    justify-content: center;
`;

const Clone = styled(TaskClone)`
    ~ div {
        transform: none !important;
    }
`;

const EditTaskTypeList = props => {
  const taskList = props.taskList;
  const { theme } = props;
  let bgColor = theme.palette.type === "light" ? theme.palette.primary.dark : theme.palette.primary.main;

  return(
    <Droppable droppableId={props.droppableId} isDropDisabled={true} >
      {(provided, snapshot) => (
      <div className="synquestitaskListComponentContainer" ref={provided.innerRef}>
        {
          taskList.map((item, index) => {
            const margin = index < taskList.length-1 ? " synquestiMargin":"";
            const clonedContent= <div
              className={"synquestiListItem " + margin} style={{backgroundColor:bgColor}}>
              <div className="synquestiListItemTextContainer" >
                <div className="synquestiListItemText">
                  <Typography color="textPrimary" noWrap> {item.label} </Typography>
                </div>
              </div>
              <div className="synquestiListItemDragBtnContainer" style={{backgroundColor:bgColor}}>
                <Button style={{cursor:'move',width: '100%', height: '100%', minWidth: '30px', minHeight: '30px'}}
                  className="synquestiListItemDragBtn" size="small" fullWidth >
                  <DragIcon className="synquestiDragBtnIcon"/>
                </Button>
              </div>
            </div>;

            return(
              <Draggable key={index} draggableId={item+index} index={index} shouldRespectForceTouch={false} isDragDisabled={!props.dragEnabled}>
              {(provided, snapshot) => (
                <React.Fragment>
                  <TaskTypeItem domRef={provided.innerRef} provided={provided} dragEnabled={props.dragEnabled}
                    isDragging={snapshot.isDragging} snapshot={snapshot}
                    placeholder={false} task={item} itemType={props.itemType}
                    handleDrop={props.dragDropCallback} content={item.label} marginClass={margin}
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

export default withTheme(EditTaskTypeList);