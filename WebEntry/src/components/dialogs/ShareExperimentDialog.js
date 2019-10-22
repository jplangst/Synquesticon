import React, { Component } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { Typography } from '@material-ui/core';

class ShareExperimentDialog extends Component {
  constructor(props){
    super(props);
    this.state = {
      openSnackBar: false
    }
  }

  copyToClipboard(e) {
    navigator.clipboard.writeText(this.props.link);

    this.setState({
      openSnackBar: true
    });
  }

  handleCloseSnackbar(event, reason){
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      openSnackBar: false
    });
  };

  render() {
    return(
      <div>
        <Dialog
            open={this.props.openDialog}
            onClose={this.props.closeDialog}
            aria-labelledby="form-dialog-title"
            fullWidth={true}
            maxWidth='md'
          >
            <DialogTitle id="form-dialog-title">
              <Typography variant="h5" color="textPrimary">Share</Typography>
            </DialogTitle>
            <DialogContent>
               <Typography variant="h5" color="textPrimary">Link sharing</Typography>
               <div>
               <Typography variant="h5" color="textPrimary" >
                  {this.props.link}
                </Typography>
                <Button variant="outlined" onClick={this.copyToClipboard.bind(this)}
                        style={{paddingLeft:4}}>
                  Copy link
                </Button>
               </div>
            </DialogContent>
            <DialogActions>
               <Button variant="outlined" onClick={this.props.closeDeviceIDSettings}>
                 Done
               </Button>
            </DialogActions>
        </Dialog>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.openSnackBar}
          autoHideDuration={2000}
          onClose={this.handleCloseSnackbar.bind(this)}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Link copied to clipboard</span>}
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={this.handleCloseSnackbar.bind(this)}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

export default ShareExperimentDialog;
