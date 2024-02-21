const initialState = {
  objectArr: [],
};

import { createSlice } from "@reduxjs/toolkit";

const detectSlice = createSlice({
  name: "detect",
  initialState: initialState,
  reducers: {
    setDetectedObjs: (state, action) => {
      state.objectArr = action.payload;
    },
  },
});

export const { setDetectedObjs } = detectSlice.actions;
export default detectSlice.reducer;
