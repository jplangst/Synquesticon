import React, { Component } from 'react';

import { withTheme } from '@material-ui/styles';

import './AOIEditorComponent.css';

class AOIComponent extends Component {
  render() {
    let theme = this.props.theme;

    if (this.props.aoi.boundingbox.length <= 0) {
      return <div className="AOI" />
    }

    var pathData = [];

    this.props.aoi.boundingbox.map((point, index) => {
      pathData.push(point[0] + ' ' + point[1]);
      return 1;
    });

    var color = this.props.aoi.isSelected ? "red" : theme.palette.secondary.main;
    var textColor = theme.palette.text.primary; //theme.palette.text.primary;
    var textBGColor = theme.palette.primary.main;
    var path = pathData.join(' ');
    var p1 = this.props.aoi.boundingbox[0];

    var strokeWidth = "0.5";

    if (this.props.aoi.isSelected) {
      return (
        <g onClick={this.props.onSelected} fontSize="3" fontFamily="sans-serif" fill="black" stroke="none">
          <polygon points={path} stroke={color} strokeWidth={strokeWidth}
            fill="none" />
            {this.props.aoi.boundingbox.map((p, ind) => {
              return <circle key={ind} cx={p[0]} cy={p[1]} r="0.75" stroke="black" fill="white" strokeWidth={strokeWidth}/>
            })}
          <text className="AOIName" x={p1[0]} y={p1[1]} dy="-1" fill={textColor}>{this.props.aoi.name}</text>
        </g>
      );
    }
    else {
      return (
        <g onClick={this.props.onSelected} fontSize="3" fontFamily="sans-serif" fill="black" stroke="none">
          <polygon points={path} stroke={color} strokeWidth={strokeWidth}
            fill="none" />
            <text className="AOIName" x={p1[0]} y={p1[1]} dy="-1" stroke={textBGColor} strokeWidth="0.4em">{this.props.aoi.name}</text>
            <text className="AOIName" x={p1[0]} y={p1[1]} dy="-1" fill={textColor}> {this.props.aoi.name} </text>
        </g>
      );
    }

  }

}

export default withTheme(AOIComponent);