import React, { Component } from 'react';
import FileSelector from '../../../core/fileSelector';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Button from '@material-ui/core/Button';

import AOIEditorComponent from './AOIEditor/AOIEditorComponent';
import BrowseImagesDialog from './BrowseImagesDialog';

import './ImageType.css';

class ImageTaskType extends Component {
  constructor(props){
    super(props);
    console.log("image task", this.props.task);
    this.state = { //We keep these fields in the state as they affect how the component is rendered
      selectedImage: this.props.task ? this.props.task.image : "",
      recordClicks: this.props.task ? this.props.task.recordClicks : false,
      fullScreenImage: this.props.task ? this.props.task.fullScreenImage : false,
      showAOIs: this.props.task ? this.props.task.showAOIs : false,
      openBrowseImage: false,
    };

    this.preview = false;
    this.image = null;

    this.responseHandler = this.onResponsesChanged;
    this.handleImageSelectedCallback = this.onImageFileSelected.bind(this);
    this.handleRecordClickCallback = this.onRecordClickChanged.bind(this);
    this.handleShowFullScreenCallback = this.onShowFullScreenChanged.bind(this);
    this.handleShowAOIsCallback = this.onShowAOIsChanged.bind(this);
  }

  onRecordClickChanged(e, checked){
    this.props.task.recordClicks = checked;
    this.setState({
      recordClicks: checked,
    });
  }

  onShowFullScreenChanged(e, checked){
    this.props.task.fullScreenImage = checked;
    this.setState({
      fullScreenImage: checked,
    });
  }

  onShowAOIsChanged(e, checked){
    this.props.task.showAOIs = checked;
    this.setState({
      showAOIs: checked,
    });
  }

  onImageFileSelected(selectedFile){
    this.props.task.image = selectedFile.name;
    this.image = selectedFile;
    this.props.task.aois = [];
    this.preview = true;
    this.props.selectImageCallback(true, this.image);
    this.setState({selectedImage: this.props.task.image});
  }

  onPickImageBrowseImages(img) {
    this.props.task.image = img;
    this.image = null;
    this.props.task.aois = [];
    this.preview = true;
    this.props.selectImageCallback(false, this.image);
    this.setState({selectedImage: this.props.task.image});
    this.onCloseBrowseImages();
  }

  onBrowseImages() {
    this.setState({
      openBrowseImage: true
    });
  }

  onCloseBrowseImages() {
    this.setState({
      openBrowseImage: false
    });
  }

  render() {
    var previewImage = <div style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <Typography color="textPrimary"> "No Image selected" </Typography>
                       </div>;

    if(this.state.selectedImage !== ""){
      previewImage = <AOIEditorComponent preview={this.preview} task={this.props.task} image={this.image}/>
    }

    var imageTypeContent =
    <div className="imageTypeContainer">
      <div className="editTaskImagePreview">{previewImage}</div>

      <div className="imagePickingContainer">
        <Button variant="outlined" onClick={this.onBrowseImages.bind(this)}>Browse Image Database</Button>
        <FileSelector handleSelectionCallback={this.handleImageSelectedCallback}/>
        <FormControlLabel label="Record Clicks"
          value="end"
          id={this.props.uniqueID+"rclick"}
          padding="dense"
          checked={this.state.recordClicks}
          control={<Checkbox style={{width:"50%"}} color="secondary" />}
          onChange={this.handleRecordClickCallback}
          labelPlacement="end"
        />
        <FormControlLabel label="Show Fullscreen"
          value="end"
          id={this.props.uniqueID+"fscreen"}
          padding="dense"
          checked={this.state.fullScreenImage}
          control={<Checkbox style={{width:"50%"}} color="secondary" />}
          onChange={this.handleShowFullScreenCallback}
          labelPlacement="end"
        />
        <FormControlLabel label="Show AOIs"
          value="end"
          id={this.props.uniqueID+"saois"}
          padding="dense"
          checked={this.state.showAOIs}
          control={<Checkbox style={{width:"50%"}} color="secondary" />}
          onChange={this.handleShowAOIsCallback}
          labelPlacement="end"
        />
      </div>

      <BrowseImagesDialog openDialog={this.state.openBrowseImage}
                          closeDialog={this.onCloseBrowseImages.bind(this)}
                          onPickImage={this.onPickImageBrowseImages.bind(this)}/>
    </div>;

    return(
      imageTypeContent
    );
  }
}

export default ImageTaskType;
