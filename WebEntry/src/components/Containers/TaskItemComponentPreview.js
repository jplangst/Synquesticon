import React, { Component } from 'react';

import './TaskItemComponentPreview.css';

class TaskItemComponentPreview extends Component {
  render() {
    var content =
    <div style={{width: this.props.item.width, height: this.props.item.height}} className={"listItemPreview"}>
      <div className="listItemText dotLongText">
        {this.props.item.content}
      </div>
    </div>;

    return( content );
  }
}

export default TaskItemComponentPreview;
