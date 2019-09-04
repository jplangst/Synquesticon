import React, { Component } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';

class PauseDialog extends Component {
  constructor(props){
    super(props);
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
          <DialogTitle id="form-dialog-title">Experimenter has paused the experiment</DialogTitle>
      </Dialog>
    );
  }
}

export default PauseDialog;
