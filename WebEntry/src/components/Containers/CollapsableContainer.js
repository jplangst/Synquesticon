import React, { Component } from 'react';

import './CollapsableContainer.css';

import Collapse from '@material-ui/core/Collapse';

import Button from '@material-ui/core/Button';

import {ArrowDropDown, ArrowDropUp} from '@material-ui/icons';

class CollapsableContainer extends Component {
  constructor(props) {
    super(props);
    this.childComponent = props.childComponent;
    this.state = {
      open: true
    };
  }

  onCollapseExpand(){
    this.setState(state => ({ open: !state.open }));
  }

  render() {
    var buttonIcon = this.state.open ? <ArrowDropDown fontSize="large" className="collapsableIcon"/> : <ArrowDropUp fontSize="large" className="collapsableIcon rotateIcon"/>;
    var headerComponents = this.props.hideHeaderComponents ?
                              this.state.open ? this.props.headerComponents : null
                              :this.props.headerComponents;

    return (

      <div className={this.props.classNames+" collpasedContainer"}>
        <div className={this.props.headerClassNames+" containerHeader"}>
          <div className="leftHeaderContent">
            <div className="collapseBtnContainer">
              <Button className="collapseBtn" size="small" onClick={this.onCollapseExpand.bind(this)} >
                {buttonIcon}
              </Button>
              </div>
            <div className="titleContainer">
              <p className="dropdownTitle">{this.props.headerTitle}</p>
            </div>
          </div>
          <div className="customHeaderComponents">
            {headerComponents}
          </div>
        </div>
        <div className={this.props.contentClassNames+" collapsableContent"}>
          <Collapse in={this.state.open} timeout="auto" unmountOnExit >
            <div className="collapsableContentSpacer">
              {this.props.children}
            </div>
          </Collapse>
        </div>
      </div>
      );
  }
}

export default CollapsableContainer;
