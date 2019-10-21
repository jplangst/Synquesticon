import React, { Component } from 'react';

import EditSetListItemComponent from './EditSetListItemComponent';
import * as listUtils from '../../core/db_objects_utility_functions';

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
   connectDropTarget: connect.dropTarget(),
   isOver: monitor.isOver()
 }
}

class EditSetListComponent extends Component {
  constructor(props) {
    super(props);
    this.taskListObjects = props.taskListObjects;
  }

  render() {
    this.taskListObjects = this.props.taskListObjects;
    const { connectDropTarget } = this.props;

    return connectDropTarget(
      <div style={{width:'100%', height:'100%'}}>
        {
          this.taskListObjects.map((item, index) => {
            var content = listUtils.getTaskContent(item);

            return <div className={"editSetListItem "} key={index}><EditSetListItemComponent index={index} item={item} content={content} componentDepth={0}
            handleDrop={this.props.dragDropCallback} removeCallback={this.props.removeTaskCallback} moveTaskCallback={this.props.moveTaskCallback}/></div>
          })
        }
      </div>
    );
  }
}

export default DropTarget(Types.ITEM, taskListTarget, collect)(EditSetListComponent);
