import React, { Component } from 'react';

import PlayableSetComponent from './PlayableSetComponent';

import * as listUtils from '../../core/db_objects_utility_functions';

import './TaskListComponent.css';

//================ React component ================
class PlayableSetListComponent extends Component {
  constructor(props) {
    super(props);
    this.taskList = props.taskList;
  }

  //-----------Tasks------------

  render() {
    this.taskList = this.props.taskList;
    return (<div className="taskListComponentContainer">
        {
          this.taskList.map((item, index) => {
            var content = listUtils.getTaskContent(item);

            return <div key={index}><PlayableSetComponent task={item}
                        runSetCallback={ this.props.runSetCallback } content={content} /></div>
          })
        }

      </div>);
  }
}

export default PlayableSetListComponent;
