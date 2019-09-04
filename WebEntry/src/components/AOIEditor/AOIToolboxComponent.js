import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import PolygonToolBox from './PolygonToolBox';
import SelectAOIToolBox from './SelectAOIToolBox';

import './AOIEditorComponent.css';

class AOIToolboxComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var rectBtnColor = "default";
    var polyBtnColor = "default";
    var selectBtnColor = "default";
    var toolbox = null;
    switch (this.props.mode) {
      case "RECTANGLE":
        rectBtnColor = "primary";
        break;
      case "POLYGON":
        polyBtnColor = "primary";
        toolbox = <PolygonToolBox onRemoveLastPoint={this.props.callbacks.onRemoveLastPoint}
                                  onFinished={this.props.callbacks.onFinished}
                                  onCancel={this.props.callbacks.onCancel}/>
        break;
      case "SELECT":
        selectBtnColor = "primary";
        toolbox = <SelectAOIToolBox onRename={this.props.callbacks.onRename}
                                    onRemove={this.props.callbacks.onRemove}/>
        break;
      default:
        break;
    }

    return (
      <div>
        <Button onClick={e=>this.props.onSwitchMode("RECTANGLE")} variant="contained" color={rectBtnColor}>
          Rectangle
        </Button>
        <Button onClick={e=>this.props.onSwitchMode("POLYGON")} variant="contained" color={polyBtnColor}>
          Polygon
        </Button>
        <Button onClick={e=>this.props.onSwitchMode("SELECT")} variant="contained" color={selectBtnColor}>
          Select
        </Button>
        <div className="supportingToolBox">{toolbox}</div>
      </div>
    );
  }

}

export default AOIToolboxComponent;
