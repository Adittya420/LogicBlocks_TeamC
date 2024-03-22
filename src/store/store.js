import { configureStore } from "@reduxjs/toolkit";
import soundTabReducer, { initialState } from "../features/soundTabReducers";
import audioReducer from "../features/audioSlice";

import motionReducer from "../features/motionSlice";
import controlReducer from "../features/controlSlice";
import codeReducer from "../features/codeSlice";
import cameraReducer from "../features/cameraSlice";

import detectReducer from "../features/detection";
import TechableReducer from "../features/Techable";

export const store = configureStore({
  reducer: {
    soundTab: soundTabReducer,
    audio: audioReducer,
    motion: motionReducer, // Add the sprite reducer to the store
    control: controlReducer, // Add the control reducer to the store
    code: codeReducer, // Add the code reducer to the store
    camera: cameraReducer,
    detect: detectReducer,
    techable: TechableReducer,
  },
  initialState,
});
