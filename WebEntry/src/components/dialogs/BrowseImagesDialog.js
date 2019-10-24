import React, { Component } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import { Typography } from '@material-ui/core';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import db_helper from '../../core/db_helper';

import './BrowseImagesDialog.css';

class BrowseImagesDialog extends Component {
  constructor(props){
    super(props);
    this.state = {
      images: [],
      pickedImage: null
    }

  }

  componentWillMount() {
    db_helper.getAllImages((imgs) => {
      this.setState({
        images: imgs
      });
    })
  }

  handleClose() {
    this.setState({
      open: false
    });
  }

  onOKAction() {
    this.props.onPickImage(this.state.pickedImage);
  }

  onPickImage(img) {
    this.setState({
      pickedImage: img
    });
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
          <DialogTitle id="form-dialog-title">Select Image</DialogTitle>
          <DialogContent>
          {
            this.state.images.map((img, ind) => {
              var url = "Images/" + img;
              var className = "image";
              if (this.state.pickedImage === img) {
                className += " pickedImage";
              }
              console.log("classname", className);
              return <img key={ind} src={url}
                          alt="Task" className={className}
                          onClick={(e) => this.onPickImage(img)}/>
            })
          }
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.closeDialog} variant="outlined">
              CANCEL
            </Button>
            <Button onClick={this.onOKAction.bind(this)} variant="outlined">
              OK
            </Button>
          </DialogActions>
      </Dialog>
    );
  }
}

export default BrowseImagesDialog;
