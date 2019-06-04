import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import './ImageViewComponent.css';

class ImageViewComponent extends Component {
  render() {
    return (
      <div className="imageDisplay">
        <img src={ require(this.props.image) } />
      </div>
    );
  }
}

export default ImageViewComponent;
