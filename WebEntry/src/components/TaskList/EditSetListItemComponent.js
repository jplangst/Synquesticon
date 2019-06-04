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

   var content = "";
   if(props.task.question){
     content = props.task.question;
   }
   else if(props.task.name){
     content = props.task.name;
   }

   const item = { height: height, width: width, content:content };
   return item;
 },
 endDrag(props, monitor, component) {
   const dropResult = monitor.getDropResult()
   if(dropResult){
     console.log("DROPPED");
     console.log(dropResult);

     //TODO handle sorting here
     //return props.handleDrop(props.task, props.itemType);
   }
   else{
     props.removeCallback(props.task.id);
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

class EditSetListItemComponent extends Component {

  componentDidMount(){
    const { connectDragPreview } = this.props
    if(connectDragPreview){
      connectDragPreview(getEmptyImage(),{
        captureDraggingState: true,
      });
    }
  }

  render() {
    const { isDragging, connectDragSource, connectDragPreview} = this.props;

    const opacityValue = isDragging ? 0.8 : 1;

    var content = <div  className={"listItem "} >
          <div className={"listItemTextContainer " +this.props.highlight}>
            <div className="listItemText dotLongText">
              {this.props.task.id}
            </div>
          </div>
          {connectDragSource(
          <div className="listItemDragBtnContainer">
            <Button style={{width: '100%', height: '100%', minWidth: '30px', minHeight: '30px'}}
              className="listItemDragBtn" size="small" fullWidth>
              <DragIcon className="dragBtnIcon"/>
            </Button>
          </div>)}
        </div>;

    return( content );
  }
}

export default DragSource(Types.ITEM, itemSource, collect)(EditSetListItemComponent);
