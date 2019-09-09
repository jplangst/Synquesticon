import React, { Component } from 'react';

import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';

import './EditTaskItemComponentPreview.css';

class EditTaskItemComponentPreview extends Component {

  constructor(props){
    super(props);
  }

  render() {
    let theme = this.props.theme;
    var content =
    <div style={{width: this.props.item.width, height: this.props.item.height, backgroundColor:theme.palette.primary.main}}
      className={"listItemPreview"}>
      <div className="listItemText">
        <Typography noWrap color="textPrimary">{this.props.item.content}</Typography>
      </div>
    </div>;

    return( content );
  }
}

export default withTheme(EditTaskItemComponentPreview);
