import React, { Component } from 'react';
import Reorder, {reorderImmutable, reorderFromToImmutable} from 'react-reorder'; //TODO decide if using this or only using the new drag and drop version

import EditSetListItemComponent from './EditSetListItemComponent';
import './EditSetListComponent.css';

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
class EditSetListComponent extends Component {
  constructor(props) {
    super(props);
    this.taskList = props.taskList;
  }

  render() {
    this.taskList = this.props.taskList;
    const { connectDropTarget, canDrop } = this.props

    return connectDropTarget(
      <div className="taskListComponentContainer">
        {
          this.taskList.map((item, index) => {
            return <div key={index}><EditSetListItemComponent task={item} itemType={this.props.itemType}
            handleDrop={this.props.dragDropCallback} removeCallback={this.props.removeTaskCallback}/></div>
          })
        }

      </div>
    );
  }
}

export default DropTarget(Types.ITEM, taskListTarget, collect)(EditSetListComponent);
