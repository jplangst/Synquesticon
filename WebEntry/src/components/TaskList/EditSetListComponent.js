import React, { Component } from 'react';

import EditSetListItemComponent from './EditSetListItemComponent';
import * as listUtils from '../../core/db_objects_utility_functions';

import { withTheme } from '@material-ui/styles';

import { Draggable } from 'react-beautiful-dnd';
import * as dnd from '../../core/beautifulDND.js';

class EditSetListComponent extends Component {
  constructor(props) {
    super(props);
    this.taskListObjects = props.taskListObjects;
  }

  render() {
    const {theme} = this.props;
    let taskBgColor = theme.palette.type === "light" ? theme.palette.primary.main : theme.palette.primary.dark;
    this.taskListObjects = this.props.taskListObjects;
    return(
      <div style={{width:'100%', height:'100%'}}>
        {
          this.taskListObjects.map((item, index) => {
            if(item === null){
              return item;
            }

            var content = listUtils.getTaskContent(item);

            return(
              <Draggable key={item._id+"setListId"+index} draggableId={item._id+"setListId"+index} index={index} shouldRespectForceTouch={false}>
              {(provided, snapshot) => (
                <div className={"editSetListItem "} key={item._id+"setListId_item"+index}
                ref={provided.innerRef}{...provided.draggableProps}{...provided.dragHandleProps}
                style={{...dnd.getItemStyle(snapshot.isDragging, provided.draggableProps.style, taskBgColor, taskBgColor),...{opacity:snapshot.isDragging?0.8:1}}}
                >
                  <EditSetListItemComponent index={index} item={item} content={content} componentDepth={0}
                  handleDrop={this.props.dragDropCallback} removeCallback={this.props.removeTaskCallback} moveTaskCallback={this.props.moveTaskCallback}/>
                </div>
              )}
              </Draggable>
            )
          })
        }
      </div>);
  }
}

export default withTheme(EditSetListComponent);
