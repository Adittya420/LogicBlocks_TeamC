// actions.js
export const SET_MODEL_URL = 'SET_MODEL_URL';
export const SET_DETECTED_CLASS = 'SET_DETECTED_CLASS';
export const SET_PREDICTION_RESULT = 'SET_PREDICTION_RESULT';
export const SET_VIDEO_STATE = 'SET_VIDEO_STATE';
export const SET_VIDEO_TRANSPARENCY = 'SET_VIDEO_TRANSPARENCY';

// actions.js
export const setModelUrl = (modelUrl) => ({
    type: SET_MODEL_URL,
    payload: modelUrl,
  });
  
  export const setDetectedClass = (detectedClass) => ({
    type: SET_DETECTED_CLASS,
    payload: detectedClass,
  });
  
  export const setPredictionResult = (predictionEnabled) => ({
    type: SET_PREDICTION_RESULT,
    payload: predictionEnabled,
  });
  
  export const setVideoState = (videoState) => ({
    type: SET_VIDEO_STATE,
    payload: videoState,
  });
  
  export const setVideoTransparency = (transparencyValue) => ({
    type: SET_VIDEO_TRANSPARENCY,
    payload: transparencyValue,
  });



