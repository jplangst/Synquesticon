import React, { Component } from 'react';

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


    var toolbox = null;
    switch (this.props.mode) {
      case "RECTANGLE":
        break;
      case "POLYGON":
        toolbox = <PolygonToolBox onRemoveLastPoint={this.props.callbacks.onRemoveLastPoint}
                                  onFinished={this.props.callbacks.onFinished}
                                  onCancel={this.props.callbacks.onCancel}/>
        break;
      case "SELECT":
        toolbox = <SelectAOIToolBox onRename={this.props.callbacks.onRename}
                                    onRemove={this.props.callbacks.onRemove}/>
        break;
      default:
        break;
    }

    return (
      <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
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
