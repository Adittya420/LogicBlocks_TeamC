import React, { useEffect, useState, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { Button, ListItemIcon, ListItemText, Switch } from "@mui/material";
import { Card } from "@mui/material";
import Draggable from "react-draggable";
import { Resizable } from "re-resizable";
import { useSelector } from "react-redux";
import { drawRect } from "../features/utlities.js";
import Webcam from "react-webcam";

// Import the button components
import FlagButton from "./Canvas/FlagButton";
import StopButton from "./Canvas/StopButton";
import UndoButton from "./Canvas/UndoButton";
import RedoButton from "./Canvas/RedoButton";
import ZoomIn from "./Canvas/ZoomIn";
import ZoomOut from "./Canvas/ZoomOut";
import FullScreen from "./Canvas/FullScreen";

import {
  setDetectedObjs,
  setLabel,
  setDetectRec,
} from "../features/detection.js";
import { useDispatch } from "react-redux";

const Canvas = () => {
  const isCameraOn = useSelector((state) => state.camera.isCameraOn);
  // const [net, setNet] = useState(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null); 

  const detectedObj = useSelector((state) => state.detect.objectArr);
  const label = useSelector((state) => state.detect.label);
  const detectRec = useSelector((state) => state.detect.detectRec);

  const dispatch = useDispatch();

  const runCoco = async () => {
    // 3. TODO - Load network
    const net = await cocossd.load();

    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    });
  };

  const handleToggleCamera = () => {
    console.log("Dosnt Work");
  };

  const handleDetect = () => {
    // setDetect((prev) => !prev);
    dispatch(setDetectRec(!detectRec));
  };

  const handleLabel = () => {
    // setLabel((prev) => !prev);
    dispatch(setLabel(!label));
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4 &&
      canvasRef.current !== null
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections

      const obj = await net.detect(video);
      dispatch(setDetectedObjs(obj));

      // if ((obj.find(el => el.class == 'cell phone'))) {
      //   setFlag(1)
      //   count++;
      // }
      // if (obj.length > 1 || obj.length == 0) {
      //   setFlag(1);
      //   count++;
      // } else {
      //   setFlag(0);
      // }

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx);
    }
  };

  // utilities.js

  // const[person,setperson] = useState("")
  useEffect(() => {
    // Speech()
    runCoco();
    // setperson(name)
  }, []);

  const { position, angle } = useSelector((state) => ({
    position: state.motion.position,
    angle: state.motion.angle,
  }));

  // useEffect(() => {
  //   const spriteElement = document.getElementById("sprite");
  //   if (spriteElement) {
  //     spriteElement.style.transform = `translate(${position.x}px, ${position.y}px) rotate(${angle}deg)`;
  //   }
  //   if (isCameraOn) {
  //     detect();
  //   }
  // }, [position, angle, isCameraOn]);

  return (
    <div>
      <Card
        class="highlighted"
        style={{
          position: "relative",
          width: "700px",
          margin: "28px auto",
          height: "600px",
          overflow: "hidden",
          background: `url(localVideo)`,
        }}
      >
        {label && (
          <div>{detectedObj.map((obj) => `${obj.class}, `).join("\n")}</div>
        )}
        <h1 style={{ textAlign: "center", fontSize: "14px" }}>Canvas</h1>
        {isCameraOn && (
          <header className="App-header">
            <Webcam
              ref={webcamRef}
              muted={true}
              style={{
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                textAlign: "center",
                zindex: 9,
                width: 640,
                height: 480,
              }}
            />

            {detectRec && (
              <canvas
                ref={canvasRef}
                style={{
                  position: "absolute",
                  marginLeft: "auto",
                  marginRight: "auto",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  zindex: 8,
                  width: 640,
                  height: 480,
                }}
              />
            )}
          </header>
        )}
        <Draggable
          bounds="parent"
          position={position}
          defaultPosition={position}
          style={{ transform: `rotate(100deg)` }}
        >
          <Resizable
            id="sprite"
            defaultSize={{
              width: "50%",
              height: "50%",
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `url(trial_sprite_nobkg.png) center / contain no-repeat`,
              cursor: "move",
            }}
            lockAspectRatio={true}
          >
            <div style={{ width: "100%", height: "100%" }} />
          </Resizable>
        </Draggable>

        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div>
            <FlagButton onClick={() => {}} />
            <FlagButton onClick={() => {}} />
            <StopButton onClick={() => {}} />
            <UndoButton onClick={() => {}} />
            <RedoButton onClick={() => {}} />
          </div>
          <div>
            <ZoomIn onClick={() => {}} />
            <ZoomOut onClick={() => {}} />
            <FullScreen onClick={() => {}} />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 30,
            right: 10,
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {isCameraOn && (
            <div style={{ paddingLeft: "10px" }}>
              <Button onClick={handleDetect}>
                Detect
                <Switch
                  checked={detectRec}
                  // onChange={handleToggleCamera}
                />
              </Button>
              <Button onClick={handleLabel}>
                Label
                <Switch
                  checked={label && detectRec}
                  onChange={handleToggleCamera}
                />
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Canvas;
