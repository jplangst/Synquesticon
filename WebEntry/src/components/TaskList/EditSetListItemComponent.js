import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import DragIcon from '@material-ui/icons/ControlCamera';
import DeleteIcon from '@material-ui/icons/Delete';

import { withTheme } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

import * as listUtils from '../../core/db_objects_utility_functions';

import CollapsableContainer from '../Containers/CollapsableContainer';

import './EditSetListItemComponent.css';

class EditSetListItemComponent extends Component {
  removeTask(){
    var id = this.props._id?this.props._id:this.props.item._id;
    this.props.removeCallback(id);
  }

  render() {
    const headerHeight = 40;

    var task = <div className={"editListItemTextContainer "}>
                <div className="editListItemText">
                  <Typography color="textPrimary" noWrap> {this.props.content} </Typography>
                </div>
              </div>;

    if(this.props.item.objType === "Task"){
      if(this.props.componentDepth === 0){ //If it is a top level parent it should be dragable
        return(
          <div className={"editListItem "} >
            {task}
            <div className="editListItemDelBtnContainer">
              <Button style={{cursor:'pointer',width: '100%', height: headerHeight, minWidth: '30px', minHeight: '30px'}}
                 size="small" onClick={this.removeTask.bind(this)}>
                <DeleteIcon />
              </Button>
            </div>
            <div className="editListItemDragBtnContainer">
              <Button style={{cursor:'move',width: '100%', height: headerHeight, minWidth: '30px', minHeight: '30px'}}
                 size="small" >
                <DragIcon />
              </Button>
            </div>
          </div>);
      }
      else{ //If it is a child we don't want it to be draggable
        return(<div className={"editListItem "} >
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
            <Button style={{cursor:'pointer',width: '100%', height: headerHeight, minWidth: '30px', minHeight: '30px'}}
               size="small" onClick={this.removeTask.bind(this)} >
              <DeleteIcon className="delBtnIcon"/>
            </Button>
          </div>
          <div className="editListItemDragBtnContainer">
            <Button style={{cursor:'move', width: '100%', height: headerHeight, minWidth: '30px', minHeight: '30px'}}
               size="small" >
              <DragIcon className="dragBtnIcon"/>
            </Button>
          </div>
        </div>;

        return (
          <div content={this.props.content} style={{width:'100%'}}>
            <CollapsableContainer content={this.props.content} classNames="editSetCompContainer"
              contentClassNames="editSetCompContent" headerComponents={dragSource} open={false} headerHeight={headerHeight}
              headerClassNames="editSetCompHeader" hideHeaderComponents={false} headerTitle={this.props.item.name}
              titleVariant="body1" indentContent={20}>
                {collapsableContent}
              </CollapsableContainer>
          </div>);
      }
      return(
        <div style={{paddingLeft:20*this.props.componentDepth, width:'100%'}}>
        <CollapsableContainer  classNames="editSetCompContainer" contentClassNames="editSetCompContent" headerComponents={dragSource} open={false}
        headerClassNames="editSetCompHeader" hideHeaderComponents={false} headerTitle={this.props.item.name} headerHeight={headerHeight}
        headerWidth={{flexGrow:1}} titleVariant="body1" indentContent={10}>
          {collapsableContent}
        </CollapsableContainer></div>);
    }

    return null;
  }
}

export default withTheme(EditSetListItemComponent);
