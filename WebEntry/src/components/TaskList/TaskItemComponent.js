import React, { Component } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend'
import Button from '@material-ui/core/Button';
import DragIcon from '@material-ui/icons/ControlCamera';

import './TaskItemComponent.css';

import { DragSource } from 'react-dnd'
import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';

const Types = {
 ITEM: 'taskItemComp'
}
const itemSource = {
 beginDrag(props) {
   var element = document.getElementsByClassName('listItem')[0];
   var positionInfo = element.getBoundingClientRect();
   var height = positionInfo.height;
   var width = positionInfo.width;

   const item = { height: height, width: width, content: props.content };
   return item;
 },
 endDrag(props, monitor, component) {
   const dropResult = monitor.getDropResult()
   if(dropResult){
     return props.handleDrop(props.task, props.itemType);
   }
   else{
     return
   }
 }
}
function collect(connect, monitor) {
 return {
   connectDragSource: connect.dragSource(),
   isDragging: monitor.isDragging(),
   connectDragPreview: connect.dragPreview(),
 }
}

class TaskItemComponent extends Component {

  componentDidMount(){
    const { connectDragPreview } = this.props
    if(connectDragPreview){
      connectDragPreview(getEmptyImage(),{
        captureDraggingState: true,
      });
    }
  }

  render() {
    const { theme, connectDragSource} = this.props; //connectDragPreview, isDragging

    let bgColor = this.props.highlight ? theme.palette.secondary.main + "22" : null;

    //const opacityValue = isDragging ? 0.8 : 1;
    var content =
        <div  className={"listItem "} onClick={()=>this.props.onSelectedCallback(this.props.task)}>
          <div className="listItemTextContainer" style={{backgroundColor:bgColor}}>
            <div className="listItemText">
              <Typography color="textPrimary" noWrap> {this.props.content} </Typography>
            </div>
          </div>
          {connectDragSource(
          <div className="listItemDragBtnContainer">
            <Button style={{cursor:'move',width: '100%', height: '100%', minWidth: '30px', minHeight: '30px'}}
              className="listItemDragBtn" size="small" fullWidth >
              <DragIcon className="dragBtnIcon"/>
            </Button>
          </div>)}
        </div>;

    return( content );
  }
}

export default withTheme(DragSource(Types.ITEM, itemSource, collect)(TaskItemComponent));
