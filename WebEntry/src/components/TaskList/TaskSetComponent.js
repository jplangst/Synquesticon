import React from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import SpeakerIcon from '@material-ui/icons/VolumeUp';

import './TaskSetComponent.css';

class TaskSetComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editLabel: false,
      startButton: true
    }
  }

  onLabelChanged(e) {
    this.props.task.label = e.target.value;
    this.forceUpdate();
  }

  onClickLabel(e) {
    this.setState({
      editLabel: true
    });
  }

  onBlurLabel(e) {
    this.setState({
      editLabel: false,
      avatar: this.props.task.label.charAt(0),
      checked: false
    });
  }

  onKeyPressLabel(e) {
    if (e.key === 'Enter') {
      this.onBlurLabel(e);
    }
  }

  onStartButtonClick() {
    if(this.props.task.start) {
      this.props.task.startTimestamp = new Date().getTime();
    } else {
      this.props.task.stopTimestamp = new Date().getTime();
    }

    this.props.task.start = !this.props.task.start;
    this.forceUpdate();
  }

  onDeleteButtonClick() {
    this.props.removeCallback(this.props.task);
  }

  onSpeakerButtonClick() {
    var synth = window.speechSynthesis;
    console.log(synth, synth.getVoices());
    this.speak(synth, this.props.task.instructions);
  }

  speak(synth, inputTxt) {
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    if (inputTxt !== '') {
      var utterThis = new SpeechSynthesisUtterance(inputTxt);
      utterThis.onend = function (event) {
          console.log('SpeechSynthesisUtterance.onend');
      }
      utterThis.onerror = function (event) {
          console.error('SpeechSynthesisUtterance.onerror');
      }
      synth.speak(utterThis);
    }
  }

  renderLabel() {
    if (this.state.editLabel) {
      return <input value={this.props.task.label}
            onChange={this.onLabelChanged.bind(this)}
            onBlur={this.onBlurLabel.bind(this)}
            onKeyPress={this.onKeyPressLabel.bind(this)}/>;
    } else {
      return <div onDoubleClick={this.onClickLabel.bind(this)}>{this.props.task.label}</div>;
    }
  }

  render() {
    if (this.props.placeholder) {
      return (
      <Card>
        <CardHeader
          title={<div className="cardTitle">Label</div>}
          />
        <CardContent>
        <TextField
          id="outlined-textarea"
          label="Instruction"
          placeholder="Placeholder"
          multiline
          className="textField"
          fullWidth
          padding="normal"
        />
        </CardContent>
        <CardActions>
            <Button variant="contained" disabled>
                Start
            </Button>
        </CardActions>
      </Card>);
    }

    return (
      <Card>
        <CardHeader
          avatar={<Avatar aria-label="Task" className="avatar">T</Avatar>}
          action={
            <div>
              <IconButton aria-label="Speak" onClick={this.onSpeakerButtonClick.bind(this)}>
                <SpeakerIcon />
              </IconButton>
              <IconButton aria-label="Delete" onClick={this.onDeleteButtonClick.bind(this)}>
                <DeleteIcon />
              </IconButton>


            </div>}
          title={<div className="cardTitle">{this.renderLabel()}</div>}
          className="cardHeader"
          />
        <CardContent>
        <Collapse in={this.checked}>
          <TextField
            id="outlined-textarea"
            label="Instruction"
            placeholder="Placeholder"
            multiline
            className="textField"
            fullWidth
            padding="normal"
            variant="outlined"
            value={this.props.task.instructions}
                      onChange={(e) => {this.props.task.instructions = e.target.value; this.forceUpdate()}}
          />
        </Collapse>
        </CardContent>
        <CardActions>
            <Button variant="contained" onClick={this.onStartButtonClick.bind(this)}>
                {this.props.task.start? "Start" : "Stop"}
            </Button>
        </CardActions>
      </Card>);
  }
}

export default TaskSetComponent;
