import React, { Component } from 'react';

import PlayableSet from './PlayableSet';

import * as listUtils from '../../core/db_objects_utility_functions';

class PlayableSetList extends Component {
  constructor(props) {
    super(props);
    this.taskList = props.taskList;
  }

  render() {
    this.taskList = this.props.taskList;
    return (<div style={{position:'relative', height:'100%', width:'100%', display:'flex', flexDirection:'column'}}>
        {
          this.taskList.map((item, index) => {
            var content = listUtils.getTaskContent(item);

            return <div key={index}>
                    <PlayableSet task={item}
                        runSetCallback={ this.props.runSetCallback }
                        getLinkCallback={ this.props.getLinkCallback }
                        editSetCallback={this.props.editSetCallback}
                        content={content}
                        showEditButton={this.props.showEditButton}/>
                   </div>})
        }
      </div>);
  }
}

export default PlayableSetList;
