import React from 'react';

import Button from '@material-ui/core/Button';

import './ObserverMessage.css';
import CommentIcon from '@material-ui/icons/ModeCommentOutlined';

class ObserverMessage extends React.Component {
  render() {

    //TODO make the comment button size and the text size responsive

    return (
      <div classname="observerMessageWrapper" style={{display:'flex', position: 'relative', flexDirection:'row', flexGrow: 1, flexShrink:1, minWidth:10, minHeight:50, marginBottom:10}}>
        <div className="observerMessageText" style={{display:'flex', position: 'relative', flexGrow: 1, flexShrink:1, minWidth:10, height:'100%'}}>
          {this.props.message}
        </div>
        <Button style={{display:'flex', position: 'relative', flexGrow: 0, flexShrink:0, height:25, width:25, maxWidth:25}}
         onClick={this.props.commentCallback} >
          <CommentIcon className="flippedCommentIcon" style={{display:'flex', position: 'absolute', height: '100%', width: '100%'}} />
        </Button>
      </div>
      );
  }
}

export default ObserverMessage;
