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
   const item = { src: props.src, id: props.id };
   return item;
 },
 endDrag(props, monitor, component) {
   const dropResult = monitor.getDropResult()
   if(dropResult){
     console.log("DROPPED");
     console.log(dropResult);
     return props.handleDrop(props.task);
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

    const { isDragging, connectDragSource, connectDragPreview} = this.props;

    const opacityValue = isDragging ? 0.8 : 1;
    var content = <div  className={"listItem "} onClick={()=>this.props.onSelectedCallback(this.props.task)}>
          <div className={"listItemTextContainer " +this.props.highlight}>
            <div className="listItemText dotLongText">
              {this.props.task.question}
              {this.props.task.name}
            </div>
          </div>
          {connectDragSource(
          <div className="listItemDragBtnContainer">
            <Button style={{width: '100%', height: '100%', minWidth: '30px', minHeight: '30px'}}
              className="listItemDragBtn" size="small" fullWidth onClick={()=>{
                this.props.startDragCallback(this.props.task);
              }}>
              <DragIcon className="dragBtnIcon"/>
            </Button>
          </div>)}
        </div>;

    return( content );
  }
}

export default DragSource(Types.ITEM, itemSource, collect)(TaskItemComponent);
