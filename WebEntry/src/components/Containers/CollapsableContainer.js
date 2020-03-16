import React, { Component } from 'react';

import store from '../../core/store';
import './CollapsableContainer.css';

import Collapse from '@material-ui/core/Collapse';

import Button from '@material-ui/core/Button';

import {ArrowDropDown, ArrowDropUp} from '@material-ui/icons';
import { Typography } from '@material-ui/core';

class CollapsableContainer extends Component {
  constructor(props) {
    super(props);
    this.childComponent = props.childComponent;
    this.state = {
      open: props.open
    };

    this.dropping = false;
    this.timerID = -1;
  }

  onCollapseExpand(){
    let newState = !this.state.open;
    if(this.props.stateChangeCallback){
      this.props.stateChangeCallback(this.props.index, newState);
    }
    else{
      this.setState(state => ({ open: newState }));
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevProps.open !== this.props.open){
      this.setState({open: this.props.open});
    }

    //Check if we are drgging and set flag if we are, we use the flag to avoid flickering when dropping
    if(this.props.snapshotT && (this.props.snapshotT.isDragging && this.dropping === false)){
      this.dropping = true;
    } //This should hppen only once, prepare to reset the flag after dropping
    if(this.props.snapshotT && (this.dropping && this.props.snapshotT.isDropAnimating)){
      this.timerID = setInterval(this.dropAnimStop, 2000);
    }
  }

  //Reset the dropping flag
  dropAnimStop(){
    this.dropping = false;
    clearInterval(this.timerID);
  }

  render() {
    let useMediaQuery = this.props.useMediaQuery ? this.props.useMediaQuery : false;

    let containerHeaderStyles = null;
    let customHeaderComponentsStyles = null;
    let storeState = store.getState();
    if(useMediaQuery && storeState.windowSize.width < 1100){
      containerHeaderStyles = {flexDirection:'column'};
      customHeaderComponentsStyles = {paddingLeft:20, marginBottom:10};
    }

    var buttonIcon = this.state.open ? <ArrowDropDown fontSize="large"/> : <ArrowDropUp fontSize="large" className="rotateIcon"/>;
    var headerComponents = this.props.hideHeaderComponents ?
                              this.state.open ? this.props.headerComponents : null
                              :this.props.headerComponents;

    var headerHeight = this.props.headerHeight ? this.props.headerHeight : 50;
    var titleStyles = this.props.titleWidth ? this.props.titleWidth : {width:55};
    var titleVariant = this.props.titleVariant ? this.props.titleVariant : "h6";

    var animationTime = this.dropping ? 0 : "auto";

    return (
      <div className={this.props.classNames+" collpasedContainer"}>
        <div style={containerHeaderStyles} className={this.props.headerClassNames+" containerHeader"} {...this.props.dndDragHandle}>
          <div className="leftHeaderContent" style={{height:headerHeight}}>
            <div className="collapseBtnContainer">
              <Button style={{minHeight:0, minWidth:0, paddingLeft: 5, paddingRight:5, paddingTop:0,paddingBottom:0, height:headerHeight}} onClick={this.onCollapseExpand.bind(this)} >
                {buttonIcon}
              </Button>
            </div>
            <div className="titleContainer" style={{titleStyles}}>
              <Typography variant={titleVariant} color="textPrimary">{this.props.headerTitle}</Typography>
            </div>
          </div>
          <div style={customHeaderComponentsStyles} className="customHeaderComponents" >
            {headerComponents}
          </div>
        </div>
        <div className={this.props.contentClassNames+" collapsableContent"}>
          <Collapse in={this.state.open} timeout={animationTime} unmountOnExit >
            <div className={this.props.collasableStyles} style={{paddingLeft:this.props.indentContent?this.props.indentContent:0}}>
              {this.props.children}
            </div>
          </Collapse>
        </div>
      </div>
      );
  }
}

export default CollapsableContainer;
