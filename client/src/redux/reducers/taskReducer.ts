import { FETCH_TASKS } from "../actions/taskAction";
import { LOGOUT_SUCCESS } from "../actions/userAction";
import { TaskState } from "../types";

const initialState: TaskState = {
  tasks: [],
  totalTasks: 0,
  finishedTasks: 0,
};

const taskReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_TASKS:
      return {
        ...state,
        tasks: action.payload,
      };
    case LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};

export default taskReducer;
