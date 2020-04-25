import React, { useState } from 'react';

import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import ImageTaskType from './ImageType/ImageType';

import * as dbObjects from '../../core/db_objects';
import db_helper from '../../core/db_helper';

var _id = 0;
const TaskComponentItem = props => {
  const [singleChoice, setSingleChoice] = useState(props.task.singleChoice);
  const [resetResponses, setResetResponses] = useState(props.task.resetResponses);
  const [globalVariable, setGlobalVariable] = useState(props.task.globalVariable ? props.task.globalVariable : false);

  //Image
  let shouldUpload = false;
  let imageToUpload = null;
  let uniqueID = _id;
  _id++;

  //Callback form the SynquestiImage component
  const onSelectImage = (shouldUploadFlag, image) => {
    shouldUpload = shouldUploadFlag;
    imageToUpload = image;
    if (shouldUpload) {
      uploadImages();
    }
  }
  //Upload the sleected image to the database
  const uploadImages = () => {
    if (imageToUpload) {
      const formData = new FormData();
      formData.append('images',imageToUpload);
      const config = {
          headers: {
              'content-type': 'multipart/form-data'
          }
      };
      db_helper.uploadImage(imageToUpload, formData, config, null);
    }
  }

  const onGlobalVariableChanged = (e, checked) => {
    props.task.globalVariable = checked;
    setGlobalVariable(checked);
  }

  //Get the components to render based on the object type
  const getComponent = () => {
    let component = null;
    switch (props.task.objType){
      case dbObjects.TaskTypes.INSTRUCTION.type: {
        component =  <div>
                <TextField
                  required
                  padding="dense"
                  id={uniqueID+"instructionText"}
                  defaultValue={props.task.displayText}
                  placeholder="Write your instruction here"
                  label="Instructions"
                  fullWidth
                  multiline
                  rows="1"
                  onChange={(e)=>{props.task.displayText = e.target.value}}
                />
                <TextField label="Screen IDs"
                   required
                   padding="dense"
                   style={{width:"100px"}}
                   id={uniqueID+"insScreenIDs"}
                   defaultValue={props.task.screenIDS.join(',')}
                   placeholder="1, 2"
                   onChange={(e)=> onResponsesChanged(e, e.target.value, "ScreenIDs")}
                 />
              </div>;
        break;
      }
      case dbObjects.TaskTypes.IMAGE.type: {
        component = <div>
                      <ImageTaskType task={props.task}
                         selectImageCallback={onSelectImage}
                         uniqueID={uniqueID+"image"}/>
                      <TextField label="Screen IDs"
                         required
                         padding="dense"
                         style={{width:"100px"}}
                         id={uniqueID+"imageScreenIDs"}
                         defaultValue={props.task.screenIDS.join(',')}
                         placeholder="1, 2"
                         onChange={(e)=> onResponsesChanged(e, e.target.value, "ScreenIDs")}
                       />
                   </div>
        break;
      }
      case dbObjects.TaskTypes.MCHOICE.type: {
        component = <div>
          <TextField label="Question"
            required
            padding="dense"
            fullWidth
            id={uniqueID+"mcQuestionText"}
            defaultValue={props.task.displayText}
            placeholder="Enter your question here"
            multiline
            rows="1"
            onChange={(e)=>{props.task.displayText = e.target.value}}
          />
          <TextField label="Answers(comma-separated)"
            required
            padding="dense"
            style={{marginRight:"10px", width:"calc(50% - 10px)"}}
            id={uniqueID+"mcResponses"}
            defaultValue={props.task.responses.join(',')}
            placeholder="Answer A, Answer B, Answer C"
            onChange={(e)=> onResponsesChanged(e, e.target.value, "Responses")}
          />
          <TextField label="Correct answers(comma-separated)"
            required
            padding="dense"
            style={{width:"50%"}}
            id={uniqueID+"mcCorrectResponses"}
            defaultValue={props.task.correctResponses.join(',')}
            placeholder="Answer A, Answer C"
            onChange={(e)=> onResponsesChanged(e, e.target.value, "Correct Responses")}
          />
          <FormControlLabel label="Single Choice"
            value="end"
            id={uniqueID+"schoice"}
            padding="dense"
            checked={singleChoice}
            control={<Checkbox  color="secondary" />}
            onChange={onSingleChoiceChanged}
            labelPlacement="end"
          />
          <FormControlLabel label="Auto-Reset"
            value="end"
            id={uniqueID+"reset"}
            padding="dense"
            checked={resetResponses}
            control={<Checkbox  color="secondary" />}
            onChange={onResetResponsesChanged}
            labelPlacement="end"
          />
          <FormControlLabel label="Make Global Variable"
            value="end"
            padding="dense"
            id={uniqueID+"globalVar"}
            checked={globalVariable}
            control={<Checkbox color="secondary" />}
            onChange={onGlobalVariableChanged}
            labelPlacement="end"
          />
          <TextField label="Screen IDs"
            required
            padding="dense"
            style={{width:"100px"}}
            id={uniqueID+"mcScreenIDs"}
            defaultValue={props.task.screenIDS.join(',')}
            placeholder="1, 2"
            onChange={(e)=> onResponsesChanged(e, e.target.value, "ScreenIDs")}
          />
        </div>;
        break;
      }
      case dbObjects.TaskTypes.NUMPAD.type: {
        component = <div>
          <TextField label="Question"
            required
            padding="dense"
            fullWidth
            id={uniqueID+"numQuestionText"}
            defaultValue={props.task.displayText}
            placeholder="Enter your question here"
            multiline
            rows="1"
            onChange={(e)=>{props.task.displayText = e.target.value}}
          />
          <TextField label="Correct answer, +-Margin(Optional)"
            required
            padding="dense"
            style={{marginRight:"10px", width:"calc(40% - 15px)"}}
            id={uniqueID+"numCorrectResponses"}
            defaultValue={props.task.correctResponses.join(',')}
            placeholder="3, 0.2"
            onChange={(e)=> onResponsesChanged(e, e.target.value, "Correct Responses")}
          />
          <FormControlLabel label="Make Global Variable"
            value="end"
            padding="dense"
            id={uniqueID+"globalVar"}
            checked={globalVariable}
            control={<Checkbox color="secondary" />}
            onChange={onGlobalVariableChanged}
            labelPlacement="end"
          />
          <TextField label="Screen IDs"
             required
             padding="dense"
             style={{width:"100px"}}
             id={uniqueID+"numScreenIDs"}
             defaultValue={props.task.screenIDS.join(',')}
             placeholder="1, 2"
             onChange={(e)=> onResponsesChanged(e, e.target.value, "ScreenIDs")}
           />
        </div>;
        break;
      }
      case dbObjects.TaskTypes.TEXTENTRY.type: {
        component = <div>
          <TextField label="Question"
            required
            padding="dense"
            fullWidth
            id={uniqueID+"textQuestionText"}
            defaultValue={props.task.displayText}
            placeholder="Enter your question here"
            multiline
            rows="1"
            onChange={(e)=>{props.task.displayText = e.target.value}}
          />
          <TextField label="Correct answer"
            padding="dense"
            style={{marginRight:"10px", width:"calc(40% - 15px)"}}
            id={uniqueID+"textCorrectResponses"}
            defaultValue={props.task.correctResponses.join(',')}
            placeholder="Answer A, Answer C"
            onChange={(e)=> onResponsesChanged(e, e.target.value, "Correct Responses")}
          />
          <FormControlLabel label="Make Global Variable"
            value="end"
            padding="dense"
            id={uniqueID+"globalVar"}
            checked={globalVariable}
            control={<Checkbox color="secondary" />}
            onChange={onGlobalVariableChanged}
            labelPlacement="end"
          />
          <TextField label="Screen IDs"
             required
             padding="dense"
             style={{width:"100px"}}
             id={uniqueID+"textScreenIDs"}
             defaultValue={props.task.screenIDS.join(',')}
             placeholder="1, 2"
             onChange={(e)=> onResponsesChanged(e, e.target.value, "ScreenIDs")}
           />
        </div>;
        break;
      }
      default: component = null;
    }

    return component;
  }

  const onSingleChoiceChanged = (e, checked) => {
    props.task.singleChoice = checked;
    setSingleChoice(checked);
  }

  const onResetResponsesChanged = (e, checked) => {
    props.task.resetResponses = checked;
    setResetResponses(checked);
  }

  const onResponsesChanged = (e, response, target) => {
    response = response.replace(/\s+/g, " ");
    response = response.trim();
    response = response.split(",");
    response = response.map((value)=>{
      return value.trim();
    });
    response = response.filter(Boolean); //Remove empty values

    if(target==="Responses"){
      props.task.responses = response;
    }
    else if(target==="Correct Responses"){
      props.task.correctResponses = response;
    }
    else if(target==="ScreenIDs"){
      props.task.screenIDS = response;
    }
  }

  const task = getComponent();
  return(
    <div style={{marginRight:20, marginTop:10, marginBottom: 10}}> {task} </div>
  );
}

export default TaskComponentItem;