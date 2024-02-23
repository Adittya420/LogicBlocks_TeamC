// Updated BlocklyComponent.jsx
import React, { useEffect, useRef, useState } from "react";
import Blockly from "blockly";
import { Logic } from "./BlockCategories/Logic";
import { Loops } from "./BlockCategories/Loops";
import { Math } from "./BlockCategories/Math";
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
  const detectedObj = useSelector(state => state.detect.objectArr);
  const [detectedObjectsCode, setdetectedObjectsCode] = useState(false);  
  
  const audioArray = useSelector(state => state.soundTab.audioArray);
  const audioObj = useSelector(state => state.audio.audioObj);
  
  const generateCode = async () => {
    javascriptGenerator.addReservedWords("code");
    const code = javascriptGenerator.workspaceToCode(workspace);
    if(code === "detect_object"){
      setdetectedObjectsCode(true);
    }
    else{
      dispatch(setCodeString(code));
      await eval(`(async () => { ${code} })();`);
    }

  };

  const displayCodeString = () => {
    const copyString = codeString;
    var detectedObjString = "";
    if(detectedObjectsCode)
      detectedObjString = detectedObj.map(obj => `Detected object: ${obj.class}`).join('\n')

    // Use a regular expression to remove store.dispatch() calls for display and display inner contents
    return detectedObjString + "\n" +copyString.replace(/store\.dispatch\((.*?)\);/g, "sprite.$1");
    // Use the below rather than the above to debug the code if required as it displays perfect code
    // return copyString;
  };

  // function getObjects(){    
  //   // Format the detected objects as code    
  //   console.log();
  // }

  // To handle Wavesurfer object
  useEffect(() => {
    if (wavesurferObj) {
      setIsWavesurferReady(true);
    }
  }, [wavesurferObj]);

  function playSound(soundname){    

    const foundSound = audioArray.find(sound => sound.fileName === soundname);
    if (foundSound) {
        return foundSound.audioUrl;
    } else {
        console.log("Sound not found in audioArray");
        return "defaultsound.wav"; // Or return a default sound URL, or handle the case accordingly
    }

  }  
  function getSound(){
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
        const oldDefinition_start = Blockly.Blocks["start_sound"];

        // Create a new block definition with the updated field value
        const newDefinition_play = {
          ...oldDefinition_play,
          init: function () {
            this.appendDummyInput().appendField("Set Sound");
            this.appendDummyInput()
              .appendField("Sound Name:")
              .appendField(new Blockly.FieldDropdown(audioArray.map(sound => [sound.fileName, sound.fileName])), "SOUND_NAME");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Play a sound");
          },
        };        

        // Unregister the old block
        delete Blockly.Blocks['play_sound'];        
        Blockly.Blocks['play_sound'] = newDefinition_play;        

        // Clear the workspace and add the new block
        workspace.clear();
      }
    }, 100); // Check every 100 milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this runs only once on mount

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
