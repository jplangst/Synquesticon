import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

//icons
import CancelIcon from '@material-ui/icons/Cancel';
import NavigationIcon from '@material-ui/icons/NavigateNext';

import wamp from '../core/wamp';
import store from '../core/store';

import './PlayScreen.css';

class PlayScreen extends Component {
  constructor() {
    super();
    this.state = {
      currentQuestion: 0
    }
  }

  componentWillMount() {
    wamp.startStopTask(store.getState().taskList[this.state.currentQuestion]);
  }

  onClickNext(e) {
    console.log("current question", this.state.currentQuestion, store.getState().taskList);
    wamp.startStopTask(store.getState().taskList[(this.state.currentQuestion + 1)]);
    this.setState({
      currentQuestion: (this.state.currentQuestion + 1)
    });
  }

  onClickCancel(e) {

  }

  render() {
    var getDisplayedQuestion = () => {
      if(store.getState().taskList.length > 0 && this.state.currentQuestion < store.getState().taskList.length){
        var task = store.getState().taskList[this.state.currentQuestion];
        console.log("play task", task);
        return (
        <div className="mainDisplay">
          <div className="questionDisplay">
            {task.question}
          </div>
          <div className="responsesButtons">
          {
            task.responses.map((index, item)=>{
              console.log("play task buttons", index, item);
              return (<Button variant="contained">{item}</Button>);
            })
          }
          </div>
        </div>);
      }
    };

    var getNextButton = () => {
      if (this.state.currentQuestion < (store.getState().taskList.length) - 1){
        return (  <Button className="nextButton" onClick={this.onClickNext.bind(this)}>
                    <NavigationIcon />
                  </Button>);
      }
    }

    return (
      <div className="page">
       {getDisplayedQuestion()}
        <div className="footer">
          <Link to="/" >
            <Button className="cancelButton" onClick={this.onClickCancel.bind(this)}>
              <CancelIcon />
            </Button>
          </Link>
          {getNextButton()}
        </div>
      </div>
      );
  }
}

export default PlayScreen;
