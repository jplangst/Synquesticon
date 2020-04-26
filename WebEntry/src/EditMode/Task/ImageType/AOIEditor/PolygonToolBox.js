import React from 'react';

import Button from '@material-ui/core/Button';

import RemoveLastPointIcon from '@material-ui/icons/UndoOutlined';
import DoneIcon from '@material-ui/icons/DoneOutlined';
import CancelIcon from '@material-ui/icons/ClearOutlined';

import './AOIEditorComponent.css';

const PolygonToolBox = props => {
  return (
    <div>
      <Button variant="outlined" onClick={props.onRemoveLastPoint}>
        Undo Point
        <RemoveLastPointIcon />
      </Button>
      <Button variant="outlined" onClick={props.onFinished} >
        Confirm
        <DoneIcon />
      </Button>
      <Button variant="outlined" onClick={props.onCancel} >
        Cancel
        <CancelIcon />
      </Button>
    </div>
  );
}

export default PolygonToolBox;