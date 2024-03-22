import { createSlice } from "@reduxjs/toolkit";

// Create slice for model settings
const modelSlice = createSlice({
    name: 'model',
    initialState: {
        modelUrl: '',
        detectedClass: '',
        predictionResult: false,
        videoState: false,
        videoTransparency: 0,
    },
    reducers: {
        setModelUrl: (state, action) => {
            state.modelUrl = action.payload;
        },
        setDetectedClass: (state, action) => {
            state.detectedClass = action.payload;
        },
        setPredictionResult: (state, action) => {
            state.predictionResult = action.payload;
        },
        setVideoState: (state, action) => {
            state.videoState = action.payload;
        },
        setVideoTransparency: (state, action) => {
            state.videoTransparency = action.payload;
        },
    },
});

export const { setModelUrl, setDetectedClass, setPredictionResult, setVideoState, setVideoTransparency } = modelSlice.actions;
export default modelSlice.reducer;
