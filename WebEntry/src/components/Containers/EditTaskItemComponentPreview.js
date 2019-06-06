import React, { Component } from 'react';

import './EditTaskItemComponentPreview.css';

class EditTaskItemComponentPreview extends Component {

  constructor(props){
    super(props);
  }

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

export default EditTaskItemComponentPreview;
