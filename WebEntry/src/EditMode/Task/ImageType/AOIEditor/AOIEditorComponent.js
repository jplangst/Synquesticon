import React, { Component } from 'react';

import AOIToolboxComponent from './AOIToolboxComponent';
import AOIImageViewComponent from './AOIImageViewComponent';
import AOINameDialog from './AOINameDialog';

import './AOIEditorComponent.css';

class AOI {
  constructor(){
    this.name = "";
    this.boundingbox = [];
    this.isSelected = true;
  }
}

class AOIEditorComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "RECTANGLE",
      openAOINameDialog: false
    }
    this.p1TempAOI = null;
    this.imageRect = null;
    this.p2TempAOI = [-1, -1];
    this.tempAOI = new AOI();

    this.callbacks = null;
  }

  componentDidMount() {
    var aoiCanvas = document.getElementById("AOICanvas");
    if (aoiCanvas) {
      this.imageRect = aoiCanvas.getBoundingClientRect();
    }
  }

  componentWillUnmount() {
    this.tempAOI.isSelected = false;
    this.tempAOI = new AOI();
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
    else {
      this.tempAOI.isSelected = false;
      this.tempAOI = new AOI();
    }
    this.setState({
      mode: mode
    });
  }

  onCloseAOINameDialog (name) {
    if (name !== "") {
      try {
        this.tempAOI.name = name;
        this.tempAOI.isSelected = false;
        var newAOI = {
          name: this.tempAOI.name,
          boundingbox: this.tempAOI.boundingbox
          //JSON.parse(JSON.stringify(this.tempAOI));
        }
        this.props.task.aois.push(newAOI);
      }
      catch (exp) {
        alert("something went wrong, please try again");
      }
    }
    this.tempAOI = new AOI();
    //this.imageRect = null;
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
    if (this.tempAOI.boundingbox.length > 0) {
      this.tempAOI.boundingbox.splice(-1,1);
      this.forceUpdate();
    }
  }
  finishDrawingPolygon() {
    if (this.tempAOI.boundingbox.length < 3) {
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
    var ind = this.props.task.aois.indexOf(this.tempAOI)
    if (ind > -1) {
      this.props.task.aois.splice(ind, 1);
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
    if (this.imageRect) {
      return [(e.clientX - this.imageRect.left)*100/this.imageRect.width,
              (e.clientY - this.imageRect.top)*100/this.imageRect.height]
    }
  }

  onMouseDown(e) {
    e.stopPropagation();
    e.preventDefault();

    if (e.target.id === "AOICanvas") {
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
      this.tempAOI.boundingbox.push(this.getMousePosition(e));
      this.forceUpdate();
    }
    else if (this.state.mode === "RECTANGLE") {
      if (this.tempAOI.boundingbox.length >= 3) {
        this.setState({
          openAOINameDialog: true
        });
      }
      this.p1TempAOI = null;
    }
  }

  onMouseMove(e) {
    if (this.state.mode === "RECTANGLE") {
      e.stopPropagation();
      e.preventDefault();

      if (this.p1TempAOI) {
        var p2 = this.getMousePosition(e)
        if (p2[0] !== this.p2TempAOI[0] || p2[1] !== this.p2TempAOI[1]) {
          var p1 = this.p1TempAOI;

          this.tempAOI.boundingbox = [p1,
                                      [p2[0], p1[1]],
                                      p2,
                                      [p1[0], p2[1]]
                                ];
          this.p2TempAOI = p2;
          this.forceUpdate();
        }
      }
    }
  }

  render() {
    var imagePreview = null;
    if (this.state.mode === "SELECT") {
      imagePreview = <AOIImageViewComponent    imageName={this.props.task.image}
                                               image={this.props.image}
                                               aois={this.props.task.aois}
                                               mode={this.state.mode}
                                               onSelectAOI={this.onSelectAOI.bind(this)}
                                               preview={this.props.preview}
                                               />
    }
    else {
      imagePreview = <AOIImageViewComponent    imageName={this.props.task.image}
                                               image={this.props.image}
                                               aois={this.props.task.aois}
                                               mode={this.state.mode}
                                               tempAOI={this.tempAOI}
                                               onMouseDown={this.onMouseDown.bind(this)}
                                               onMouseUp={this.onMouseUp.bind(this)}
                                               onMouseMove={this.onMouseMove.bind(this)}
                                               preview={this.props.preview}
                                               />
    }

    return (
      <div className="AOIEditor">
        {imagePreview}
        <AOIToolboxComponent onSwitchMode={this.switchMode.bind(this)}
                             mode={this.state.mode}
                             callbacks={this.callbacks}/>
        <AOINameDialog name={this.tempAOI.name} openDialog={this.state.openAOINameDialog} closeDialog={this.onCloseAOINameDialog.bind(this)}/>
      </div>
    );
  }

}

export default AOIEditorComponent;
