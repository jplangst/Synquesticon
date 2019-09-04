import React, { Component } from 'react';

import './AOIEditorComponent.css';

class AOIComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.aoi.points.length <= 0) {
      return <div className="AOI" />
    }

    var pathData = [];

    this.props.aoi.points.map((point, index) => {
      pathData.push(point.X + ' ' + point.Y);
    });

    var color = this.props.aoi.isSelected ? "red" : "blue";
    var path = pathData.join(' ');
    var p1 = this.props.aoi.points[0];

    var strokeWidth = "0.5";

    if (this.props.aoi.isSelected) {
      return (
        <g onClick={this.props.onSelected} fontSize="3" fontFamily="sans-serif" fill="black" stroke="none">
          <polygon points={path} stroke={color} strokeWidth={strokeWidth}
            fill="none" />
            {this.props.aoi.points.map((p, ind) => {
              return <circle key={ind} cx={p.X} cy={p.Y} r="0.75" stroke="black" fill="white" strokeWidth={strokeWidth}/>
            })}
          <text className="AOIName" x={p1.X} y={p1.Y} dy="-1">{this.props.aoi.name}</text>
        </g>
      );
    }
    else {
      return (
        <g onClick={this.props.onSelected} fontSize="3" fontFamily="sans-serif" fill="black" stroke="none">
          <polygon points={path} stroke={color} strokeWidth={strokeWidth}
            fill="none" />
          <text className="AOIName" x={p1.X} y={p1.Y} dy="-1">{this.props.aoi.name}</text>
        </g>
      );
    }

  }

}

export default AOIComponent;
