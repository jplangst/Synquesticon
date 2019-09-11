import React, { Component } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend'
import Button from '@material-ui/core/Button';
import DragIcon from '@material-ui/icons/ControlCamera';
import DeleteIcon from '@material-ui/icons/Delete';

import { withTheme } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

import * as listUtils from '../../core/db_objects_utility_functions';

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
   var element = document.getElementsByClassName('editSetListItem')[0];
   var positionInfo = element.getBoundingClientRect();
   var height = positionInfo.height;
   var width = positionInfo.width;

   var content = props.content ? props.content : props.item.set.name; //TODO should figure out how to pass this correctly when we have time

   const item = { height: height, width: width, content:content, index: props.index, taskId: props.id?props.id:props.item.id};
   return item;
 },
 endDrag(props, monitor, component) {
   return
 }
};

const itemTarget = {
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index;
		const hoverIndex = props.index;

		if (dragIndex === hoverIndex) {
			return;
		}

		props.moveTaskCallback(dragIndex, hoverIndex);
		monitor.getItem().index = hoverIndex;
	}
};

//Makes these variables avaliable in the react components props
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
    var id = this.props._id?this.props._id:this.props.item._id;
    this.props.removeCallback(id);
  }

  render() {
    const { theme, connectDragSource, connectDropTarget, isOver } = this.props;

    var opacity = 1;
    if(isOver){
        opacity = 0;
    }

    var task = <div className={"editListItemTextContainer "}>
                <div className="editListItemText">
                  <Typography color="textPrimary" noWrap> {this.props.content} </Typography>
                </div>
              </div>;

    if(this.props.item.objType === "Task"){
      if(this.props.componentDepth === 0){ //If it is a top level parent it should be dragable
        return(connectDropTarget(
          <div  style={{opacity:opacity }} className={"editListItem "} >
            {task}
            <div className="editListItemDelBtnContainer">
              <Button style={{cursor:'pointer',width: '100%', height: '100%', minWidth: '30px', minHeight: '30px'}}
                 size="small" onClick={this.removeTask.bind(this)}>
                <DeleteIcon />
              </Button>
            </div>
            {connectDragSource(
              <div className="editListItemDragBtnContainer">
              <Button style={{cursor:'move',width: '100%', height: '100%', minWidth: '30px', minHeight: '30px'}}
                 size="small" >
                <DragIcon />
              </Button>
            </div>)}
          </div>));
      }
      else{ //If it is a child we don't want it to be draggable
        return(<div  className={"editListItem "} >
              {task}
            </div>);
      }
    }
    else if(this.props.item.objType === "TaskSet"){ //Is a node with children
      var newDepth = this.props.componentDepth + 1;
      var collapsableContent = this.props.item.data.map((data, index) =>
        {
          var content = listUtils.getTaskContent(data);
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
             size="small" onClick={this.removeTask.bind(this)} >
            <DeleteIcon className="delBtnIcon"/>
          </Button>
        </div>
        {connectDragSource(
        <div className="editListItemDragBtnContainer">
          <Button style={{cursor:'move', width: '100%', height: '100%', minWidth: '30px', minHeight: '30px'}}
             size="small" >
            <DragIcon className="dragBtnIcon"/>
          </Button>
        </div>)}
        </div>;
        return (connectDropTarget(
          <div content={this.props.content} style={{opacity:opacity, width:'100%'}}>
            <CollapsableContainer content={this.props.content} classNames="editSetCompContainer"
              contentClassNames="editSetCompContent" headerComponents={dragSource} open={false} headerHeight={40}
              headerClassNames="editSetCompHeader" hideHeaderComponents={false} headerTitle={this.props.item.name}
              titleVariant="body1" indentContent={20}>
                {collapsableContent}
              </CollapsableContainer>
          </div>));
      }
      return(
        <div style={{paddingLeft:20*this.props.componentDepth, width:'100%'}}>
        <CollapsableContainer  classNames="editSetCompContainer" contentClassNames="editSetCompContent" headerComponents={dragSource} open={false}
        headerClassNames="editSetCompHeader" hideHeaderComponents={false} headerTitle={this.props.item.name} headerHeight={40}
        headerWidth={{flexGrow:1}} titleVariant="body1" indentContent={10}>
          {collapsableContent}
        </CollapsableContainer></div>);
    }

    return null;
  }
}

export default flow( DropTarget(Types.REORDER, itemTarget, targetConnect), DragSource(Types.REORDER, itemSource, collect))(withTheme(EditSetListItemComponent));
