import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import RemoveIcon from '@material-ui/icons/ClearOutlined';
import RenameIcon from '@material-ui/icons/TextFormatOutlined';


import './AOIEditorComponent.css';

class SelectAOIToolBox extends Component {
  render() {
    return (
      <div>
        <Button variant="outlined" onClick={this.props.onRename} >
          Rename
          <RenameIcon />
        </Button>
        <Button variant="outlined" onClick={this.props.onRemove} >
          Remove
          <RemoveIcon />
        </Button>
      </div>
    );
  }

}

export default SelectAOIToolBox;
