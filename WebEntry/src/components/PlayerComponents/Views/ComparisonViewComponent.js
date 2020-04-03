import React, { Component } from 'react';

import ImageViewComponent from './ImageViewComponent';

import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';

import store from '../../../core/store';

import './ComparisonViewComponent.css';

class Text extends Component {
  constructor(props) {
    super(props);
    this.textRef = React.createRef();
  }
  componentDidMount() {
    var textAOIAction = {
      type: 'ADD_AOIS',
      aois: {
        name: this.props.parentSet + '_' + this.props.task.label,
        boundingbox: [],
        imageRef: this.textRef
      }
    }
    store.dispatch(textAOIAction);
  }

  render() {
    return <Typography variant="h3" color="textPrimary" style={{whiteSpace:"pre-line"}}>{this.props.task.text}</Typography>;
  }
}

class SubTaskViewComponent extends Component {
  render() {
    if(this.props.task.subType === "Text"){
      return <Text className="itemContainer" task={this.props.task} parentSet={this.props.parentSet}/>;
    }
    else if(this.props.task.subType === "Image"){
      return <ImageViewComponent className="itemContainer" task={this.props.task} parentSet={this.props.parentSet}/>;
    }

    return <div/>;
  }
}

class ComparisonViewComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      picked: -1
    }
    this.image = null;
    this.imageRef = React.createRef();
  }
  componentWillMount() {
    //db_helper.getImage(this.props.task.image, this.onReceivedImage.bind(this));
  }

  componentDidMount() {
  }

  checkAnswer(answer) {
    if (this.props.task.correctResponses === undefined || this.props.task.correctResponses.length === 0) {
      return "notApplicable";
    }
    if (this.props.task.correctResponses.includes(answer)) {
      return "correct";
    }
    return "incorrect";
  }

  onPickingTask(task) {
    this.setState({
      picked: task
    });

    var answerObj = {
      responses: [this.props.task.subTasks[task].label],
      correctlyAnswered: this.checkAnswer(this.props.task.subTasks[task].label),
      taskID: this.props.task._id,
      mapID: this.props.mapID,
    }
    this.props.answerCallback(answerObj);
  }

  render() {
    var borderStyle={borderWidth:3, borderStyle:'solid', borderColor:this.props.theme.palette.secondary.main};
    var borderStyle0 = this.state.picked === 0? borderStyle : null;
    var borderStyle1 = this.state.picked === 1? borderStyle : null;

    return <div className="comparisonTask">
      <div className="comparisonTaskText"><Typography variant="h3" align="center" color="textPrimary" style={{whiteSpace:"pre-line"}}>{this.props.task.question}</Typography></div>
      <div className="comparisonBox">
        <div className="firstTask" style={borderStyle0} onClick={(e)=>this.onPickingTask(0)}>
          <SubTaskViewComponent task={this.props.task.subTasks[0]} parentSet={this.props.parentSet}/>
        </div>
        <div className="taskSpacer"/>
        <div className="secondTask" style={borderStyle1} onClick={(e)=>this.onPickingTask(1)}>
          <SubTaskViewComponent className="secondTask" task={this.props.task.subTasks[1]} parentSet={this.props.parentSet}/>
        </div>
      </div>
    </div>
  }
}

export default withTheme(ComparisonViewComponent);
