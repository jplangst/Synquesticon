import React from 'react';
import PlayableSet from './PlayableSet';
import * as listUtils from '../../core/db_objects_utility_functions';

const PlayableSetList = (props) => {
  return (
    <div style={{position:'relative', height:'100%', width:'100%', display:'flex', flexDirection:'column'}}>
      {
        props.taskList.map((item, index) => {
          const content = listUtils.getTaskContent(item);
          return <div key={index}>
                  <PlayableSet 
                    task=           { item }
                    runSetCallback= { props.runSetCallback }
                    getLinkCallback={ props.getLinkCallback }
                    editSetCallback={ props.editSetCallback }
                    content=        { content }
                    showEditButton= { props.showEditButton }
                  />
                  </div>
        })
      }
    </div>
  );
}

export default PlayableSetList;
