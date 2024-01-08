export const initialState = {
    activeTab: "Home",
    audioState: {
        showAudioWaveform: false,
        showDefaultAudioWaveform: true,
        fileName: '',
    }
}

import { createSlice } from "@reduxjs/toolkit";

const soundTabSlice = createSlice({
  name: "soundTab",
  initialState: initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setAudioState: (state, action) => {
      state.audioState = action.payload;
    },
  },
});

export const { setActiveTab, setAudioState } = soundTabSlice.actions;
export default soundTabSlice.reducer;