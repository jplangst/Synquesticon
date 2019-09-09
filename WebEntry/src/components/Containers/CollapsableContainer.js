import React, { Component } from 'react';

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
  }

  onCollapseExpand(){
    this.setState(state => ({ open: !state.open }));
  }

  render() {
    var buttonIcon = this.state.open ? <ArrowDropDown fontSize="large"/> : <ArrowDropUp fontSize="large" className="collapsableIcon rotateIcon"/>;
    var headerComponents = this.props.hideHeaderComponents ?
                              this.state.open ? this.props.headerComponents : null
                              :this.props.headerComponents;

    return (
      <div className={this.props.classNames+" collpasedContainer"}>
        <div className={this.props.headerClassNames+" containerHeader"}>
          <div className="leftHeaderContent">
            <div className="collapseBtnContainer">
              <Button style={{minHeight:0, minWidth:0, paddingLeft: 5, paddingRight:5}} onClick={this.onCollapseExpand.bind(this)} >
                {buttonIcon}
              </Button>
            </div>
            <div className="titleContainer">
              <Typography variant="h6" color="textPrimary">{this.props.headerTitle}</Typography>
            </div>
          </div>
          <div className="customHeaderComponents">
            {headerComponents}
          </div>
        </div>
        <div className={this.props.contentClassNames+" collapsableContent"}>
          <Collapse in={this.state.open} timeout="auto" unmountOnExit >
            <div>
              {this.props.children}
            </div>
          </Collapse>
        </div>
      </div>
      );
  }
}

export default CollapsableContainer;
