import React, { Component } from 'react';

import AOIComponent from './AOIComponent';

import './AOIEditorComponent.css';

class AOIImageViewComponent extends Component {
  onSelectAOI(aoi) {
    if(this.props.onSelectAOI !== undefined) {
      this.props.onSelectAOI(aoi);
    }
  }

  componentDidMount() {
    //db_helper.getImage(this.props.task.image, this.onReceivedImage.bind(this));
    //

    //Force preload the image
    var url = "/Images/" + this.props.imageName;
    if (this.props.image) {
      url = URL.createObjectURL(this.props.image);
      const img = document.createElement('img');
      img.src = url;
    }
  }

  render() {
    var tempAOI = this.props.mode !== "SELECT" ? <AOIComponent aoi={this.props.tempAOI}/> : null;
    var url = "/Images/" + this.props.imageName;
    if (this.props.image) {
      url = URL.createObjectURL(this.props.image);
    }


    return (
      <div className="imagePreviewContainer"
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.props.onMouseUp}
        onMouseMove={this.props.onMouseMove}>
        <img className="imageCanvas" src={url} alt="Task"/>
        <svg id="AOICanvas" className="AOICanvas" width='100%' height='100%' viewBox="0 0 100 100" preserveAspectRatio="none">
          {tempAOI}
          {this.props.aois.map((aoi, index) => {
            return <AOIComponent aoi={aoi} key={index} onSelected={e => this.onSelectAOI(aoi)}/>
          })}
        </svg>
      </div>
    );
  }

}

export default AOIImageViewComponent;
