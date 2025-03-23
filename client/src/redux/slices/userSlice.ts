import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import { UserState } from '../types';

const initialState: UserState = {
  userDetails: null,
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<User>) => {
      state.userDetails = action.payload;
      state.isLoggedIn = true;
    },
    logoutUser: (state) => {
      state.userDetails = null;
      state.isLoggedIn = false;
    },
    setLoginState: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { setUserDetails, logoutUser, setLoginState } = userSlice.actions;

export const selectUserDetails = (state: { user: UserState }) => state.user.userDetails;
export const selectIsLoggedIn = (state: { user: UserState }) => state.user.isLoggedIn;

export default userSlice.reducer;
