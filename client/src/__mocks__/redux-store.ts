import { configureStore } from "@reduxjs/toolkit";

export const createMockStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      user: () => ({ userDetails: null }),
    },
    preloadedState,
  });
};
