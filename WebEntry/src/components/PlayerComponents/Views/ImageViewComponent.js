import React, { Component } from 'react';

import AOIComponent from '../../../EditMode/Task/ImageType/AOIEditor/AOIComponent';

import store from '../../../core/store';
import * as playerUtils from '../../../core/player_utility_functions';

import './ImageViewComponent.css';

var CLICK_RADIUS = "1";
var OPACITY = "0.5";
var COLOR = "red";

class ImageViewComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSrc: null,
      imageWidth: 100,
      imageHeight: 100,
      imageElement: null
    }
    this.image = null;
    this.imageRef = React.createRef();
    this.clicks = [];
  }

  componentWillMount() {
    this.image = new Image();
    this.image.src = "/Images/" + this.props.task.image;
    this.image.ref = this.imageRef;
  }

  componentDidMount() {

    /*this.image = new Image();
    this.image.src = "/Images/" + this.props.task.image;
    this.image.ref = this.imageRef;*/

    window.addEventListener("resize", this.handleImageLoaded.bind(this));

    if (this.props.task.aois.length > 0) {
      var aois = this.props.task.aois.slice();
      for (var i = 0; i < aois.length; i++) {
        aois[i].imageRef = this.imageRef;
      }

      var action = {
        type: 'ADD_AOIS',
        aois: aois
      }

      store.dispatch(action);
    }
    var imageAOIAction = {
      type: 'ADD_AOIS',
      aois: {
        name: this.props.parentSet + '_' + this.props.task.displayText,
        boundingbox: [],
        imageRef: this.imageRef
      }
    }
    store.dispatch(imageAOIAction);
  }

  componentWillUnmount(){
    window.removeEventListener("resize", this.handleImageLoaded.bind(this));
  }

  onReceivedImage(img) {
    this.image = this.props.task.image;
    this.setState({
      imageSrc: img
    });
  }

  getMousePosition(e) {
    var imageRect = e.target.getBoundingClientRect();
    return {x : (e.clientX - imageRect.left)/imageRect.width,
            y: (e.clientY - imageRect.top)/imageRect.height}
  }

  normalizeBoundingBoxes(boundingBox,imageDivRectangle,polygonList){
      var x = boundingBox[0]*imageDivRectangle.width/100 + imageDivRectangle.x;
      var y = boundingBox[1]*imageDivRectangle.height/100 + imageDivRectangle.y;
      return [x,y];
  }

  checkHitAOI(click) {
    // TODO:
    var aois = store.getState().aois;

    for (var i = 0; i < aois.length; i++) {
      var a = aois[i];

      if(a.imageRef.current === null){
        return;
      }

      var imageDivRect = a.imageRef.current.getBoundingClientRect();
      var polygon = [];
      if (a.boundingbox.length > 0) {
        for(let boundingbox of a.boundingbox){
          polygon.push(this.normalizeBoundingBoxes(boundingbox,imageDivRect));
        }
      }
      else {
        polygon.push([imageDivRect.x, imageDivRect.y]);
        polygon.push([imageDivRect.x + imageDivRect.width, imageDivRect.y]);
        polygon.push([imageDivRect.x + imageDivRect.width, imageDivRect.y + imageDivRect.height]);
        polygon.push([imageDivRect.x, imageDivRect.y + imageDivRect.height]);
      }

      if (playerUtils.pointIsInPoly([click.clientX, click.clientY], polygon)){
        return a.name;
      }
    }

    return null;
  }

  onImageClicked(e) {
    var mouseClick = this.getMousePosition(e);
    var click = {
      aoi: this.checkHitAOI(e),
      x: mouseClick.x,
      y: mouseClick.y
    };
    this.clicks.push(click);
    var answerObj = {
      clickedPoints: this.clicks,
      taskID: this.props.task._id,
      mapID: this.props.mapID,
    };
    this.props.answerCallback(answerObj);
    this.forceUpdate();
  }

  getClickableComponent() {
    if (this.props.task.recordClicks) {
      var left = 0;
      if(this.state.imageElement){
        left = parseInt(this.state.imageElement.offsetLeft);
      }

      return (
        <svg onClick={this.onImageClicked.bind(this)} style={{left:left}} className="clickableCanvas"
            width={this.state.imageWidth} opacity={OPACITY} height={this.state.imageHeight} viewBox="0 0 100 100"
            preserveAspectRatio="none">
          <g stroke="none" fill="black">
            {this.clicks.map((item, index) => {
              return <ellipse key={index} cx={item.x*100} cy={item.y*100} rx={CLICK_RADIUS}
                ry={CLICK_RADIUS*1.8}  fill={COLOR} style={{pointerEvents:'none'}}/>
            })}
          </g>
        </svg>);
    }
    else {
      return null;
    }
  }

  getFullScreenImage() {
    if (this.props.task.fullScreenImage) {
      return "fullScreenImage";
    }
    else {
      return "imageCanvas";
    }
  }

  showAOIs() {
    if (this.props.task.showAOIs) {

      var left = 0;
      if(this.state.imageElement){
        left = parseInt(this.state.imageElement.offsetLeft);
      }

      return (
        <svg id={this.props.key + "AOICanvas"} style={{left:left,pointerEvents:'none'}} className="AOICanvas"
          width={this.state.imageWidth} height={this.state.imageHeight} viewBox="0 0 100 100" preserveAspectRatio="none">
          {this.props.task.aois.map((aoi, index) => {
            return <AOIComponent aoi={aoi} key={index}/>
          })}
        </svg>
      );
    }
    else {
      return null;
    }
  }

  handleImageLoaded(){
    if(this.imageRef && this.imageRef.current){
      var image = this.imageRef.current;
      this.setState({
        imageHeight: image.height,
        imageWidth: image.width,
        imageElement: image
      });
    }
  }

  render() {
    var url = "/Images/" + this.props.task.image;

    var clickable = null;
    var aois = null;
    if(this.state.imageElement){
      clickable = this.getClickableComponent();
      aois = this.showAOIs();
    }

    return (
      <div className="imagePreviewContainer">
        <img className={this.getFullScreenImage()} src={url} alt="" ref={this.imageRef}
          onLoad={this.handleImageLoaded.bind(this)}/>
        {clickable}
        {aois}
      </div>
    );
  }
}

export default ImageViewComponent;
