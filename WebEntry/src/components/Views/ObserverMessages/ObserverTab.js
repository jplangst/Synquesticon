import React, { Component } from 'react';

import store from '../../../core/store';

//Components
import Button from '@material-ui/core/Button';
import PauseIcon from '@material-ui/icons/PauseCircleOutline';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/styles';
import ButtonBase from '@material-ui/core/ButtonBase';

import wamp from '../../../core/wamp';

class ObserverTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      forcedPause: this.props.shouldPause,
      isPaused: false,
    };

    this.onButtonPress = this.onButtonPressed.bind(this);
    this.onTabPress = this.onTabPressed.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if(props.shouldPause !== state.forcedPause){
      return {forcedPause: props.shouldPause,
              isPaused: props.shouldPause};
    }

    return null;
  }

  onTabPressed(evt){
    evt.stopPropagation();
    evt.preventDefault();
    this.props.tabPressedCallback(this.props.index);

    return false;
  }

  onButtonPressed(evt){
    evt.stopPropagation();
    evt.preventDefault();
    wamp.broadcastCommands(JSON.stringify({
                            commandType: !this.state.isPaused ? "PAUSE" : "RESUME",
                            participantId: this.props.participantId
                           }));
    if(!this.state.forcedPause){
      this.setState({
        isPaused: !this.state.isPaused,
      });
    }

    return false;
  }

  render() {
    let theme = this.props.theme;

    var activeTextStyle = this.props.isActive ? {color:theme.palette.secondary.main} : {color:theme.palette.text.primary}
    var activeUnderlineStyle = {boxShadow:'0 0 8px -6px' + this.props.isActive ? theme.palette.secondary.main : 'grey'}

    var shouldHighlight = window.matchMedia("(any-pointer: coarse)").matches ? activeUnderlineStyle : {};


    var buttonIcon = null;
    if(this.state.isPaused || this.state.forcedPause){
      buttonIcon = <PauseIcon style={{display:'flex', position: 'absolute', height: '100%', width: 'auto', maxWidth: '100%', flexGrow: 1}} />;
    }
    else{
      buttonIcon = <PlayIcon style={{display:'flex', position: 'absolute', height: '100%', width: 'auto', maxWidth: '100%', flexGrow: 1}} />;
    }

    let storeState = store.getState();
    var participantBigScreen = null;
    var participantSmallScreen = null;
    var dotText = null;
    if(storeState.windowSize.height > 500){
      participantBigScreen =
      <div style={{display:'flex', flexDirection:'row', flexGrow:1, position:'relative', paddingBottom:5, marginRight:5}}>
        <Button style={{display:'flex', position: 'relative', flexGrow: 1, flexShrink:1, minWidth:20, maxWidth:40, minHeight:20, maxHeight:60}}
         onClick={this.onButtonPress}>
          {buttonIcon}
        </Button>
        <div style={{display:'flex', position: 'relative', flexDirection:'column', flexGrow: 1, flexShrink:1}}>
          <div style={{display:'flex', flexGrow:1, flexShrink:1,  width:'100%', justifyContent:'center', alignItems:'center'}}>
            <Typography color="textPrimary"> {this.props.completedTasks} / {this.props.totalTasks} </Typography>
          </div>
          <LinearProgress color="secondary" style={{display:'flex', flexGrow:1, flexShrink:1}} variant="determinate" value={(this.props.completedTasks/this.props.totalTasks)*100}/>
        </div>
      </div>;
    }
    else{
      participantSmallScreen =
        <Button style={{zIndex:10,display:'flex', position: 'relative', flexShrink:1, minWidth:20, maxWidth:60, minHeight:20, maxHeight:60}}
           onClick={this.onButtonPress}>
            {buttonIcon}
        </Button>;
      dotText = {overflow:'hidden', textOverflow:'ellipsis',whiteSpace:'nowrap'};
    }

    return(
          <div style={{...shouldHighlight,...{ zIndex:1, margin:'0 0 0 10px', display:'flex', flexDirection:'column', cursor:'pointer', position:'relative', flexShrink:1, minHeight:20, maxHeight:150, minWidth:150, maxWidth:250}}}>
            <div onClick={this.onTabPress} style={{display:'flex', flexDirection:'column', position:'relative', width:"100%", height:"100%"}}>
              <div style={{...activeTextStyle, ...{display:'flex', flexDirection:'row', position: 'relative'}, ...dotText}}>
                {participantSmallScreen}<p style={{ textAlign:'center'}}>{this.props.label}</p>
              </div>
              {participantBigScreen}
            </div>
          </div>
    );
  }
}
export default withTheme(ObserverTab);
