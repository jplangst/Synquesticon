import React from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const CommentDialog = (props) => {
  let comment = "";

  const closeDialog = () => {
    props.closeCommentDialog(comment);
  }

  return(
  <Dialog
    open={props.isOpen}
    aria-labelledby="form-dialog-title"
    fullWidth={true}
    maxWidth='md'
  >
    <DialogTitle id="form-dialog-title" variant="h5">
      Write Comment
    </DialogTitle>
    <DialogContent>
      <TextField
        required
        padding="dense"
        id="taskComment"
        defaultValue=""
        label="Comment"
        fullWidth
        multiline
        rows="5"
        onChange={(e)=>{comment = e.target.value;}}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={closeDialog} variant="outlined">
        Cancel
      </Button>
      <Button  onClick={closeDialog} variant="outlined">
        Submit
      </Button>
    </DialogActions>
  </Dialog>
  );
}

export default CommentDialog;
