import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import RemoveLastPointIcon from '@material-ui/icons/UndoOutlined';
import DoneIcon from '@material-ui/icons/DoneOutlined';
import CancelIcon from '@material-ui/icons/ClearOutlined';

import './AOIEditorComponent.css';

class PolygonToolBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Button onClick={this.props.onRemoveLastPoint} >
          <RemoveLastPointIcon />
        </Button>
        <Button onClick={this.props.onFinished} >
          <DoneIcon />
        </Button>
        <Button onClick={this.props.onCancel} >
          <CancelIcon />
        </Button>
      </div>
    );
  }

}

export default PolygonToolBox;
