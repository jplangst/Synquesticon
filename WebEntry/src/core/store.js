import { createStore } from 'redux';

const initialState = {
  taskList: [] //List of all question javascript objects
};

const store = createStore ((state = initialState, action) => {
  switch(action.type) {
    case 'SET_TASK_LIST':
      return { ...state, taskList: action.taskList}; //Modify state with the new taskList
    default:
      return state;
  }
});

export default store;
