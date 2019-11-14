import React, { Component } from 'react';

import ImageViewComponent from './ImageViewComponent';

import { Typography } from '@material-ui/core';

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
      return <Text className="itemContainer" task={this.props.task} answerCallback={(e)=>this.props.answerCallback(this.props.task)}/>;
    }
    else if(this.props.task.subType === "Image"){
      return <ImageViewComponent className="itemContainer" task={this.props.task} answerCallback={(e)=>this.props.answerCallback(this.props.task)}/>;
    }

    return <div/>;
  }
}

class ComparisonViewComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSrc: null
    }
    this.image = null;
    this.imageRef = React.createRef();
  }
  componentWillMount() {
    //db_helper.getImage(this.props.task.image, this.onReceivedImage.bind(this));
  }

  componentDidMount() {
  }

  answerCallback(task) {

  }

  render() {
    console.log("comparison task", this.props.task);
    return <div>
      <SubTaskViewComponent task={this.props.task.subTasks[0]} answerCallback={this.answerCallback.bind(this)}/>
      <SubTaskViewComponent task={this.props.task.subTasks[1]} answerCallback={this.answerCallback.bind(this)}/>
    </div>
  }
}

export default ComparisonViewComponent;
