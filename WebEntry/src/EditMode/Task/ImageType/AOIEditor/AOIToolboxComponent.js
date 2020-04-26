import React from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withTheme } from '@material-ui/styles';


import PolygonToolBox from './PolygonToolBox';
import SelectAOIToolBox from './SelectAOIToolBox';

import './AOIEditorComponent.css';

const AOIToolboxComponent = props => {
  const handleChangeTab = (evt, mode) => {
    props.onSwitchMode(mode);
  }

  let theme = props.theme;
  let toolbox = null;

  switch (props.mode) {
    case "RECTANGLE":
      break;
    case "POLYGON":
      toolbox = <PolygonToolBox onRemoveLastPoint={props.callbacks.onRemoveLastPoint}
                                onFinished={props.callbacks.onFinished}
                                onCancel={props.callbacks.onCancel}/>
      break;
    case "SELECT":
      toolbox = <SelectAOIToolBox onRename={props.callbacks.onRename}
                                  onRemove={props.callbacks.onRemove}/>
      break;
    default:
      break;
  }

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
      <Tabs
        value={props.mode}
        onChange={handleChangeTab}
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

export default withTheme(AOIToolboxComponent);