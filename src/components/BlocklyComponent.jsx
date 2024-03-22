// Updated BlocklyComponent.jsx
import React, { useEffect, useRef, useState } from "react";
import Blockly from "blockly";
import { Logic } from "./BlockCategories/Logic";
import { Loops } from "./BlockCategories/Loops";
import { Math } from "./BlockCategories/Math";
import { TechableMachine } from "./BlockCategories/TeachableMachine";
import { Text } from "./BlockCategories/Text";
import initializeBlockly from "./InitializeBlockly"; // import the function
import { Sounds } from "./BlockCategories/Sounds";
import { javascriptGenerator } from "blockly/javascript";
import { WaveSurferContext } from "../contexts/waveSurferContext";
import { useContext } from "react";
import { FileContext } from "../contexts/fileContext.jsx";
import { bufferToWave } from "./bufferToWave.jsx";
import { useDispatch, useSelector } from "react-redux";
import { Motion } from "./BlockCategories/Motion";
import { Control } from "./BlockCategories/Control";
import { store } from "../store/store";
import {
  moveSteps,
  setX,
  setY,
  goTo,
  goToXY,
  moveSpriteToMousePointer,
  turnRight,
  turnLeft,
  pointInDirection,
  rotateSprite,
  glideSecsXY,
} from "../features/motionSlice";

import { waitSeconds, repeatTimes } from "../features/controlSlice";
import { setCodeString } from "../features/codeSlice";
import { setAudioObj } from "../features/audioSlice.js";
import { Object } from "./BlockCategories/Object.jsx";
import { setLabel, setDetectRec } from "../features/detection.js";

function getFileName() {
  const activeWaveform = useSelector((state) => state.soundTab.activeWaveform);
  const { id, fileName, audioUrl } = activeWaveform;

  return fileName;
}
const BlocklyComponent = () => {
  const dispatch = useDispatch();
  const { wavesurferObj, setWavesurferObj } = useContext(WaveSurferContext);
  const [isWavesurferReady, setIsWavesurferReady] = useState(false);

  const { fileURL, setFileURL } = useContext(FileContext);

  const blocklyRef = useRef(null);
  const workspace = Blockly.getMainWorkspace();
  const { codeString } = useSelector((state) => ({
    codeString: state.code.codeString,
  }));
  const detectedObj = useSelector((state) => state.detect.objectArr);
  const [detectedObjectsCode, setdetectedObjectsCode] = useState(false);

  const audioArray = useSelector((state) => state.soundTab.audioArray);
  const audioObj = useSelector((state) => state.audio.audioObj);
  const label = useSelector((state) => state.detect.label);
  const detectRec = useSelector((state) => state.detect.detectRec);

  const generateCode = async () => {
    javascriptGenerator.addReservedWords("code");
    const code = javascriptGenerator.workspaceToCode(workspace);

    const lines = code.split("\n");    

    // Filter out lines containing "detect_object"
    const filteredLines = lines.filter(line => !line.includes("detect_object"));    

    if(filteredLines.length < lines.length)
      setdetectedObjectsCode(true);
    // Join the filtered lines back into a single string
    const filteredCode = filteredLines.join("\n");
   
    dispatch(setCodeString(filteredCode));
    await eval(`(async () => { ${filteredCode} })();`);
    
  };

  const displayCodeString = () => {
    const copyString = codeString;
    var detectedObjString = "";
    if (detectedObjectsCode)
      detectedObjString = detectedObj
        .map((obj) => `Detected object: ${obj.class}`)
        .join("\n");

    // Use a regular expression to remove store.dispatch() calls for display and display inner contents
    return (
      detectedObjString +
      "\n" +
      copyString.replace(/store\.dispatch\((.*?)\);/g, "sprite.$1")
    );
    // Use the below rather than the above to debug the code if required as it displays perfect code
    // return copyString;
  };  

  // To handle Wavesurfer object
  useEffect(() => {
    if (wavesurferObj) {
      setIsWavesurferReady(true);
    }
  }, [wavesurferObj]);

  function playSound(soundname) {
    const foundSound = audioArray.find((sound) => sound.fileName === soundname);
    if (foundSound) {
      return foundSound.audioUrl;
    } else {
      console.log("Sound not found in audioArray");
      return "defaultsound.wav"; // Or return a default sound URL, or handle the case accordingly
    }
  }
  function getSound() {
    return audioObj;
  }

  const name = getFileName();
  useEffect(() => {
    // Wait for the Blockly workspace to be ready
    const intervalId = setInterval(() => {
      const workspace = Blockly.getMainWorkspace();
      if (workspace) {
        // Blockly workspace is ready
        clearInterval(intervalId);

        // Get the current block definition
        const oldDefinition_play = Blockly.Blocks["play_sound"];
        const oldDefLabel = Blockly.Blocks["label"];
        const oldDefDetect = Blockly.Blocks["detection"];

        // Create a new block definition with the updated field value
        const newDefinition_play = {
          ...oldDefinition_play,
          init: function () {
            this.appendDummyInput().appendField("Set Sound");
            this.appendDummyInput()
              .appendField("Sound Name:")
              .appendField(
                new Blockly.FieldDropdown(
                  audioArray.map((sound) => [sound.fileName, sound.fileName])
                ),
                "SOUND_NAME"
              );
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Play a sound");
          },
        };

        const newDefLabel = {
          ...oldDefLabel,
          init: function () {
            this.appendDummyInput()
              .appendField("label:")
              .appendField(new Blockly.FieldCheckbox(label), "LABEL");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Name the Objects in the video stream");

          },
        };
        const newDefDetect = {
          ...oldDefDetect,
          init: function () {
            this.appendDummyInput()
              .appendField("Detect:")
              .appendField(new Blockly.FieldCheckbox(detectRec), "DETECT");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Detect the Objects in the video stream");

          },
        };

        // Unregister the old block        
        delete Blockly.Blocks["play_sound"];
        Blockly.Blocks["play_sound"] = newDefinition_play;
        delete Blockly.Blocks["label"];
        Blockly.Blocks["label"] = newDefLabel;
        delete Blockly.Blocks["detection"];
        Blockly.Blocks["detection"] = newDefDetect;

        // Clear the workspace and add the new block
        workspace.clear();
      }
    }, 100); // Check every 100 milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this runs only once on mount
  useEffect(() => {
  // Wait for the Blockly workspace to be ready
  const intervalId = setInterval(() => {
    const workspace = Blockly.getMainWorkspace();
    if (workspace) {
      // Blockly workspace is ready
      clearInterval(intervalId);

      // Get the current block definitions
      const oldDefs = {
        use_model: Blockly.Blocks["use_model"],
        when_model_detects: Blockly.Blocks["when_model_detects"],
        model_prediction: Blockly.Blocks["model_prediction"],
        prediction_is: Blockly.Blocks["prediction_is"],
        turn_video: Blockly.Blocks["turn_video"],
        set_video_transparency: Blockly.Blocks["set_video_transparency"],
      };

      // Create new block definitions with updated field values if needed
      const newDefs = {
        use_model: {
          ...oldDefs.use_model,
          init: function () {
            this.appendDummyInput()
              .appendField("use model")
              .appendField(new Blockly.FieldTextInput("Paste URL Here"), "MODEL_URL");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Load the Teachable Machine model from the provided URL");
          },
        },
        when_model_detects: {
          ...oldDefs.when_model_detects,
          init: function () {
            this.appendDummyInput()
              .appendField("when model detects")
              .appendField(new Blockly.FieldDropdown([["Class 1", "CLASS_1"], ["Class 2", "CLASS_2"]]), "DETECTED_CLASS");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Set the class that the model detects");
          },
        },
        // Add other blocks as needed with similar structure
      };

      // Unregister old block definitions
      Object.keys(oldDefs).forEach((blockType) => {
        delete Blockly.Blocks[blockType];
      });

      // Register new block definitions
      Object.keys(newDefs).forEach((blockType) => {
        Blockly.Blocks[blockType] = newDefs[blockType];
      });

      // Clear the workspace and add the new blocks
      workspace.clear();
    }
  }, 100); // Check every 100 milliseconds
}, []); // Empty dependency array ensures this runs only once on moun
  useEffect(() => {
    if (blocklyRef.current === null) {
      Blockly.setLocale("en");
      const toolboxXml = `
        <xml id="toolbox" style="display: none">
          ${Logic}
          ${Loops}
          ${Math}
          ${Text}
          ${Sounds}
          ${Motion}
          ${Control}
          ${Object}
          ${TechableMachine}
        </xml>
      `;
      initializeBlockly(toolboxXml);
      blocklyRef.current = true;
    }

    // Ensure that the workspace is ready before adding the change listener
    const workspaceReadyInterval = setInterval(() => {
      const currentWorkspace = Blockly.getMainWorkspace();
      if (currentWorkspace) {
        clearInterval(workspaceReadyInterval);

        // Set up event listener for block click events
        currentWorkspace.addChangeListener(function (event) {
          if (event.type === Blockly.Events.BLOCK_CLICK) {
            // Handle block click event
            const block = currentWorkspace.getBlockById(event.blockId);
            if (block) {
              block.handleClick_();
            }
          }
        });
      }
    }, 100);
  }, [blocklyRef]);

  return (
    <div style={{ width: "100%", height: "480px" }}>
      <h1
        style={{
          display: "inline-block",
          fontSize: "14px",
          marginRight: "500px",
        }}
      >
        Blockly Toolbox
      </h1>
      <h1 style={{ display: "inline-block", fontSize: "14px" }}>
        Blockly Workspace
      </h1>
      <div
        className="highlighted"
        id="blocklyDiv"
        style={{ height: "100%", width: "100%", position: "relative" }}
      ></div>
      <button onClick={generateCode}>Generate Code</button>
      <pre style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}>
        {displayCodeString()}
      </pre>
    </div>
  );
};

export default BlocklyComponent;
