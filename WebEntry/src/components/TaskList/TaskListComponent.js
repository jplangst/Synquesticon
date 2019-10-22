import React, { Component } from 'react';

import TaskItemComponent from './TaskItemComponent';

import * as listUtils from '../../core/db_objects_utility_functions';

import './TaskListComponent.css';

//================ Define the drop target behaviour ================
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
    const { connectDropTarget } = this.props; //, canDrop

    return connectDropTarget(
      <div className="taskListComponentContainer">
        {
          this.taskList.map((item, index) => {
            var highlightBG = "";
            if(item === this.props.selectedTask){
              highlightBG = "highlightBG";
            }

            var content = listUtils.getTaskContent(item);

            return <div key={index}><TaskItemComponent highlight={highlightBG} placeholder={false} task={item} itemType={this.props.itemType}
            handleDrop={this.props.dragDropCallback} onSelectedCallback={this.onSelectTask.bind(this)} content={content} /></div>
          })
        }

      </div>
    );
  }
}

//====================== Export with Drop Target behaviour ====================
export default DropTarget(Types.ITEM, taskListTarget, collect)(TaskListComponent);
