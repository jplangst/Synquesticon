import React, { Component } from 'react';

//Components
import Button from '@material-ui/core/Button';
import PauseIcon from '@material-ui/icons/PauseCircleOutline';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import LinearProgress from '@material-ui/core/LinearProgress';

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

    if(!this.state.forcedPause){
      this.setState({
        isPaused: !this.state.isPaused
      });
    }
    //TODO either send WAMP message here or use a callback to do it in the parent component
  }

  render() {
    var activeTextStyle = this.props.isActive ? {color:'#0033BB'} : {color:'grey'}
    var activeUnderlineStyle = this.props.isActive ? { borderBottom:'2px solid #0033BB'} : {color:'grey'}

    var buttonIcon = null;
    if(this.state.isPaused || this.state.forcedPause){
      buttonIcon = <PauseIcon style={{display:'flex', position: 'absolute', height: '100%', width: 'auto', maxWidth: '100%', flexGrow: 1}} />;
    }
    else{
      buttonIcon = <PlayIcon style={{display:'flex', position: 'absolute', height: '100%', width: 'auto', maxWidth: '100%', flexGrow: 1}} />;
    }

    return(
          <div onClick={this.onTabPress} style={{ margin:'0 0 0 2px', display:'flex', flexDirection:'column', position:'relative', flexGrow:1, flexShrink:1, minWidth:150, maxWidth:250}}>
            <div style={{...activeTextStyle, ...{display:'flex', flexGrow:1, position: 'relative', justifyContent:'center', alignItems:'center', paddingTop:5}}}>
              <p style={{flex:1, textAlign:'center'}}>{this.props.label}</p>
            </div>
            <div style={{...activeUnderlineStyle,...{display:'flex', flexDirection:'row', flexGrow:1, position:'relative', paddingBottom:5}}}>
              <Button style={{display:'flex', position: 'relative', flexGrow: 1, flexShrink:1, minWidth:20, maxWidth:60, minHeight:20, maxHeight:60}}
               onClick={this.onButtonPress}>
                {buttonIcon}
              </Button>
              <div style={{display:'flex', position: 'relative', flexDirection:'column', flexGrow: 1, flexShrink:1}}>
                <div style={{display:'flex', flexGrow:1, flexShrink:1,  width:'100%', justifyContent:'center', alignItems:'center'}}>
                  {this.props.completedTasks} / {this.props.totalTasks}
                </div>
                <LinearProgress style={{display:'flex', flexGrow:1, flexShrink:1,  width:'100%'}} variant="determinate" value={(this.props.completedTasks/this.props.totalTasks)*100}/>
              </div>
            </div>
          </div>
    );
  }
}
export default ObserverTab;
