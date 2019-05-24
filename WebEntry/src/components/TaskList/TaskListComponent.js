import React, { Component } from 'react';
import Reorder, {reorderImmutable, reorderFromToImmutable} from 'react-reorder'; //{reorder, reorderFromTo}

//import Divider from '@material-ui/core/Divider';

import TaskItemComponent from './TaskItemComponent';

import './TaskListComponent.css';
//------------------------------------------------------------------------------
//TODO define a helper function instead, this gives a warning as native should not be extended like this
Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};
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

  onReorder (event, previousIndex, nextIndex, fromId, toId) {
    this.taskList.move(previousIndex, nextIndex);
    this.forceUpdate();
  }

  onReorderGroup (event, previousIndex, nextIndex, fromId, toId) {
    if (fromId === toId) {
      const list = reorderImmutable(this.taskList[fromId], previousIndex, nextIndex);

      this.setState({
        [fromId]: list
      });
    } else {
      const lists = reorderFromToImmutable({
        from: this.taskList[fromId],
        to: this.taskList[toId]
      }, previousIndex, nextIndex);

      this.setState({
        [fromId]: lists.from,
        [toId]: lists.to
      });
    }
  }

  render() {
    this.taskList = this.props.taskList;
    return (
      <Reorder
        reorderId={this.props.reorderID} // Unique ID that is used internally to track this list (required)
        //reorderGroup="reorder-group" // A group ID that allows items to be dragged between lists of the same group (optional)
        //getRef={this.storeRef.bind(this)} // Function that is passed a reference to the root node when mounted (optional)
        component="ul" // Tag name or Component to be used for the wrapping element (optional), defaults to 'div'
        placeholderClassName={this.props.placeholderName} // Class name to be applied to placeholder elements (optional), defaults to 'placeholder'
        draggedClassName="dragged" // Class name to be applied to dragged elements (optional), defaults to 'dragged'
        //lock="horizontal" // Lock the dragging direction (optional): vertical, horizontal (do not use with groups) //Was horizontal
        holdTime={500} // Default hold time before dragging begins (mouse & touch) (optional), defaults to 0
        touchHoldTime={500} // Hold time before dragging begins on touch devices (optional), defaults to holdTime
        mouseHoldTime={200} // Hold time before dragging begins with mouse (optional), defaults to holdTime
        onReorder={this.onReorder.bind(this)} // Callback when an item is dropped (you will need this to update your state)
        autoScroll={true} // Enable auto-scrolling when the pointer is close to the edge of the Reorder component (optional), defaults to true
        disabled={this.props.reorderDisabled} // Disable reordering (optional), defaults to false
        disableContextMenus={true} // Disable context menus when holding on touch devices (optional), defaults to true
        placeholder={
          <TaskItemComponent  placeholder={true} editable={this.props.editable}/> // Custom placeholder element (optional), defaults to clone of dragged element
        }
      >
      {
        this.taskList.map((item, index) => {
          var highlightBG = "";
          if(item == this.props.selectedTask){
            highlightBG = "highlightBG";
          }
          return <div key={index}><TaskItemComponent highlight={highlightBG} placeholder={false} task={item} startDragCallback={this.props.startDragCallback} onSelectedCallback={this.onSelectTask.bind(this)}/></div>
        })
      }
      </Reorder>
    );
  }
}

export default TaskListComponent;
