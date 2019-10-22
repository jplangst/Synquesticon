import React, { Component } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Typography } from '@material-ui/core';

class PauseDialog extends Component {
  render() {
    return(
      <Dialog
          open={this.props.openDialog}
          onClose={this.props.closeDialog}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          maxWidth='md'
        >
          <DialogTitle id="form-dialog-title"><Typography variant="h5" color="textPrimary">Experimenter has paused the experiment</Typography></DialogTitle>
      </Dialog>
    );
  }
}

export default PauseDialog;
