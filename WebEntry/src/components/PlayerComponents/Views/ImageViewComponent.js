import React, { Component } from 'react';

import AOIComponent from '../../../EditMode/Task/ImageType/AOIEditor/AOIComponent';

import store from '../../../core/store';
import * as playerUtils from '../../../core/player_utility_functions';

import './ImageViewComponent.css';

var CLICK_RADIUS = "5";
var OPACITY = "0.5";
var COLOR = "red";

class ImageViewComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSrc: null
    }
    this.image = null;
    this.imageRef = React.createRef();
    this.clicks = [];
  }
  componentWillMount() {
    //db_helper.getImage(this.props.task.image, this.onReceivedImage.bind(this));
    //
    this.image = new Image();
    this.image.src = "/Images/" + this.props.task.image;
    this.image.ref = this.imageRef;
  }

  componentDidMount() {


    /*this.image = new Image();
    this.image.src = "/Images/" + this.props.task.image;
    this.image.ref = this.imageRef;*/

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

  checkHitAOI(click) {
    // TODO:
    var aois = store.getState().aois;

    for (var i = 0; i < aois.length; i++) {
      var a = aois[i];

      //console.log("imageDiv", a.imageRef.ge, a.imageWrapper.current);
      var imageDivRect = a.imageRef.current.getBoundingClientRect();
      var polygon = [];
      if (a.boundingbox.length > 0) {
        a.boundingbox.map((p, ind) => {
          var x = p[0]*imageDivRect.width/100 + imageDivRect.x;
          var y = p[1]*imageDivRect.height/100 + imageDivRect.y;
          polygon.push([x, y]);
          return 1;
        });
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
      return (
        <svg onClick={this.onImageClicked.bind(this)} className="clickableCanvas" width='100%' height='100%' viewBox="0 0 100 100">
          <g stroke="none" fill="black">
            {this.clicks.map((item, index) => {
              return <circle cx={item.x*100} cy={item.y*100} r={CLICK_RADIUS} opacity={OPACITY} fill={COLOR}/>
            })}
          </g>
        </svg>);
    }
    else {
      return null;
    }
  }

  getFullScreenImage() {
    console.log("show fullscreen", this.props.task.fullScreenImage);
    if (this.props.task.fullScreenImage) {
      return "fullScreenImage";
    }
    else {
      return "imageCanvas";
    }
  }

  showAOIs() {
    if (this.props.task.showAOIs) {
      return (
        <svg id={this.props.key + "AOICanvas"} className="AOICanvas" width='100%' height='100%' viewBox="0 0 100 100" preserveAspectRatio="none">
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

  render() {

    //if (this.state.imageSrc) {
    var url = "/Images/" + this.props.task.image;

    return (
      <div className="imagePreviewContainer">
        <img className={this.getFullScreenImage()} src={url} alt="" ref={this.imageRef}/>
        {this.getClickableComponent()}
        {this.showAOIs()}
      </div>
    );
    // }
    // else {
    //   return (<div/>);
    // }
  }
}

export default ImageViewComponent;
