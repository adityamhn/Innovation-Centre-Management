import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isLoggedIn: false,
  },

  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    updateUser: (state, action) => {
      const prevUser = state.user;
      state.user = { ...prevUser, ...action.payload };
      state.isLoggedIn = true;
    },
    logoutAccount: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { loginUser, updateUser, logoutAccount } =
  userSlice.actions;
export default userSlice.reducer;
