import React, { Component } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import { withTheme } from '@material-ui/styles';

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

    var buttonContainerHeight = 60;
    var buttonHeight = buttonContainerHeight - 4;
    var imageRow = [];
    var rowContent = [];

    return(
      <Dialog
          open={this.props.openDialog}
          onClose={this.props.closeDialog}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          maxWidth='md'
        >
          <DialogTitle style={{height:30}} id="form-dialog-title">Select Image</DialogTitle>
          <DialogContent style={{display:'flex', flexDirection:'row', flexGrow:1, minHeight:100, maxHeight:'80%', overflowY:'auto'}}>
          {
            this.state.images.map((img, ind) => {

              var url = "Images/" + img;

              var borderStyle=null;
              if (this.state.pickedImage === img) {
                borderStyle={borderWidth:3, borderStyle:'solid', borderColor:this.props.theme.palette.secondary.main};
              }


              rowContent.push(<img key={ind} src={url}
                          alt="Task" className="image"
                          style={borderStyle} key={"img"+ind}
                          onClick={(e) => this.onPickImage(img)}/>);

              if(ind+1%4==0){
                //return <span>imageRow</span>
                imageRow.push(<span key={"ispan"+ind}>{rowContent}</span>);
                rowContent=[];
              }
              if(this.state.images.length-1 === ind){
                if(rowContent.length > 0)
                  imageRow.push(<span key={"ispan"+ind}>{rowContent}</span>);
                return imageRow;
              }
            })
          }
          </DialogContent>
          <DialogActions style={{height:buttonContainerHeight}}>
            <Button style={{height:buttonHeight}} onClick={this.props.closeDialog} variant="outlined">
              CANCEL
            </Button>
            <Button style={{height:buttonHeight}} onClick={this.onOKAction.bind(this)} variant="outlined">
              OK
            </Button>
          </DialogActions>
      </Dialog>
    );
  }
}

export default withTheme(BrowseImagesDialog);
