import { LOGOUT_SUCCESS } from "../actions/userAction";
import { UserState } from "../types";

export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";

const initialState: UserState = {
  userDetails: null,
  isLoggedIn: false,
};

const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        userDetails: action.payload,
        isLoggedIn: true,
      };
    case LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
