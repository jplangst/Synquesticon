import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withTheme } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

import PolygonToolBox from './PolygonToolBox';
import SelectAOIToolBox from './SelectAOIToolBox';

import './AOIEditorComponent.css';

class AOIToolboxComponent extends Component {
  constructor(props) {
    super(props);

    this.handleTabs = this.handleChangeTab.bind(this);
  }

  handleChangeTab(evt, mode) {
    this.props.onSwitchMode(mode);
  }

  render() {
    let theme = this.props.theme;

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
      <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
        <Typography color="textPrimary" variant="h6"> AOI creation mode </Typography>
        <Tabs
          value={this.props.mode}
          onChange={this.handleTabs}
          indicatorColor="secondary"
          variant="fullWidth"
          style={{color:theme.palette.text.primary, marginBottom:5}}
        >
            <Tab label="Rectangle" value="RECTANGLE" />
            <Tab label="Polygon" value="POLYGON" />
            <Tab label="Select" value="SELECT" />
        </Tabs>
        <div className="supportingToolBox">{toolbox}</div>
      </div>
    );
  }

}

export default withTheme(AOIToolboxComponent);
