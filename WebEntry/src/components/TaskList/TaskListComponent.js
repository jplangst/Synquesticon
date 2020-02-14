import React, { Component } from 'react';

import TaskItemComponent from './TaskItemComponent';

import * as listUtils from '../../core/db_objects_utility_functions';

import * as dnd from '../../core/beautifulDND.js';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

import { withTheme } from '@material-ui/styles';

import './TaskListComponent.css';

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

//================ React component ================
class TaskListComponent extends Component {
  constructor(props) {
    super(props);
    this.taskList = props.taskList;
  }

  //-----------Tasks------------
  onSelectTask(e) {
    this.props.selectTask(e);
  }

  onRemoveTask(task) {
    var index = this.taskList.findIndex(x => x.question === task.question);
    this.taskList.splice(index, 1);
    this.props.removeTask(task);
    this.forceUpdate();
  }

  render() {
    this.taskList = this.props.taskList;

    const { theme} = this.props;
    let highlightColor = this.props.highlight ? theme.palette.secondary.main + "66" : null;
    let bgColor = theme.palette.type === "light" ? theme.palette.primary.dark : theme.palette.primary.main;

    return(
      <Droppable droppableId={this.props.droppableId} isDropDisabled={true} >
       {(provided, snapshot) => (
        <div className="taskListComponentContainer" ref={provided.innerRef}>
          {
            this.taskList.map((item, index) => {
              var highlightBG = "";
              if(item === this.props.selectedTask){
                highlightBG = "highlightBG";
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
                <Draggable key={item._id} draggableId={item._id} index={index} shouldRespectForceTouch={false} isDragDisabled={!this.props.dragEnabled}>
                {(provided, snapshot) => (

                  <React.Fragment>
                    <TaskItemComponent domRef={provided.innerRef} provided={provided} dragEnabled={this.props.dragEnabled} isDragging={snapshot.isDragging} snapshot={snapshot}
                      highlight={highlightBG} placeholder={false} task={item} itemType={this.props.itemType}
                      handleDrop={this.props.dragDropCallback} onSelectedCallback={this.onSelectTask.bind(this)} content={content}
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

export default withTheme(TaskListComponent);
