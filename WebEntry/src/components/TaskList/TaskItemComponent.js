import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import DragIcon from '@material-ui/icons/ControlCamera';
import './TaskItemComponent.css';

class TaskItemComponent extends Component {
  render() {
    if(!this.props.placeholder) {
      return(
        <div className={"listItem "+this.props.highlight} onClick={()=>this.props.onSelectedCallback(this.props.task)}>
          {this.props.task.question}
          {this.props.task.name}
          <Button className="buttons" size="small" onClick={()=>{
              this.props.startDragCallback(this.props.task);
            }}>
            <DragIcon />
          </Button>
        </div>
      );
    }
    else {
      return (
        <div className="listItemPlaceholder">
          {this.task}
        </div>
      );
    }
  }
}

export default TaskItemComponent;
