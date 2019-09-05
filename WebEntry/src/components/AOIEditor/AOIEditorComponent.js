import React, { Component } from 'react';

import AOIToolboxComponent from './AOIToolboxComponent';
import AOIImageViewComponent from './AOIImageViewComponent';
import AOIComponent from './AOIComponent';
import AOINameDialog from '../dialogs/AOINameDialog';

import './AOIEditorComponent.css';

class AOI {
  constructor(){
    this.name = "";
    this.points = [];
    this.isSelected = true;
  }

  convertToDBFormat() {
    var dbPoints = [];
    this.points.map((p, ind) => {
      dbPoints.push([p.X, p.Y]);
    })
    return dbPoints;
  }
}

class AOIEditorComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "RECTANGLE",
      openAOINameDialog: false
    }
    this.aois = [];
    this.p1TempAOI = null;
    this.imageRect = null;
    this.p2TempAOI = {X: -1, Y: -1};
    this.tempAOI = new AOI();

    this.callbacks = null;
  }

  /*
   ██████  █████  ██      ██      ██████   █████   ██████ ██   ██ ███████     ███████  ██████  ██████      ████████  ██████   ██████  ██      ██████   ██████  ██   ██
  ██      ██   ██ ██      ██      ██   ██ ██   ██ ██      ██  ██  ██          ██      ██    ██ ██   ██        ██    ██    ██ ██    ██ ██      ██   ██ ██    ██  ██ ██
  ██      ███████ ██      ██      ██████  ███████ ██      █████   ███████     █████   ██    ██ ██████         ██    ██    ██ ██    ██ ██      ██████  ██    ██   ███
  ██      ██   ██ ██      ██      ██   ██ ██   ██ ██      ██  ██       ██     ██      ██    ██ ██   ██        ██    ██    ██ ██    ██ ██      ██   ██ ██    ██  ██ ██
   ██████ ██   ██ ███████ ███████ ██████  ██   ██  ██████ ██   ██ ███████     ██       ██████  ██   ██        ██     ██████   ██████  ███████ ██████   ██████  ██   ██
  */

  switchMode(mode) {
    if (mode === "POLYGON") {
      this.callbacks = {
        onRemoveLastPoint: this.removeLastPointFromPolygon.bind(this),
        onFinished: this.finishDrawingPolygon.bind(this),
        onCancel: this.cancelDrawingPolygon.bind(this)
      }
    }
    if (mode === "SELECT") {
      this.callbacks = {
        onRename: this.renameAOI.bind(this),
        onRemove: this.removeAOI.bind(this)
      }
    }
    this.setState({
      mode: mode
    });
  }

  onCloseAOINameDialog (name) {
    if (name !== "") {
      this.tempAOI.name = name;
      this.tempAOI.isSelected = false;
      var newAOI = JSON.parse(JSON.stringify(this.tempAOI))
      this.aois.push(newAOI);
    }
    this.tempAOI = new AOI();
    this.imageRect = null;
    this.setState({
      openAOINameDialog: false
    });
  }

  /*
██████   ██████  ██   ██    ██  ██████   ██████  ███    ██
██   ██ ██    ██ ██    ██  ██  ██       ██    ██ ████   ██
██████  ██    ██ ██     ████   ██   ███ ██    ██ ██ ██  ██
██      ██    ██ ██      ██    ██    ██ ██    ██ ██  ██ ██
██       ██████  ███████ ██     ██████   ██████  ██   ████
*/
  removeLastPointFromPolygon() {
    if (this.tempAOI.points.length > 1) {
      this.tempAOI.points.splice(-1,1);
      this.forceUpdate();
    }
  }
  finishDrawingPolygon() {
    if (this.tempAOI.points.length < 3) {
      alert("can not create a polygon with less than 3 points");
      return;
    }
    this.setState({
      openAOINameDialog: true
    });
  }
  cancelDrawingPolygon(){
    this.tempAOI = new AOI();
    this.forceUpdate();
  }

  /*
  ███████ ███████ ██      ███████  ██████ ████████
  ██      ██      ██      ██      ██         ██
  ███████ █████   ██      █████   ██         ██
       ██ ██      ██      ██      ██         ██
  ███████ ███████ ███████ ███████  ██████    ██
  */

  onSelectAOI(aoi) {
    this.tempAOI.isSelected = false;
    this.tempAOI = aoi;
    this.tempAOI.isSelected = true;
    this.forceUpdate();
  }

  renameAOI() {
    if (this.tempAOI.name !== "") {
      this.setState({
        openAOINameDialog: true
      });
    }
  }
  removeAOI() {
    var ind = this.aois.indexOf(this.tempAOI)
    if (ind > -1) {
      this.aois.splice(ind, 1);
      this.tempAOI = new AOI();
      this.forceUpdate();
    }
  }

  /*
 ██████  █████  ██      ██      ██████   █████   ██████ ██   ██ ███████     ███████  ██████  ██████      ██ ███    ███  █████   ██████  ███████ ██    ██ ██ ███████ ██     ██
██      ██   ██ ██      ██      ██   ██ ██   ██ ██      ██  ██  ██          ██      ██    ██ ██   ██     ██ ████  ████ ██   ██ ██       ██      ██    ██ ██ ██      ██     ██
██      ███████ ██      ██      ██████  ███████ ██      █████   ███████     █████   ██    ██ ██████      ██ ██ ████ ██ ███████ ██   ███ █████   ██    ██ ██ █████   ██  █  ██
██      ██   ██ ██      ██      ██   ██ ██   ██ ██      ██  ██       ██     ██      ██    ██ ██   ██     ██ ██  ██  ██ ██   ██ ██    ██ ██       ██  ██  ██ ██      ██ ███ ██
 ██████ ██   ██ ███████ ███████ ██████  ██   ██  ██████ ██   ██ ███████     ██       ██████  ██   ██     ██ ██      ██ ██   ██  ██████  ███████   ████   ██ ███████  ███ ███
*/
  getMousePosition(e) {
    return {X: (e.clientX - this.imageRect.left)*100/this.imageRect.width,
            Y: (e.clientY - this.imageRect.top)*100/this.imageRect.height}
  }

  onMouseDown(e) {
    e.stopPropagation();
    e.preventDefault();
    if (!this.imageRect) {
      this.imageRect = e.target.getBoundingClientRect();
    }
    if (this.state.mode === "RECTANGLE") {
      this.p1TempAOI = this.getMousePosition(e);
    }
  }

  onMouseUp(e) {
    e.stopPropagation();
    e.preventDefault();
    //this.drawTempAOI(e);
    if (this.state.mode === "POLYGON") {
      this.tempAOI.points.push(this.getMousePosition(e));
      this.forceUpdate();
    }
    else if (this.state.mode === "RECTANGLE") {
      this.setState({
        openAOINameDialog: true
      });
      this.p1TempAOI = null;
    }
  }

  onMouseMove(e) {
    if (this.state.mode === "RECTANGLE") {
      e.stopPropagation();
      e.preventDefault();

      if (this.p1TempAOI) {
        var p2 = this.getMousePosition(e)
        if (p2.X !== this.p2TempAOI.X || p2.Y !== this.p2TempAOI.Y) {
          var p1 = this.p1TempAOI;

          this.tempAOI.points = [p1,
                                 { X: p2.X, Y: p1.Y},
                                 p2,
                                 { X: p1.X, Y: p2.Y}
                                ];
          this.p2TempAOI = p2;
          this.forceUpdate();
        }
      }
    }
  }

  render() {
    if (this.state.mode === "SELECT") {
      var imageReview = <AOIImageViewComponent image={this.props.image}
                                               aois={this.aois}
                                               mode={this.state.mode}
                                               onSelectAOI={this.onSelectAOI.bind(this)}
                                               />
    }
    else {
      var imageReview = <AOIImageViewComponent image={this.props.image}
                                               aois={this.aois}
                                               mode={this.state.mode}
                                               tempAOI={this.tempAOI}
                                               onMouseDown={this.onMouseDown.bind(this)}
                                               onMouseUp={this.onMouseUp.bind(this)}
                                               onMouseMove={this.onMouseMove.bind(this)}/>
    }

    return (
      <div className="AOIEditor">
        <AOIToolboxComponent onSwitchMode={this.switchMode.bind(this)}
                             mode={this.state.mode}
                             callbacks={this.callbacks}/>

        {imageReview}
        <AOINameDialog name={this.tempAOI.name} openDialog={this.state.openAOINameDialog} closeDialog={this.onCloseAOINameDialog.bind(this)}/>
      </div>
    );
  }

}

export default AOIEditorComponent;
