import React, { useState, useEffect } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import { withTheme } from '@material-ui/styles';

import Button from '@material-ui/core/Button';

import db_helper from '../../../core/db_helper';

import './BrowseImagesDialog.css';

const BrowseImagesDialog = (props) => {
  const [images, setImages] = useState([]);
  const [pickedImage, setPickedImage] = useState(null);

  useEffect( () => {
    db_helper.getAllImages((imgs) => setImages(imgs));
  }, []);
  

  var buttonContainerHeight = 60;
  var buttonHeight = buttonContainerHeight - 4;
  var imageRow = [];
  var rowContent = [];

  return(
    <Dialog
        open={props.openDialog}
        onClose={props.closeDialog}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth='md'
      >
        <DialogTitle style={{height:30}} id="form-dialog-title">Select Image</DialogTitle>
        <DialogContent style={{display:'flex', flexDirection:'row', flexGrow:1, minHeight:100, maxHeight:'80%', overflowY:'auto'}}>
        {
          images.map((img, ind) => {
            var url = "Images/" + img;

            var borderStyle=null;
            if (pickedImage === img) {
              borderStyle={borderWidth:3, borderStyle:'solid', borderColor:props.theme.palette.secondary.main};
            }
            
            rowContent.push(<img src={url}
                        alt="Task" className="image"
                        style={borderStyle} key={"img"+ind}
                        onClick={() => setPickedImage(img)}/>);

            if(ind+1%4===0){
              imageRow.push(<span key={"ispan"+ind}>{rowContent}</span>);
              rowContent=[];
            }

            if(images.length-1 === ind){
              if(rowContent.length > 0)
                imageRow.push(<span key={"ispan"+ind}>{rowContent}</span>);
              return imageRow;
            }

            return null;
          })
        }
        </DialogContent>
        <DialogActions style={{height:buttonContainerHeight}}>
          <Button style={{height:buttonHeight}} onClick={props.closeDialog} variant="outlined">
            CANCEL
          </Button>
          <Button style={{height:buttonHeight}} onClick={() => props.onPickImage(pickedImage)} variant="outlined">
            OK
          </Button>
        </DialogActions>
    </Dialog>
  );
}

export default withTheme(BrowseImagesDialog);
