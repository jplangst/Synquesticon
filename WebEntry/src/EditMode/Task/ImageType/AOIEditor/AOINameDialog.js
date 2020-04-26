import React from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const AOINameDialog = props => {
  let name = "";

  const onClose = () => {
    if (name !== "") {
      props.closeDialog(name);
    }
  }

  name = props.name;
  var label = "";
  if (name !== "") {
    label = "Rename";
  } else {
    label = "Create";
  }

  return(
    <Dialog
        open={props.openDialog}
        onClose={props.closeDialog}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth='md'
      >
        <DialogTitle id="form-dialog-title" variant="h5">Enter AOI Name</DialogTitle>
        <DialogContent>
          <TextField
            required
            padding="dense"
            id="taskComment"
            defaultValue={name}
            label="Comment"
            fullWidth
            multiline
            rows="5"
            onChange={(e)=>{name = e.target.value}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={e => props.closeDialog("")} variant="outlined">
            Cancel
          </Button>
          <Button onClick={onClose} variant="outlined">
            {label}
          </Button>
        </DialogActions>
    </Dialog>
  );
}

export default AOINameDialog;