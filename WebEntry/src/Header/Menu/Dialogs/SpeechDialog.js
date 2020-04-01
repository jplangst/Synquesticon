import React, { Component } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import DialogContentText from '@material-ui/core/DialogContentText';

import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import NativeSelect from '@material-ui/core/NativeSelect';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import { withTheme } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';

var voices = []; // = synth.getVoices();

class SpeechDialog extends Component {
  constructor(props){
    super(props);

    this.speech = { //Speech settings
      rate: 0,
      pitch: 0,
      langObj: null
    }
  }

  componentWillMount() {
    window.speechSynthesis.onvoiceschanged = this.speechConfigurations.bind(this);
  }

  componentWillUnmount() {
  }

  //------------initialize configurations-----------
  speechConfigurations() {
    var speechConfig = JSON.parse(this.props.myStorage.getItem('speech'));
    voices = window.speechSynthesis.getVoices();

    if (!speechConfig || speechConfig === undefined) {

      speechConfig = {
        rate: 0,
        pitch: 0,
        langObj: null
      }

      for(let i = 0; i < voices.length ; i++) {
        if(voices[i].default) {
          speechConfig.langObj = voices[i];
          break;
        }
      }
    }
    else { //check if this browser supports current language
      let voiceExisted = false;
      let langExisted = false;
      let langId = 0;
      for(let i = 0; i < voices.length ; i++) {
        if(voices[i].name === speechConfig.langObj.name) {
          voiceExisted = true;
          break;
        }
        if(!langExisted) {
          if(voices[i].lang === speechConfig.langObj.lang) {
            langExisted = true;
            langId = i;
          }
        }
      }
      if (!voiceExisted) {
        speechConfig.langObj = voices[langId];
      }
    }

    this.speech = speechConfig;
  }

  populateVoiceList() {
    if(this.speech !== undefined) {
      return (
        <div>
          <MenuItem value={this.speech.langObj.name}>
            {this.speech.langObj.name}
          </MenuItem>
          {voices.map((lang, index) => {
            if (lang.name !== this.speech.langObj.name){
              return <MenuItem value={lang.name}>{lang.name}</MenuItem>
            }
            return null;
          })}
        </div>
      );
    }
  }

  onHandleRateChange(e, value) {
    this.speech.rate = value;
    this.forceUpdate();
  }

  onHandlePitchChange(e, value) {
    this.speech.pitch = value;
    this.forceUpdate();
  }

  onHandleLanguageChange(e, value) {

  }

  onChangeSpeechSettings(e) {
    this.props.closeSpeechSettings();
  }



  render() {
    return(
      <Dialog //------------------------speech settings------------------------
             open={this.props.openSpeechSettings}
             onClose={this.props.closeSpeechSettings}
             aria-labelledby="form-dialog-title"
       >
          <DialogTitle id="form-dialog-title"><Typography variant="h5" color="textPrimary">Speech Settings</Typography></DialogTitle>
          <DialogContent>
             <DialogContentText><Typography color="textPrimary">Change speech synthesis settings</Typography></DialogContentText>
             <div>
                <Typography color="textPrimary" id="label">Rate</Typography>
                  <Slider
                    value={this.speech.rate}
                    aria-labelledby="label"
                    className="slider"
                    onChange={this.onHandleRateChange.bind(this)}
                  />
             </div>
             <div>
                <Typography color="textPrimary" id="label">Pitch</Typography>
                  <Slider
                    value={this.speech.pitch}
                    aria-labelledby="label"
                    className="slider"
                    onChange={this.onHandlePitchChange.bind(this)}
                  />
             </div>
             <div>
             <InputLabel htmlFor="uncontrolled-native"><Typography color="textPrimary" >Language</Typography></InputLabel>
             <NativeSelect defaultValue={(this.speech === undefined || !this.speech.langObj) ? "" : this.speech.langObj.name} input={<Input name="name" id="uncontrolled-native" />}>
               {voices.map((lang, index) => {
                 return <option key={index} value={lang.name}>{lang.name}</option>
               })}
             </NativeSelect>
             </div>
          </DialogContent>
          <DialogActions>
             <Button variant="outlined" onClick={this.props.closeSpeechSettings} >
               Cancel
             </Button>
             <Button variant="outlined" onClick={this.onChangeSpeechSettings.bind(this)} >
               OK
             </Button>
          </DialogActions>
        </Dialog>
    );
  }
}

export default withTheme(SpeechDialog);
