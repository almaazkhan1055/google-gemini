import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    loadUserFromLocalStorage: (state) => {
      const user = localStorage.getItem("user");
      state.user = user ? JSON.parse(user) : null;
    },
  },
});

export const { setUser, logoutUser, loadUserFromLocalStorage } =
  authSlice.actions;
export default authSlice.reducer;
