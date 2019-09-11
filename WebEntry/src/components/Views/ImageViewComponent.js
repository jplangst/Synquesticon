import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import AOIComponent from '../AOIEditor/AOIComponent';

import db_helper from '../../core/db_helper.js';
import store from '../../core/store';

import './ImageViewComponent.css';

class ImageViewComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSrc: null
    }
    this.image = null;
    this.imageRef = React.createRef();
  }
  componentWillMount() {
    db_helper.getImage(this.props.task.image, this.onReceivedImage.bind(this));
  }

  componentDidMount() {
    if (this.props.task.aois.length > 0) {
      var aois = this.props.task.aois.slice();
      for (var i = 0; i < aois.length; i++) {
        aois[i].imageRef = this.imageRef;
      }
      console.log("add aois", aois);

      var action = {
        type: 'ADD_AOIS',
        aois: aois
      }

      store.dispatch(action);
    }

  }

  onReceivedImage(img) {
    this.image = this.props.task.image;
    this.setState({
      imageSrc: img
    });
  }

  render() {
    if (this.image !== this.props.task.image) {
      db_helper.getImage(this.props.task.image, this.onReceivedImage.bind(this));
    }
    if (this.state.imageSrc) {
      return (
        <div className={this.props.className} >
          <img className="imageView" src={this.state.imageSrc} alt="Can't find image" ref={this.imageRef}/>
          <svg id="AOICanvas" className="imageViewWithAOIs" width='100%' height='100%' viewBox="0 0 100 100" preserveAspectRatio="none">
            {this.props.task.aois.map((aoi, index) => {
              return <AOIComponent aoi={aoi} key={index}/>
            })}
          </svg>

        </div>
      );
    }
    else {
      return (<div/>);
    }
  }
}

export default ImageViewComponent;
