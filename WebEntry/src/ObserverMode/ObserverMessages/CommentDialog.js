import React, { Component } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class CommentDialog extends Component {
  constructor(props){
    super(props);

    this.comment = "";
    this.onClosePressed = this.onClose.bind(this);
  }

  onClose(){
    this.props.closeDialog(this.comment);
  }

  render() {
    return(
      <Dialog
          open={this.props.openDialog}
          onClose={this.props.closeDialog}
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
              ref="taskCommentRef"
              fullWidth
              multiline
              rows="5"
              onChange={(e)=>{this.comment = e.target.value}}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={e => this.props.closeDialog("")} variant="outlined">
              Cancel
            </Button>
            <Button variant="outlined" onClick={this.onClosePressed}>
              Submit
            </Button>
          </DialogActions>
      </Dialog>
    );
  }
}

export default CommentDialog;
