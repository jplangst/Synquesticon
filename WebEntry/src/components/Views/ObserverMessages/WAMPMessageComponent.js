import React from 'react';

import CommentDialog from '../../dialogs/CommentDialog';

import ObserverMessage from './ObserverMessage';
import './WAMPMessageComponent.css';

class WAMPMessageComponent extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      openCommentDialog: false
    }

    this.onCommentPressedCallback = this.onCommentPressed.bind(this);
    this.onCommentRecievedCallback = this.onCommentRecieved.bind(this);
  }

  onCommentPressed(){
    this.setState({
      openCommentDialog: true
    });
  }

  onCommentRecieved(comment){
    //TODO process comment here, might need to pass task id etc to the observermessage as needed
    console.log(comment);

    this.setState({
      openCommentDialog: false
    });
  }

  render() {
    return (
      <div className="wampMessageBoard">
        <div className="messageBoardtitle">
         Messaging Log
        </div>
        <div className="messages">
          {this.props.messages.map((item, index) => {
            return <ObserverMessage message={item} commentCallback={this.onCommentPressedCallback} />
            //return (<div>{item}<br /></div>);
          })}
        </div>

        <CommentDialog openDialog={this.state.openCommentDialog} closeDialog={this.onCommentRecievedCallback} />
      </div>);
  }
}

export default WAMPMessageComponent;
