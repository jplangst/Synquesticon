import React, { Component } from 'react';
import FileSelector from '../../../core/fileSelector';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
//import Button from '@material-ui/core/Button';

import AOIEditorComponent from './AOIEditor/AOIEditorComponent';
import BrowseImagesDialog from './BrowseImagesDialog';

import './ImageType.css';

class ImageTaskType extends Component {
  constructor(props){
    super(props);

    this.state = { //We keep these fields in the state as they affect how the component is rendered
      selectedImage: this.props.task ? this.props.task.image : "",
      openBrowseImage: false,
    };

    this.preview = false;
    this.image = null;

    this.responseHandler = this.onResponsesChanged;
    this.handleImageSelectedCallback = this.onImageFileSelected.bind(this);
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
