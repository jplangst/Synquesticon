import React from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';

import SeeButton from '@material-ui/icons/Face';
import SpeakerIcon from '@material-ui/icons/VolumeUp';
import CancelIcon from '@material-ui/icons/CancelOutlined';
import NavigationIcon from '@material-ui/icons/NavigateNextTwoTone';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

import AddingAOIsDialog from '../components/dialogs/AddingAOIsDialog';
import ResponsesDialog from '../components/dialogs/ResponsesDialog';

import './CreateQuestionComponent.css';

class CreateQuestionComponent extends React.Component {
  constructor(props) {
    super(props);
    this.question = "";
    this.state = {
      editingTask: null,
      openAddingAOIs: false,
      openResponsesDialog: false
    };
  }

  EditingTask(task) {
    if (task) {
      this.question = task.question;
      this.setState({
        editingTask: task
      });
    }
    else {
      this.question = "";
    }
  }

  onResetPanel () {
    this.question = "";
    this.setState({
      editingTask: null
    });
    this.forceUpdate();
  }

  onAddingAOIs() {
    this.setState({
      openAddingAOIs: true
    });
  }

  handleCancelAddingAOIs() {
    this.setState({
      openAddingAOIs: false
    });
  }

  handleOkAddingAOIs() {
    var AOIs = this.refs.AOIsDialogRef.getAOIs();
    this.state.editingTask.aois = AOIs;
    this.props.actionsCallbacks.addAOIs(this.state.editingTask, AOIs);
    this.handleCancelAddingAOIs();
  }

  //----------------responses dialog------------------
  onOpenResponsesDialog() {
    this.setState({
      openResponsesDialog: true
    });
  }

  handleCloseResponsesDialog() {
    this.setState({
      openResponsesDialog: false
    });
  }

  handleOkResponsesDialog() {
    var responses = this.refs.ResponsesDialogRef.getResponses();
    this.state.editingTask.responses = responses;
    this.props.actionsCallbacks.addResponse(this.state.editingTask, responses);
    this.handleCloseResponsesDialog();
  }

  //render
  render() {
    return (
  <div>
    <Card className="card">
      <CardContent>
      <TextField
        id="outlined-textarea"
        label="Question"
        placeholder="Type in the question"
        multiline
        className="textField"
        fullWidth
        margin="normal"
        variant="outlined"
        value={this.question}
                  onChange={(e) => {this.question = e.target.value; this.forceUpdate()}}
      />
      </CardContent>
      <CardActions className="cardActions">
        <Button aria-label="AddAOIs" onClick={this.onAddingAOIs.bind(this)}>
          <SeeButton fontSize="large"/>
        </Button>
        <Button aria-label="Response" onClick={this.onOpenResponsesDialog.bind(this)}>
          <div className="tagIcon">!</div>
        </Button>
        <Button aria-label="AddTags" onClick={()=>this.props.actionsCallbacks.addTags}>
          <div className="tagIcon">#</div>
        </Button>
        <Button aria-label="Speak" onClick={()=>this.props.actionsCallbacks.readQuestion(this.question)}>
          <SpeakerIcon fontSize="large"/>
        </Button>
        <Button aria-label="Delete" onClick={()=>{
            this.props.actionsCallbacks.deleteQuestion(this.state.editingTask);
            this.onResetPanel();
          }}>
          <CancelIcon fontSize="large"/>
        </Button>
        <Button aria-label="Save" onClick={()=>{
            this.props.actionsCallbacks.saveQuestion(this.question, this.state.editingTask);
            this.onResetPanel();
          }}>
          <NavigationIcon fontSize="large"/>
        </Button>
      </CardActions>
    </Card>
    <div className="AOIsDialog">
    <Dialog aria-labelledby="simple-dialog-title" //------------aoi dialog---------------
      open={this.state.openAddingAOIs}
      onClose={this.handleCancelAddingAOIs.bind(this)}
      >
      <DialogTitle id="simple-dialog-title">Areas Of Interest</DialogTitle>
      <div className="AOIsDialogContent">
        <AddingAOIsDialog AOIs={(this.state.editingTask?this.state.editingTask.aois:"")} ref="AOIsDialogRef"/>
      </div>
      <DialogActions>
        <Button onClick={this.handleCancelAddingAOIs.bind(this)}>Cancel</Button>
        <Button onClick={this.handleOkAddingAOIs.bind(this)}>Ok</Button>
      </DialogActions>
    </Dialog>

    <Dialog aria-labelledby="simple-dialog-title" //------------responses dialog---------------
      open={this.state.openResponsesDialog}
      onClose={this.handleCloseResponsesDialog.bind(this)}
      >
      <DialogTitle id="simple-dialog-title">Responses</DialogTitle>
      <div className="responsesDialog">
        <ResponsesDialog responses={(this.state.editingTask?this.state.editingTask.responses:"")} ref="ResponsesDialogRef"/>
      </div>
      <DialogActions>
        <Button onClick={this.handleCloseResponsesDialog.bind(this)}>Cancel</Button>
        <Button onClick={this.handleOkResponsesDialog.bind(this)}>Ok</Button>
      </DialogActions>
    </Dialog>
    </div>
  </div>
    );
  }
}

export default CreateQuestionComponent;
