import React, { Component } from 'react';

import './TaskItemComponent.css';

class TaskItemComponent extends Component {
  render() {
    if(!this.props.placeholder) {
      return(
        <div className="listItem" onClick={()=>this.props.onSelectedCallback(this.props.task)}>
          {this.props.task.question}
        </div>
      );
    }
    else {
      return (
        <div className="listItemPlaceholder">

        </div>
      );
    }
  }
}

export default TaskItemComponent;
