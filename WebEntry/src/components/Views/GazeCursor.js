import React from 'react';
import './GazeCursor.css';

import store from '../../core/store';

//var key = require('keymaster');

class GazeCursor extends React.Component {
  constructor(){
    super();
    this.state = {
      visible: true,
      locX: 0,
      locY: 0
    }
    this.handleCursorVisibility = this.toggleVisibility.bind(this);
    this.handleGazeLocUpdate = this.updateCursorLocation.bind(this);
    this.cursorRadius = 20;

    let radiusAction = {
      type: 'SET_GAZE_RADIUS',
      gazeRadius: this.cursorRadius
    }
    store.dispatch(radiusAction);

    this.frameDiv = React.createRef();
  }

  componentDidMount() {
    // key.setScope('stimuli');
    // key('g', this.handleCursorVisibility);
    this.timer = setInterval(this.handleGazeLocUpdate, 4.5); //Update the gaze cursor location every 2ms
  }

  componentWillUnmount(){
    clearInterval(this.timer);
    // key.unbind('g');
  }

  render() {
    let cursor = null;
    if(this.state.visible){
      cursor = <span className="gazeCursor" id={"gazeCursorDiv" + this.props.id}/>;
    }

    return (
      <div className="wrapper" >
        <div className="title">{this.props.participant}</div>
        <div className="frame" ref={this.frameDiv}>
          {cursor}
        </div>
      </div>
    );
  }

  updateCursorLocation(){
    try {
      let gazeLoc = store.getState().gazeData[this.props.tracker];
      //Only draw the cursor if it is visible
      if(this.state.visible && this.frameDiv){
        var cursorDiv = document.getElementById("gazeCursorDiv" + this.props.id);
        cursorDiv.style.left = (gazeLoc.locX*this.frameDiv.current.offsetWidth-this.cursorRadius)+'px';
        cursorDiv.style.top = (gazeLoc.locY*this.frameDiv.current.offsetHeight-this.cursorRadius)+'px';
        cursorDiv.style.width = this.cursorRadius*2+"px";
        cursorDiv.style.height = this.cursorRadius*2+"px";
      }

      this.setState({
        locX: gazeLoc.locX,
        locY: gazeLoc.locY
      })
    } catch (err) {

    }
  }

  toggleVisibility(){
    console.log("Gaze cursor visibility: " + !this.state.visible);
    this.setState(
      {
        visible: !this.state.visible
      }
    );
  }
}

export default GazeCursor;
