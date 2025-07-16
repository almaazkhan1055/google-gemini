import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", state.mode);
      }
    },
    loadThemeFromStorage: (state) => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("theme");
        if (saved) {
          state.mode = saved;
        }
      }
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", state.mode);
      }
    },
  },
});

export const { toggleTheme, loadThemeFromStorage, setTheme } =
  themeSlice.actions;
export default themeSlice.reducer;
