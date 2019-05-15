import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import NavigationIcon from '@material-ui/icons/NavigateNextTwoTone';

import CreateQuestionComponent from '../components/CreateQuestionComponent';
import TaskListComponent from '../components/TaskListComponent';

import store from '../core/store';

import * as dbFunctions from '../core/db_helper';
import * as dbObjects from '../core/db_objects';

import './CreateTaskScreen.css';

class CreateTaskScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionList: [], //Used to save and display the lis of questions
      showMenu: false, //Used to show the settings menu
      openCrossbarSettings: false, //Crossbar settings
      openSpeechSettings: false, //Speech settings
      selectedTask: null, //The reference to the selected question
      editing: false, //Flag to indicate if editing a question or making a new question
      questionSetTitle: "", //Title of the question set being edited
    }
    this.actionsCallbacks = { //Callbacks from the front-end interface
      //addAOIs: this.onAddAOIs.bind(this),
      //addResponse: this.onAddResponse.bind(this),
      //addTags: this.onAddTags.bind(this),
      //readQuestion: this.onReadQuestion.bind(this),
      //deleteQuestion: this.onDeleteQuestion.bind(this),
      saveQuestion: this.onSaveQuestion.bind(this)
    }

    //DB handlers
    this.handleAllQuestions = this.handleAllQuestionsFromDB.bind(this);
    this.handleQuestionCallback = this.handleSavedQuestion.bind(this);
  }

  handleSavedQuestion(questionDBID){
    console.log("Question saved: " + questionDBID);
  }

  onSaveQuestion(question, isEditing){
    console.log(question);
    if(isEditing){

    }
    else{
      var newTask = new dbObjects.TaskObject();
      newTask.question = question;
      dbFunctions.addQuestionToDb(newTask, this.handleQuestionCallback);
    }
  }

  //---------------------------component functions------------------------------
  componentWillMount() {
    //this.testDatabase();
  }

  handleAllQuestionsFromDB(questions){
    this.questionList = questions;
  }

  testDatabase() {
    dbFunctions.getAllQuestionsFromDb(this.handleAllQuestions);
    dbFunctions.deleteAllQuestionsFromDb();
  }

  selectTask(task) {
    console.log("selectTask", task.id, task.question);
    this.setState({
      selectedTask: task,
      editing: true
    });
    this.refs.CreateQuestionRef.EditingTask(task);
  }
  //actions callbacks
  onAddAOIs(task, AOIs) {
    console.log("edit AOIs", task, AOIs);
    task.aois = AOIs;
    this.updateDB(task);
  }

  onAddResponse(task, response) {
    task.response = response;
    this.updateDB(task);
  }

  onAddTags() {

  }

  onReadQuestion(question) {
    var synth = window.speechSynthesis;
    this.speak(synth, question);
  }

  //button click handlers
  openSettingsMenu() {
    this.setState({showMenu: true});
  }

  closeSettingsMenu(e) {
    this.setState({showMenu: false});
  }

  //bottom button handler
  onPlayButtonClick() {
    var action = {
      type: 'SET_TASK_LIST',
      questionList: this.state.questionList
    }
    store.dispatch(action);
    this.props.history.push('/PlayScreen');
  }

  render() {
    //variant="outlined"
    return(
      <div>
        <div className="questionSetTitle">
          <TextField
            id="outlined-bare"
            placeholder="Question set title"
            fullWidth
            variant="filled"
            value={this.state.questionSetTitle}
            onChange={(e) => {this.setState({questionSetTitle: e.target.value})}}
          />
        </div>
        <div className="createQuestionPanel">
          <CreateQuestionComponent ref="CreateQuestionRef" actionsCallbacks={this.actionsCallbacks} task={this.state.selectedTask} />
        </div>
        <div className="questionList">
          <TaskListComponent taskList={this.state.questionList} selectTask={this.selectTask.bind(this)}/>
        </div>
        <div className="playButtonWrapper">
          <Button variant="fab" onClick={this.onPlayButtonClick.bind(this)} className="playButton">
            <NavigationIcon fontSize="large"/>
          </Button>
        </div>
      </div>
    );
  }
}

export default CreateTaskScreen;
