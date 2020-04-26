import React, {useState} from 'react';
import FileSelector from '../../../core/fileSelector';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Button from '@material-ui/core/Button';

import AOIEditorComponent from './AOIEditor/AOIEditorComponent';
import BrowseImagesDialog from './BrowseImagesDialog';

import './ImageType.css';

const ImageTaskType = props => {
  const [selectedImage, setSelectedImage] = useState(props.task ? props.task.image : "");
  const [recordClicks, setRecordClicks] = useState(props.task ? props.task.recordClicks : false);
  const [fullScreenImage, setFullScreenImage] = useState(props.task ? props.task.fullScreenImage : false);
  const [showAOIs, setShowAOIs] = useState(props.task ? props.task.showAOIs : false);
  const [openBrowseImage, setOpenBrowseImage] = useState(false);

  let preview = false;
  let image = null;

  const onRecordClickChanged = (e, checked) => {
    props.task.recordClicks = checked;
    setRecordClicks(checked);
  }

  const onShowFullScreenChanged = (e, checked) => {
    props.task.fullScreenImage = checked;
    setFullScreenImage(checked);
  }

  const onShowAOIsChanged = (e, checked) => {
    props.task.showAOIs = checked;
    setShowAOIs(checked);
  }

  const onImageFileSelected = selectedFile => {
    props.task.image = selectedFile.name;
    image = selectedFile;
    props.task.aois = [];
    preview = true;
    props.selectImageCallback(true, image);
    setSelectedImage(props.task.image);
  }

  const onPickImageBrowseImages = img => {
    props.task.image = img;
    image = null;
    props.task.aois = [];
    preview = true;
    props.selectImageCallback(false, image);
    setSelectedImage(props.task.image);
    setOpenBrowseImage(false);
  }

  let previewImage = <div style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                      <Typography color="textPrimary"> "No Image selected" </Typography>
                      </div>;

  if(selectedImage !== ""){
    previewImage = <AOIEditorComponent preview={preview} task={props.task} image={image}/>
  }

  const imageTypeContent =
  <div className="imageTypeContainer">
    <div className="imagePickingContainer">
      <FormControlLabel label="Record Clicks"
        value="end"
        id={props.uniqueID+"rclick"}
        padding="dense"
        style={{marginLeft:5}}
        checked={recordClicks}
        control={<Checkbox color="secondary" />}
        onChange={onRecordClickChanged}
        labelPlacement="end"
      />
      <FormControlLabel label="Show Fullscreen"
        value="end"
        id={props.uniqueID+"fscreen"}
        padding="dense"
        checked={fullScreenImage}
        control={<Checkbox color="secondary" />}
        onChange={onShowFullScreenChanged}
        labelPlacement="end"
      />
      <FormControlLabel label="Show AOIs"
        value="end"
        id={props.uniqueID+"saois"}
        padding="dense"
        checked={showAOIs}
        control={<Checkbox color="secondary" />}
        onChange={onShowAOIsChanged}
        labelPlacement="end"
      />
      <Button variant="outlined" onClick={() => setOpenBrowseImage(true)}>Browse Images</Button>
      <FileSelector handleSelectionCallback={onImageFileSelected}/>
    </div>
    <div className="editTaskImagePreview">{previewImage}</div>
    <BrowseImagesDialog openDialog={openBrowseImage}
                        closeDialog={() => setOpenBrowseImage(false)}
                        onPickImage={onPickImageBrowseImages}/>
  </div>;

  return(
    imageTypeContent
  );
}

export default ImageTaskType;