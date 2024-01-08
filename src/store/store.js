import { configureStore } from "@reduxjs/toolkit";
import soundTabReducer, { initialState } from "../state/reducers/soundTabReducers";


export const store = configureStore({
  reducer: {soundTab: soundTabReducer},
  initialState,
});
