import React from 'react';

import './WAMPMessageComponent.css';

class WAMPMessageComponent extends React.Component {
  render() {
    return (
      <div className="wampMessageBoard">
        <div className="title">
         Messaging Log
        </div>
        <div className="messages">
          {this.props.messages.map((item, index) => {
            return (<div>{item}<br /></div>);
          })}
        </div>
      </div>);
  }
}

export default WAMPMessageComponent;
