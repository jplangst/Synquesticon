import React from 'react';

import Button from '@material-ui/core/Button';

import RemoveIcon from '@material-ui/icons/ClearOutlined';
import RenameIcon from '@material-ui/icons/TextFormatOutlined';


import './AOIEditorComponent.css';

const SelectAOIToolBox = props => {
  return (
    <div>
      <Button variant="outlined" onClick={props.onRename} >
        Rename
        <RenameIcon />
      </Button>
      <Button variant="outlined" onClick={props.onRemove} >
        Remove
        <RemoveIcon />
      </Button>
    </div>
  );
}

export default SelectAOIToolBox;