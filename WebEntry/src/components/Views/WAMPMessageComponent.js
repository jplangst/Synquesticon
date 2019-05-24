import React, { PropTypes } from 'react';

import wampEventsStore from '../../core/wamp';

import './WAMPMessageComponent.css';

class WAMPMessageComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: {}
    }
  }

  componentWillMount() {

  }

  render() {
    return (
      <div>
      </div>);
  }
}

export default WAMPMessageComponent;
