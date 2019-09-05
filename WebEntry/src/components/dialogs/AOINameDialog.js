import React, { Component } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';

import { Typography } from '@material-ui/core';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class AOINameDialog extends Component {
  constructor(props){
    super(props);
    //this.closeDialogCallback = this.onClose.bind(this);
    this.name = "";

    this.onClosePressed = this.onClose.bind(this);
  }

  onClose(){
    if (this.name !== "") {
      this.props.closeDialog(this.name);
    }
  }

  render() {
    this.name = this.props.name;
    if (this.name !== "") {
      var label = "Rename";
    }
    else {
      var label = "Create";
    }
    return(
      <Dialog
          open={this.props.openDialog}
          onClose={this.props.closeDialog}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          maxWidth='md'
        >
          <DialogTitle id="form-dialog-title"><Typography variant="h5" color="textPrimary">Enter AOI's Name</Typography></DialogTitle>
          <DialogContent>
            <TextField
              required
              autoFocus
              margin="dense"
              id="taskComment"
              defaultValue={this.name}
              label="Comment"
              ref="taskCommentRef"
              fullWidth
              multiline
              rows="5"
              onChange={(e)=>{this.name = e.target.value}}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={e => this.props.closeDialog("")} variant="outlined">
              Cancel
            </Button>
            <Button onClick={this.onClosePressed} variant="outlined">
              {label}
            </Button>
          </DialogActions>
      </Dialog>
    );
  }
}

export default AOINameDialog;
