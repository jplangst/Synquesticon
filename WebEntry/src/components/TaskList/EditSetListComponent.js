import React, { Component } from 'react';
//import Reorder, {reorderImmutable, reorderFromToImmutable} from 'react-reorder'; //TODO decide if using this or only using the new drag and drop version

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
    this.taskListObjects = props.taskListObjects;
  }

  render() {
    this.taskListObjects = this.props.taskListObjects;
    const { connectDropTarget } = this.props //, canDrop

    return connectDropTarget(
      <div className="taskListComponentContainer">
        {
          this.taskListObjects.map((item, index) => {
            var content = null;
            if(item.objType === "Task"){
              if(item.data.taskType === "Question" || item.data.taskType === "Complex"){
                content = item.data.question;
              }
              else if(item.data.taskType === "Instruction"){
                content = item.data.instruction;
              }
              else if(item.data.taskType === "Image"){
                content = item.data.question;
              }
            }
            else if(item.objType === "TaskSet"){
              content = item.data.name;
            }

            return <div key={index}><EditSetListItemComponent index={index} item={item} content={content} componentDepth={0}
            handleDrop={this.props.dragDropCallback} removeCallback={this.props.removeTaskCallback} moveTaskCallback={this.props.moveTaskCallback}/></div>
          })
        }
      </div>
    );
  }
}

export default DropTarget(Types.ITEM, taskListTarget, collect)(EditSetListComponent);
