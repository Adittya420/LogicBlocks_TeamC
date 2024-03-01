const initialState = {
  objectArr: [],
  label: false,
  detectRec: false,
};

import { createSlice } from "@reduxjs/toolkit";

const detectSlice = createSlice({
  name: "detect",
  initialState: initialState,
  reducers: {
    setDetectedObjs: (state, action) => {
      state.objectArr = action.payload;
    },
    setLabel: (state, action) => {
      state.label = action.payload;
    },
    setDetectRec: (state, action) => {
      state.detectRec = action.payload;
    },
  },
});

export const { setDetectedObjs, setDetectRec, setLabel } = detectSlice.actions;
export default detectSlice.reducer;
