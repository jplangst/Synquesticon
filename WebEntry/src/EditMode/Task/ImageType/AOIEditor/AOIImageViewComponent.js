import React, { Component } from 'react';

import AOIComponent from './AOIComponent';

import './AOIEditorComponent.css';

class AOIImageViewComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      imageWidth: 100,
      imageHeight: 100,
      imageElement: null
    }
    this.imageRef = React.createRef();
  }

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

  handleImageLoaded(){
    var image = this.imageRef.current;
    this.setState({
      imageHeight: image.height,
      imageWidth: image.width,
      imageElement: image
    });
  }

  render() {
    var tempAOI = this.props.mode !== "SELECT" ? <AOIComponent aoi={this.props.tempAOI}/> : null;
    var url = "/Images/" + this.props.imageName;
    if (this.props.image) {
      url = URL.createObjectURL(this.props.image);
    }

    var left = 0;
    if(this.state.imageElement){
      left = parseInt(this.state.imageElement.offsetLeft);
    }

    return (
      <div className="imagePreviewContainer"
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.props.onMouseUp}
        onMouseMove={this.props.onMouseMove}>
        <img className="imageCanvas" src={url} alt="Task" ref={this.imageRef}
          onLoad={this.handleImageLoaded.bind(this)}/>
        <svg style={{left:left}} id="AOICanvas" className="AOICanvas" width={this.state.imageWidth} height={this.state.imageHeight} viewBox="0 0 100 100" preserveAspectRatio="none">
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
