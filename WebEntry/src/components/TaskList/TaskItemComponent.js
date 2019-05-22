import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import './TaskItemComponent.css';

class TaskItemComponent extends Component {
  render() {
    if (this.props.editable) {
      var editableButtons = <span className="handlingbuttons">
                              <Button className="buttons" size="small" onClick={()=>{}}>
                                <EditIcon />
                              </Button>
                              <Button className="buttons" size="small" onClick={()=>{
                                  this.props.removeCallback(this.props.task);
                                }}>
                                <DeleteIcon />
                              </Button>
                            </span>;
    } else {
      var editableButtons = null;
    }
    if(!this.props.placeholder) {
      return(
        <div className={"listItem "+this.props.highlight} onClick={()=>this.props.onSelectedCallback(this.props.task)}>
          {this.props.task.question}
          {this.props.task.name}
          {editableButtons}
          <p> TESTING COLLAPSE </p>
          <span className="handlingbuttons">
          <Button className="buttons" size="small" onClick={()=>{}}>
            <EditIcon />
          </Button>
          <Button className="buttons" size="small" onClick={()=>{
              this.props.removeCallback(this.props.task);
            }}>
            <DeleteIcon />
          </Button>
          </span>
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
