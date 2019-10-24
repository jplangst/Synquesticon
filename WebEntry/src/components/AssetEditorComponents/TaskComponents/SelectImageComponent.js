import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import FileSelector from '../../../core/fileSelector';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
//import Button from '@material-ui/core/Button';

import AOIEditorComponent from '../../AOIEditor/AOIEditorComponent';
import BrowseImagesDialog from '../../dialogs/BrowseImagesDialog';

import db_helper from '../../../core/db_helper';

import './SelectImageComponent.css';

class SelectImageComponent extends Component {
  constructor(props){
    super(props);

    this.state = { //We keep these fields in the state as they affect how the component is rendered
      selectedImage: this.props.task ? this.props.task.image : "",
      openBrowseImage: false,
    };

    this.preview = false;
    this.image = null;

    this.handleImageSelectedCallback = this.onImageFileSelected.bind(this);
  }

  onImageFileSelected(selectedFile){
    this.props.task.image = selectedFile.name;
    this.image = selectedFile;
    this.props.task.aois = [];
    this.preview = true;
    this.setState({selectedImage: this.props.task.image});
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

  onUploadImages() {
    if (this.image) {
      const formData = new FormData();
      formData.append('images',this.image);
      //formData.set('filename', this.props.task.image);

      const config = {
          headers: {
              'content-type': 'multipart/form-data'
          }
      };
      db_helper.uploadImage(this.props.task.image, formData, config, null);
    }
  }

  onPickImageBrowseImages(img) {
    this.props.task.image = img;
    this.image = null;
    this.props.task.aois = [];
    this.preview = true;
    this.setState({selectedImage: this.props.task.image});
    this.onCloseBrowseImages();
  }

  render() {
    var previewImage = <Typography color="textPrimary"> "No Image selected" </Typography>;
    if(this.state.selectedImage !== ""){
      previewImage = <AOIEditorComponent preview={this.preview} task={this.props.task} image={this.image}/>//<img className="imageContainer" src={"Images/"+this.props.task.image} alt="Task" />;
    }

    var imageTaskName =
    <TextField
        required
        padding="dense"
        id="imageName"
        defaultValue={this.props.task.question}
        placeholder="Task Name"
        label="Task Name"
        ref="imageTextRef"
        onChange={(e)=>{this.props.task.question = e.target.value}}
    />;

    var imageTypeContent =
    <div className="imageTypeContainer">
      <div className="imageInputContainer">
        {imageTaskName}
      </div>
      <div>
        <Button variant="outlined" onClick={this.onBrowseImages.bind(this)}>Browse</Button>
        <Button variant="outlined" onClick={this.onUploadImages.bind(this)}>Upload</Button>
      </div>

      {previewImage}

      <div className="fileSelectorContainer">
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

export default SelectImageComponent;
