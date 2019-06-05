import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import * as dbFunctions from '../../core/db_helper.js';

import './ImageViewComponent.css';

class ImageViewComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSrc: null
    }
  }
  componentDidMount() {
    //dbFunctions.getImage(this.props.task.image, this.onReceivedImage.bind(this));
    dbFunctions.getImage("window.png", this.onReceivedImage.bind(this));
  }
  onReceivedImage(img) {
    console.log("image from db", img);
    this.setState({
      imageSrc: img
    });
  }

  render() {
    if (this.state.imageSrc) {
      return (
        <div className="imageDisplay">
          <img src={this.state.imageSrc} alt="Can't find image"/>
        </div>
      );
    }
    else {
      return (<div/>);
    }
  }
}

export default ImageViewComponent;
