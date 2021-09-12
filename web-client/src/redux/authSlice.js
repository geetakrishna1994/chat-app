import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart: (state) => {
      state.isLoading = true;
    },
    authEnd: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    reset: (state, action) => {
      return initialState;
    },
  },
});
export const { authStart, authEnd, updateUser, reset } = authSlice.actions;
export default authSlice.reducer;
