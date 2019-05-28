import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import DragIcon from '@material-ui/icons/ControlCamera';

import './TaskItemComponent.css';

class TaskItemComponent extends Component {
  render() {
    if(!this.props.placeholder) {
      return(
        <div className={"listItem "} onClick={()=>this.props.onSelectedCallback(this.props.task)}>
          <div className={"listItemTextContainer " +this.props.highlight}>
            <div className="listItemText dotLongText">
              {this.props.task.question}
              {this.props.task.name}
            </div>
          </div>
          <div className="listItemDragBtnContainer">
            <Button style={{width: '100%', height: '100%', minWidth: '30px', minHeight: '30px'}}
              className="listItemDragBtn" size="small" fullWidth onClick={()=>{
                this.props.startDragCallback(this.props.task);
              }}>
              <DragIcon className="dragBtnIcon"/>
            </Button>
          </div>
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
