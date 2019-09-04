import React, { Component } from 'react';

import store from '../../../core/store';

//Components
import Button from '@material-ui/core/Button';
import PauseIcon from '@material-ui/icons/PauseCircleOutline';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import LinearProgress from '@material-ui/core/LinearProgress';

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
    this.props.tabPressedCallback(this.props.index);
  }

  onButtonPressed(evt){
    evt.stopPropagation();
    wamp.broadcastCommands(JSON.stringify({
                            commandType: !this.state.isPaused ? "PAUSE" : "RESUME",
                            participantId: this.props.participantId
                           }));
    if(!this.state.forcedPause){
      this.setState({
        isPaused: !this.state.isPaused
      });
    }
    //TODO either send WAMP message here or use a callback to do it in the parent component
  }

  render() {
    var activeTextStyle = this.props.isActive ? {color:'#0033BB'} : {color:'grey'}


    var activeUnderlineStyle = this.props.isActive ? {boxShadow:'inset 0px -3px 0px #0033BB'} : {color:'grey'}
    var showScroll = window.matchMedia("(any-pointer: coarse)").matches ? activeUnderlineStyle : {};


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
      <div style={{...showScroll,...{display:'flex', flexDirection:'row', flexGrow:1, position:'relative', paddingBottom:5, marginRight:5}}}>
        <Button style={{display:'flex', position: 'relative', flexGrow: 1, flexShrink:1, minWidth:20, maxWidth:40, minHeight:20, maxHeight:60}}
         onClick={this.onButtonPress}>
          {buttonIcon}
        </Button>
        <div style={{display:'flex', position: 'relative', flexDirection:'column', flexGrow: 1, flexShrink:1}}>
          <div style={{display:'flex', flexGrow:1, flexShrink:1,  width:'100%', justifyContent:'center', alignItems:'center'}}>
            {this.props.completedTasks} / {this.props.totalTasks}
          </div>
          <LinearProgress style={{display:'flex', flexGrow:1, flexShrink:1,  width:'calc(100% - 10%)'}} variant="determinate" value={(this.props.completedTasks/this.props.totalTasks)*100}/>
        </div>
      </div>;
    }
    else{
      participantSmallScreen =
        <Button style={{display:'flex', position: 'relative', flexShrink:1, minWidth:20, maxWidth:60, minHeight:20, maxHeight:60}}
           onClick={this.onButtonPress}>
            {buttonIcon}
        </Button>;
      dotText = {overflow:'hidden', textOverflow:'ellipsis',whiteSpace:'nowrap'};
    }

    return(
          <div onClick={this.onTabPress} style={{ margin:'0 0 0 2px', display:'flex', flexDirection:'column', cursor:'pointer', position:'relative', flexShrink:1, minHeight:20, maxHeight:150, minWidth:150, maxWidth:250}}>
            <div style={{...activeTextStyle, ...{display:'flex', flexDirection:'row', position: 'relative'}, ...dotText}}>
              {participantSmallScreen}<p style={{ textAlign:'center'}}>{this.props.label}</p>
            </div>
            {participantBigScreen}
          </div>
    );
  }
}
export default ObserverTab;
