import React, { Component } from 'react';

import AOIComponent from './AOIComponent';

import './AOIEditorComponent.css';

class AOIImageViewComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var tempAOI = this.props.mode !== "SELECT" ? <AOIComponent aoi={this.props.tempAOI}/> : null;
    return (
      <div className="imagePreviewContainer"
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.props.onMouseUp}
        onMouseMove={this.props.onMouseMove}>
        <img className="imageContainer" src={"Images/"+this.props.image} alt="Task"
              />
        <svg className="imageViewWithAOIs" width='100%' height='100%' viewBox="0 0 100 100" preserveAspectRatio="none">
          {tempAOI}
          {this.props.aois.map((aoi, index) => {
            return <AOIComponent aoi={aoi} key={index} onSelected={e => this.props.onSelectAOI(aoi)}/>
          })}
        </svg>
      </div>
    );
  }

}

export default AOIImageViewComponent;
