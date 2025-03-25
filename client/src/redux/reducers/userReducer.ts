import { FETCH_USER_SUCCESS, LOGOUT_SUCCESS } from "../actions/userAction";
import { UserState } from "../types";

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
