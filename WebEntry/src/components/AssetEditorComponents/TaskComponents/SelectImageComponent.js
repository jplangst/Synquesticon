import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import FileSelector from '../../../core/fileSelector';
import { Typography } from '@material-ui/core';
//import Button from '@material-ui/core/Button';

import AOIEditorComponent from '../../AOIEditor/AOIEditorComponent';

import './SelectImageComponent.css';

class SelectImageComponent extends Component {
  constructor(props){
    super(props);

    this.state = { //We keep these fields in the state as they affect how the component is rendered
      selectedImage: this.props.task ? this.props.task.image : "",
    };

    this.handleImageSelectedCallback = this.onImageFileSelected.bind(this);
  }

  onImageFileSelected(selectedFile){
    this.props.task.image = selectedFile.name;
    this.props.task.aois = [];
    this.setState({selectedImage: this.props.task.image});
  }

  render() {
    var previewImage = <Typography color="textPrimary"> "No Image selected" </Typography>;
    if(this.props.task.image && this.props.task.image !== ""){
      previewImage = <AOIEditorComponent task={this.props.task}/>//<img className="imageContainer" src={"Images/"+this.props.task.image} alt="Task" />;
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
    <div className="imageTypeContainer" onScroll={(e)=>{console.log("scroll")}}>
      <div className="imageInputContainer">
        {imageTaskName}
      </div>
      {previewImage}
      <div className="fileSelectorContainer">
        <FileSelector handleSelectionCallback={this.handleImageSelectedCallback}/>
        </div>
    </div>;

    return(
      imageTypeContent
    );
  }
}

export default SelectImageComponent;
