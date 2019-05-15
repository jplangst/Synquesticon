import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import './IntroductionScreen.css';

class IntroductionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }

    this.gotoPage = this.gotoPageHandler.bind(this);
  }

  //---------------------------component functions------------------------------
  componentWillMount() {

  }

  componentWillUnmount() {

  }

  gotoPageHandler(e, route){
    this.props.history.push(route);
  }

  render() {
    return(
      <div >
        <Button className="createTaskSetsBtn" onClick={(e) => this.gotoPage(e,"CreatorMode")} >
          <p>Creator Mode</p>
        </Button>
        <Button className="createTaskButton" onClick={(e) => this.gotoPage(e,"PlayerMode")} >
          <p>Player Mode</p>
        </Button>
        <Button className="createTaskButton" onClick={(e) => this.gotoPage(e,"ViewerMode")} >
          <p>Viewer Mode</p>
        </Button>
      </div>
    );
  }
}
export default IntroductionScreen;
