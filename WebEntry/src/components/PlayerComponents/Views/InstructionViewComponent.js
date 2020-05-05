import React, { useEffect } from 'react';
import { Typography } from '@material-ui/core';
import store from '../../../core/store';

const InstructionViewComponent = props => {
  const textRef = React.createRef();

  if (props.newTask) {
    const answerObj = {
      responses: [],
      correctlyAnswered: "notApplicable",
      taskID: props.task._id,
      mapID: props.mapID,
    }
    props.answerCallback(answerObj);
  }

  useEffect ( () => {
    const textAOIAction = {
      type: 'ADD_AOIS',
      aois: {
        name: props.parentSet + '_' + props.task.displayText,
        boundingbox: [],
        imageRef: textRef
      }
    }
    store.dispatch(textAOIAction);
  }, []);

  return (
    <div className={props.className}>
      <Typography ref={textRef} variant="h3" color="textPrimary" align="center" style={{whiteSpace:"pre-line"}}>{props.task.displayText}</Typography>
    </div>
  );
}

export default InstructionViewComponent;
