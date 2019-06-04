import React, { Component } from 'react';
import Reorder, {reorderImmutable, reorderFromToImmutable} from 'react-reorder'; //{reorder, reorderFromTo}

import TaskItemComponent from './TaskItemComponent';
import './TaskListComponent.css';

import { DropTarget } from 'react-dnd'
const Types = {
 ITEM: 'taskItemComp'
}

const taskListTarget = {

  drop(props, monitor, component){
    return props;
  },

  canDrop(props, monitor) {
    return props.reactDND;
  }
};

function collect(connect, monitor) {
 return {
   canDrop: monitor.canDrop(),
   connectDropTarget: connect.dropTarget()
 }
}



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

  render() {
    this.taskList = this.props.taskList;
    const { connectDropTarget, canDrop } = this.props

    return connectDropTarget(
      <div className="taskListComponentContainer">

        {
          this.taskList.map((item, index) => {
            var highlightBG = "";
            if(item === this.props.selectedTask){
              highlightBG = "highlightBG";
            }
            return <div key={index}><TaskItemComponent highlight={highlightBG} placeholder={false} task={item} itemType={this.props.itemType}
            handleDrop={this.props.dragDropCallback} onSelectedCallback={this.onSelectTask.bind(this)}/></div>
          })
        }

      </div>
    );
  }
}

export default DropTarget(Types.ITEM, taskListTarget, collect)(TaskListComponent);
