import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import RemoveIcon from '@material-ui/icons/ClearOutlined';
import RenameIcon from '@material-ui/icons/TextFormatOutlined';

import './AOIEditorComponent.css';

class SelectAOIToolBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Button onClick={this.props.onRename} >
          <RenameIcon />
        </Button>
        <Button onClick={this.props.onRemove} >
          <RemoveIcon />
        </Button>

      </div>
    );
  }

}

export default SelectAOIToolBox;
