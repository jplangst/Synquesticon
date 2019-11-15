import React, { Component } from 'react';

import ImageViewComponent from './ImageViewComponent';

import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';

import store from '../../core/store';

import './ComparisonViewComponent.css';

class Text extends Component {
  render() {
    return <Typography variant="h3" color="textPrimary" style={{whiteSpace:"pre-line"}}>{this.props.task.text}</Typography>;
  }
}

class SubTaskViewComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if(this.props.task.subType === "Text"){
      return <Text className="itemContainer" task={this.props.task}/>;
    }
    else if(this.props.task.subType === "Image"){
      return <ImageViewComponent className="itemContainer" task={this.props.task}/>;
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
      <div className="firstTask" style={borderStyle0} onClick={(e)=>this.onPickingTask(0)}>
        <SubTaskViewComponent task={this.props.task.subTasks[0]}/>
      </div>
      <div className="secondTask" style={borderStyle1} onClick={(e)=>this.onPickingTask(1)}>
        <SubTaskViewComponent className="secondTask" task={this.props.task.subTasks[1]}/>
      </div>
    </div>
  }
}

export default withTheme(ComparisonViewComponent);
