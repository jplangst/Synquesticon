import React, { Component, Fragment } from 'react';
import { findDOMNode } from 'react-dom';
import { getEmptyImage } from 'react-dnd-html5-backend'
import Button from '@material-ui/core/Button';
import DragIcon from '@material-ui/icons/ControlCamera';
import DeleteIcon from '@material-ui/icons/Delete';

import CollapsableContainer from '../Containers/CollapsableContainer';

import './EditSetListItemComponent.css';

import { DragSource, DropTarget } from 'react-dnd'

import flow from 'lodash/flow';

const Types = {
 ITEM: 'taskItemComp',
 REORDER: 'taskReorder'
};
const itemSource = {
 beginDrag(props) {
   var element = document.getElementsByClassName('listItem')[0];
   var positionInfo = element.getBoundingClientRect();
   var height = positionInfo.height;
   var width = positionInfo.width;

   const item = { height: height, width: width, content:props.content, index: props.index, taskId: props.id?props.id:props.item.id};
   return item;
 },
 endDrag(props, monitor, component) {
   const dropResult = monitor.getDropResult()
   if(dropResult){

   }
   else{
     //const item = monitor.getItem();
     //console.log(item);
     //props.removeCallback(item.taskId);
   }

   return
 }
};

const itemTarget = {
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index;
		const hoverIndex = props.index;

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return;
		}

		// Determine rectangle on screen
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

		// Determine mouse position
		const clientOffset = monitor.getClientOffset();

		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top;

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return;
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return;
		}

		// Time to actually perform the action
		//if ( props.listId === sourceListId ) {

			props.moveTaskCallback(dragIndex, hoverIndex);

			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			monitor.getItem().index = hoverIndex;
		//}
	}
};

function collect(connect, monitor) {
 return {
   connectDragSource: connect.dragSource(),
   isDragging: monitor.isDragging(),
   monitorTest: monitor,
   connectDragPreview: connect.dragPreview(),
 }
}

function targetConnect(connect, monitor){
  return{connectDropTarget: connect.dropTarget(), isOver: monitor.isOver(),};
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

  removeTask(){
    var id = this.props.id?this.props.id:this.props.item.id;
    this.props.removeCallback(id);
  }

  render() {
    const {  connectDragSource, connectDropTarget, isDragging, isOver } = this.props; //isDragging, connectDragPreview

    var opacity = 1;
    if(isOver){
      //console.log(this.props.index + ' ' + this.props.monitorTest.getItem().index);

      //if(this.props.index === this.props.monitorTest.getItem().index){
        opacity = 0.5;
      //}
    }

    if(this.props.item.objType === "Task"){ //Task is a leaf node
      if(this.props.componentDepth === 0){
        return(connectDropTarget(<div  style={{opacity:opacity }} className={"editListItem "} >
              <div className={"editListItemTextContainer " +this.props.highlight}>
                <div className="editListItemText dotLongText">
                  {this.props.content}
                </div>
              </div>
              <div className="editListItemDelBtnContainer">
                <Button style={{cursor:'pointer',width: '100%', height: '100%', minWidth: '30px', minHeight: '30px'}}
                  className="editListItemDragBtn" size="small" fullWidth onClick={this.removeTask.bind(this)}>
                  <DeleteIcon className="delBtnIcon"/>
                </Button>
              </div>
              {connectDragSource(
                <div className="editListItemDragBtnContainer">
                <Button style={{cursor:'move',width: '100%', height: '100%', minWidth: '30px', minHeight: '30px'}}
                  className="editListItemDragBtn" size="small" fullWidth >
                  <DragIcon className="dragBtnIcon"/>
                </Button>
              </div>)}


            </div>));
      }
      else{
        return(<div  className={"editListItem "} >
              <div className={"editListItemTextContainer " +this.props.highlight}>
                <div className="editListItemText dotLongText">
                  {this.props.content}
                </div>
              </div>

            </div>);
      }
    }
    else if(this.props.item.objType === "TaskSet"){ //Is a node with children
      var newDepth = this.props.componentDepth + 1;
      var collapsableContent = this.props.item.data.map((data, index) =>
        {
          var content = null;
          if(data.objType === "Task"){
            if(data.taskType === "Question" || data.taskType === "Complex"){
              content = data.question;
            }
            else if(data.taskType === "Instruction"){
              content = data.instruction;
            }
          }
          else if(data.objType === "TaskSet"){
            content = data.name;
          }
          return <EditSetListItemComponent key={index} removeCallback={this.props.removeTaskCallback} item={data} content={content} componentDepth={newDepth} />
        }
      );

      collapsableContent = <div className="collapsedItemListWrapper">{collapsableContent}</div>;

      var dragSource = null;
      if(this.props.componentDepth === 0){
        dragSource =
        <div>
        <div className="editListItemDelBtnContainer">
          <Button style={{cursor:'pointer',width: '100%', height: '100%', minWidth: '30px', minHeight: '30px'}}
            className="editListItemDragBtn" size="small" fullWidth onClick={this.removeTask.bind(this)} >
            <DeleteIcon className="delBtnIcon"/>
          </Button>
        </div>
        {connectDragSource(
        <div className="editListItemDragBtnContainer">
          <Button style={{cursor:'move', width: '100%', height: '100%', minWidth: '30px', minHeight: '30px'}}
            className="editListItemDragBtn" size="small" fullWidth>
            <DragIcon className="dragBtnIcon"/>
          </Button>
        </div>)}
        </div>;

        return (connectDropTarget(<div style={{opacity:opacity }}><CollapsableContainer content={this.props.content} classNames="editSetCompContainer" contentClassNames="editSetCompContent" headerComponents={dragSource} open={false}
          headerClassNames="editSetCompHeader" hideHeaderComponents={false} headerTitle={"MISSING from DB " + this.props.item.data.name}>
          {collapsableContent}
        </CollapsableContainer></div>));
      }
      return(<CollapsableContainer classNames="editSetCompContainer" contentClassNames="editSetCompContent" headerComponents={dragSource} open={false}
        headerClassNames="editSetCompHeader" hideHeaderComponents={false} headerTitle={"MISSING from DB " + this.props.item.data.name}>
        {collapsableContent}
      </CollapsableContainer>);
    }

    return null;
  }
}

export default flow( DropTarget(Types.REORDER, itemTarget, targetConnect), DragSource(Types.REORDER, itemSource, collect))(EditSetListItemComponent);
