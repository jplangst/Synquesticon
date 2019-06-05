import React, { Component } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend'
import Button from '@material-ui/core/Button';
import DragIcon from '@material-ui/icons/ControlCamera';

import './TaskItemComponent.css';

import { DragSource } from 'react-dnd'

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
     console.log("DROPPED");
     console.log(dropResult);
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

    const { connectDragSource} = this.props; //connectDragPreview, isDragging

    //const opacityValue = isDragging ? 0.8 : 1;
    var content = <div  className={"listItem "} onClick={()=>this.props.onSelectedCallback(this.props.task)}>
          <div className={"listItemTextContainer " +this.props.highlight}>
            <div className="listItemText dotLongText">
              {this.props.content}
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

export default DragSource(Types.ITEM, itemSource, collect)(TaskItemComponent);
