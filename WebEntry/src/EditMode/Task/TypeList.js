import React, { Component } from 'react';

import TaskTypeItem from './TypeItem';

import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

import { withTheme } from '@material-ui/styles';

import './TypeList.css';

import Button from '@material-ui/core/Button';
import DragIcon from '@material-ui/icons/ControlCamera';
import { Typography } from '@material-ui/core';

/* Used to leave a visual clone behind during drag */
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

//================ React component ================
class EditTaskTypeList extends Component {
  constructor(props) {
    super(props);
    this.taskList = props.taskList;
  }

  //-----------Tasks------------
  render() {
    this.taskList = this.props.taskList;

    const { theme} = this.props;
    let bgColor = theme.palette.type === "light" ? theme.palette.primary.dark : theme.palette.primary.main;

    return(
      <Droppable droppableId={this.props.droppableId} isDropDisabled={true} >
       {(provided, snapshot) => (
        <div className="synquestitaskListComponentContainer" ref={provided.innerRef}>
          {
            this.taskList.map((item, index) => {
              var margin = index < this.taskList.length-1 ? " synquestiMargin":"";

              var clonedContent= <div
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
                <Draggable key={index} draggableId={item+index} index={index} shouldRespectForceTouch={false} isDragDisabled={!this.props.dragEnabled}>
                {(provided, snapshot) => (

                  <React.Fragment>
                    <TaskTypeItem domRef={provided.innerRef} provided={provided} dragEnabled={this.props.dragEnabled}
                      isDragging={snapshot.isDragging} snapshot={snapshot}
                      placeholder={false} task={item} itemType={this.props.itemType}
                      handleDrop={this.props.dragDropCallback} content={item.label} marginClass={margin}
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
}

export default withTheme(EditTaskTypeList);
