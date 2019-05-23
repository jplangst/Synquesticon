import { createStore } from 'redux';

const initialState = {
  gazeCursorRadius: 0,
  gazeData: {
    locX: 0,
    locY: 0
  },
  taskList: [] //List of all question javascript objects
};

const store = createStore ((state = initialState, action) => {
  switch(action.type) {
    case 'SET_TASK_LIST': {
      return { ...state, taskList: action.taskList}; //Modify state with the new taskList
    }
    case 'SET_GAZE_DATA':{
      return { ...state, gazeData: action.gazeData};
    }
    case 'SET_GAZE_RADIUS': {
      return { ...state, gazeCursorRadius: action.gazeRadius};
    }
    default:
      return state;
  }
});

export default store;
