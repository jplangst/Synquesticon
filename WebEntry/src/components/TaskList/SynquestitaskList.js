import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import DragIcon from '@material-ui/icons/ControlCamera';
import DeleteIcon from '@material-ui/icons/Delete';

import { withTheme } from '@material-ui/styles';

import { Draggable } from 'react-beautiful-dnd';
import * as dnd from '../../core/beautifulDND.js';

import CollapsableContainer from '../Containers/CollapsableContainer';

import Synquestitask from '../AssetEditorComponents/TaskComponents/Synquestitask';

import './SynquestitaskList.css';

class SynquestitaskList extends Component {
  removeTask(index){
    this.props.removeCallback(index);
  }

  render() {
    const {theme} = this.props;
    let taskBgColor = theme.palette.type === "light" ? theme.palette.primary.main : theme.palette.primary.dark;

    const headerHeight = 40;

    if(this.props.taskComponents.length === 0){
      return null;
    }
    var collapsableContent = this.props.taskComponents.map((comp, index) =>
      {
        var component = <Synquestitask key={index} task={comp}/>;

        var dragSource =
        <div>
          <div className="editListItemDelBtnContainer">
            <Button style={{cursor:'pointer',width: '100%', height: headerHeight, minWidth: '30px', minHeight: '30px'}}
               size="small" onClick={this.removeTask.bind(this,index)} >
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

        return(
          <Draggable key={"synquestitskListId"+index} draggableId={"synquestitskListId"+index} index={index} shouldRespectForceTouch={false}>
          {(provided, snapshot) => (

            <div className={"editSetListItem "} key={"synquestitskListId_item"+index}
            ref={provided.innerRef}{...provided.draggableProps}
            style={{...dnd.getItemStyle(snapshot, provided.draggableProps.style, taskBgColor, taskBgColor, true),...{opacity:snapshot.isDragging?0.8:1}}}
            >
              <CollapsableContainer content={comp.displayContent} classNames="editSetCompContainer" stateChangeCallback={this.props.toggleChildCallback} index={index}
                contentClassNames="editSetCompContent" headerComponents={dragSource} dndDragHandle={provided.dragHandleProps} open={comp.openState} headerHeight={headerHeight}
                headerClassNames="editSetCompHeader" hideHeaderComponents={false} headerTitle={comp.objType} snapshotT={snapshot}
                titleVariant="body1" indentContent={20}>
                  {component}
              </CollapsableContainer>
            </div>
          )}
          </Draggable>
        );
      }
    );

    return(
      <div style={{height:'100%', width:'100%', overflowY:'auto'}}>{collapsableContent}</div>
    );
  }
}

export default withTheme(SynquestitaskList);
