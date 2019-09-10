import React, { Component } from 'react';

import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';

import './TaskItemComponentPreview.css';

class TaskItemComponentPreview extends Component {
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

export default withTheme(TaskItemComponentPreview);
