import React from 'react';

import { withTheme } from '@material-ui/styles';

import './AOIEditorComponent.css';

const AOIComponent = props => {
  let theme = props.theme;

  if (props.aoi.boundingbox.length <= 0) {
    return <div className="AOI" />
  }

  let pathData = [];

  props.aoi.boundingbox.map((point, index) => {
    pathData.push(point[0] + ' ' + point[1]);
    return 1;
  });

  const color = props.aoi.isSelected ? "red" : theme.palette.secondary.main;
  const textColor = theme.palette.text.primary; //theme.palette.text.primary;
  const textBGColor = theme.palette.primary.main;
  const path = pathData.join(' ');
  const p1 = props.aoi.boundingbox[0];

  const strokeWidth = "0.5";

  if (props.aoi.isSelected) {
    return (
      <g onClick={props.onSelected} fontSize="3" fontFamily="sans-serif" fill="black" stroke="none">
        <polygon points={path} stroke={color} strokeWidth={strokeWidth}
          fill="none" />
          {props.aoi.boundingbox.map((p, ind) => {
            return <circle key={ind} cx={p[0]} cy={p[1]} r="0.75" stroke="black" fill="white" strokeWidth={strokeWidth}/>
          })}
        <text className="AOIName" x={p1[0]} y={p1[1]} dy="-1" fill={textColor}>{props.aoi.name}</text>
      </g>
    );
  } else {
    return (
      <g onClick={props.onSelected} fontSize="3" fontFamily="sans-serif" fill="black" stroke="none">
        <polygon points={path} stroke={color} strokeWidth={strokeWidth}
          fill="none" />
          <text className="AOIName" x={p1[0]} y={p1[1]} dy="-1" stroke={textBGColor} strokeWidth="0.4em">{props.aoi.name}</text>
          <text className="AOIName" x={p1[0]} y={p1[1]} dy="-1" fill={textColor}> {props.aoi.name} </text>
      </g>
    );
  }
}

export default withTheme(AOIComponent);
