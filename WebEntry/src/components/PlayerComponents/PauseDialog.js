import React from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Typography } from '@material-ui/core';

const PauseDialog = (props) => {
  return(
    <Dialog
        open={props.openDialog}
        onClose={props.closeDialog}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth='md'
      >
        <DialogTitle id="form-dialog-title" style={{ textAlign: 'center' }} disableTypography>
          <Typography variant="h4" color="textPrimary">{props.pauseMessage}</Typography>
        </DialogTitle>
    </Dialog>
  );
}

export default PauseDialog;
