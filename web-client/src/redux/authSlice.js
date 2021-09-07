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
  },
});
export const { authStart, authEnd, updateUser } = authSlice.actions;
export default authSlice.reducer;
