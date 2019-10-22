import React, { Component } from 'react';

import AOIComponent from './AOIComponent';

import './AOIEditorComponent.css';

class AOIImageViewComponent extends Component {
  onSelectAOI(aoi) {
    if(this.props.onSelectAOI !== undefined) {
      this.props.onSelectAOI(aoi);
    }
  }

  render() {
    var tempAOI = this.props.mode !== "SELECT" ? <AOIComponent aoi={this.props.tempAOI}/> : null;
    var url = URL.createObjectURL(this.props.image);
    return (
      <div className="imagePreviewContainer"
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.props.onMouseUp}
        onMouseMove={this.props.onMouseMove}>
        <img className="imageContainer" src={url} alt="Task"
              />
        <svg id="AOICanvas" className="imageViewWithAOIs" width='100%' height='100%' viewBox="0 0 100 100" preserveAspectRatio="none">
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
