import React, { Component, Fragment } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend'
import Button from '@material-ui/core/Button';
import DragIcon from '@material-ui/icons/ControlCamera';

import CollapsableContainer from '../Containers/CollapsableContainer';

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

   if(this.props){
     if(props.task.question){
       content = props.task.question;
     }
     else if(props.task.name){
       content = props.task.name;
     }
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

     console.log(props);

     if(props.item){
       props.removeCallback(props.item.id);
     }
     else if(props.id){
       props.removeCallback(props.id);
     }

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

  /*< TaskListComponent reorderDisabled={true} placeholderName="TaskPlaceholder" reorderID="tasksReorder" taskList={ this.state.taskList }
    selectTask={ this.selectTask.bind(this) } selectedTask={this.state.selectedTask} dragDropCallback={this.onDragDropCallback.bind(this)}
    reactDND={false} itemType="Task"/ >*/

  render() {
    const {  connectDragSource } = this.props; //isDragging, connectDragPreview

    //const opacityValue = isDragging ? 0.8 : 1;

    if(this.props.item.objType === "Task"){ //Task is a leaf node
      if(this.props.componentDepth === 0){
        return(<div  className={"listItem "} >
              <div className={"listItemTextContainer " +this.props.highlight}>
                <div className="listItemText dotLongText">
                  {this.props.content}
                </div>
              </div>
              {connectDragSource(
              <div className="listItemDragBtnContainer">
                <Button style={{width: '100%', height: '100%', minWidth: '30px', minHeight: '30px'}}
                  className="listItemDragBtn" size="small" fullWidth>
                  <DragIcon className="dragBtnIcon"/>
                </Button>
              </div>)}
            </div>);
      }
      else{
        return(<div  className={"listItem "} >
              <div className={"listItemTextContainer " +this.props.highlight}>
                <div className="listItemText dotLongText">
                  {this.props.content}
                </div>
              </div>

            </div>);
      }
    }
    else if(this.props.item.objType === "TaskSet"){ //Is a node with children
      var newDepth = this.props.componentDepth + 1;
      const collapsableContent = this.props.item.data.map((data, index) =>
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

      if(this.props.componentDepth === 0){
        return(connectDragSource(
          <div><CollapsableContainer classNames="editSetCompContainer" contentClassNames="editSetCompContent" headerClassNames="editSetCompHeader" hideHeaderComponents={false}
            headerTitle={"MISSING from DB " + this.props.item.data.name}>
            {collapsableContent}
          </CollapsableContainer></div>
        ));
      }
      else{
        return(<CollapsableContainer classNames="editSetCompContainer" contentClassNames="editSetCompContent" headerClassNames="editSetCompHeader" hideHeaderComponents={false}
          headerTitle={"MISSING NAME FROM DB " + this.props.item.data.name}>
          {collapsableContent}
        </CollapsableContainer>);
      }
    }

    return null;
  }
}

export default DragSource(Types.ITEM, itemSource, collect)(EditSetListItemComponent);
