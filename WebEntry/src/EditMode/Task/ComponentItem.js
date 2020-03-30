import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import ImageTaskType from './ImageType';

import * as dbObjects from '../../core/db_objects';
import db_helper from '../../core/db_helper';

var _id = 0;
class TaskComponentItem extends Component {
  constructor(props){
    super(props);

    this.state = {
      singleChoice: props.task.singleChoice
    };

    //Image
    this.shouldUpload = false;
    this.imageToUpload = null;
    this.imageSelectCallback = this.onSelectImage.bind(this);

    //Task update
    this.responseHandler = this.onResponsesChanged;
    this.handleSingleChoiceChanged = this.onSingleChoiceChanged.bind(this);

    this.uniqueID = _id;
    _id++;
  }

  onTaskChanged(){
    if (this.props.task.objType === dbObjects.TaskTypes.IMAGE && this.shouldUpload) {
      this.uploadImages();
    }
  }

  //Callback form the SynquestiImage component
  onSelectImage(shouldUpload, image) {
    this.shouldUpload = shouldUpload;
    this.imageToUpload = image;
  }
  //Upload the sleected image to the database
  uploadImages() {
    if (this.imageToUpload) {
      const formData = new FormData();
      formData.append('images',this.imageToUpload);
      const config = {
          headers: {
              'content-type': 'multipart/form-data'
          }
      };
      db_helper.uploadImage(this.imageToUpload, formData, config, null);
    }
  }

  //Get the components to render based on the object type
  getComponent(){
    let component = null;
    switch (this.props.task.objType){
      case dbObjects.TaskTypes.INSTRUCTION.type: {
        component =  <TextField
                  required
                  padding="dense"
                  id={this.uniqueID+"instructionText"}
                  defaultValue={this.props.task.displayText}
                  placeholder="Write your instruction here"
                  label="Instructions"
                  ref="instructionTextRef"
                  fullWidth
                  multiline
                  rows="3"
                  onChange={(e)=>{this.props.task.displayText = e.target.value}}
                />;
        break;
      }
      case dbObjects.TaskTypes.IMAGE.type: {
        component = <ImageTaskType task={this.props.task} selectImageCallback={this.imageSelectCallback}/>
        break;
      }
      case dbObjects.TaskTypes.MCHOICE.type: {
        component = <div>
          <TextField label="Question"
            required
            padding="dense"
            fullWidth
            id={this.uniqueID+"mcQuestionText"}
            defaultValue={this.props.task.displayText}
            placeholder="Enter your question here"
            ref="questionTextRef"
            multiline
            rows="3"
            onChange={(e)=>{this.props.task.displayText = e.target.value}}
          />
          <TextField label="Responses"
            required
            padding="dense"
            style={{marginRight:"10px", width:"calc(40% - 15px)"}}
            id={this.uniqueID+"mcResponses"}
            defaultValue={this.props.task.responses.join(',')}
            placeholder="Response A, Response B, ResponseC"
            helperText="Question responses seperated by a comma"
            ref="responsesRef"
            onChange={(e)=> this.responseHandler(e, e.target.value, "Responses")}
          />
          <TextField label="Correct Responses"
            required
            padding="dense"
            style={{marginRight:"10px", width:"calc(40% - 15px)"}}
            id={this.uniqueID+"mcCorrectResponses"}
            defaultValue={this.props.task.correctResponses.join(',')}
            placeholder="Response A, Response C"
            helperText="The correct responses to the question"
            ref="correctResponseRef"
            onChange={(e)=> this.responseHandler(e, e.target.value, "Correct Responses")}
          />
          <FormControlLabel label="Single Choice"
            value="end"
            id={this.uniqueID+"schoice"}
            padding="dense"
            checked={this.state.singleChoice}
            control={<Checkbox style={{width:"50%"}} color="secondary" />}
            onChange={this.handleSingleChoiceChanged}
            labelPlacement="end"
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
            id={this.uniqueID+"numQuestionText"}
            defaultValue={this.props.task.displayText}
            placeholder="Enter your question here"
            ref="questionTextRef"
            multiline
            rows="3"
            onChange={(e)=>{this.props.task.displayText = e.target.value}}
          />
          <TextField label="Correct Response"
            required
            padding="dense"
            style={{marginRight:"10px", width:"calc(40% - 15px)"}}
            id={this.uniqueID+"numCorrectResponses"}
            defaultValue={this.props.task.correctResponses.join(',')}
            placeholder="Correct Answer, Margin(Optional)"
            helperText="Enter the correct answer and optionally a margin seperated with a comma, +- that still allows a correct answer. E.g. 5,2 would let anything between 3-7 be a correct answer"
            ref="correctResponseRef"
            onChange={(e)=> this.responseHandler(e, e.target.value, "Correct Responses")}
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
            id={this.uniqueID+"textQuestionText"}
            defaultValue={this.props.task.displayText}
            placeholder="Enter your question here"
            ref="questionTextRef"
            multiline
            rows="3"
            onChange={(e)=>{this.props.task.displayText = e.target.value}}
          />
          <TextField label="Correct Response"
            required
            padding="dense"
            style={{marginRight:"10px", width:"calc(40% - 15px)"}}
            id={this.uniqueID+"textCorrectResponses"}
            defaultValue={this.props.task.correctResponses.join(',')}
            placeholder="Correct Answer(Optional)"
            helperText="Enter the correct answer"
            ref="correctResponseRef"
            onChange={(e)=> this.responseHandler(e, e.target.value, "Correct Responses")}
          />
        </div>;
        break;
      }
      default: component = null;
    }

    return component;
  }

  onSingleChoiceChanged(e, checked){
    this.props.task.singleChoice = checked;
    this.setState({
      singleChoice: checked,
    });
  }

  onResponsesChanged(e, response, target){
    response = response.replace(/\s+/g, " ");
    response = response.trim();
    response = response.split(",");
    response = response.map((value)=>{
      return value.trim();
    });
    response = response.filter(Boolean); //Remove empty values

    if(target==="Responses"){
      this.props.task.responses = response;
    }
    else if(target==="Correct Responses"){
      this.props.task.correctResponses = response;
    }
  }

  render() {
    var task = this.getComponent();
    return(
      <div style={{marginRight:20, marginTop:10, marginBottom: 10}}> {task} </div>
    );
  }
}

export default TaskComponentItem;
