// BlocklyBlocksAndCategory.js
import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

// Assuming you have a global store variable containing the sound state
// Ensure to dispatch actions to update the sound state in your application

// Define a placeholder initial state
const initialState = {
  sound: {
    isPlaying: false,
    audio: null,
  },
};

export const Sounds = `
  <category name="Sounds" colour="">
    <block type="play_sound"></block>
    <block type="start_sound"></block>
    <block type="change_by_effect"></block>
    <block type="set_by_effect"></block>
    <block type="clear_sound_effects"></block>
    <block type="change_volume_by"></block>
    <block type="set_volume_to"></block>
    <block type="stop_sound"></block>
  </category>
`;

// Define the 'play_sound' block
Blockly.Blocks["play_sound"] = {
  init: function () {
    this.appendDummyInput().appendField("Play Sound");
    this.appendDummyInput()
      .appendField("Sound Name:")
      .appendField(new Blockly.FieldTextInput("meow"), "SOUND_NAME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Play a sound");

    // Add onchange event listener to play and stop the sound
    this.setOnChange(function (changeEvent) {
      if (changeEvent.element == "field" && changeEvent.name == "SOUND_NAME") {
        var soundName = this.getFieldValue("SOUND_NAME");
        var isSoundPlaying = store.getState().sound.isPlaying;

        if (!isSoundPlaying) {
          // Dispatch an action to update the sound state
          store.dispatch({ type: "PLAY_SOUND", payload: { soundName } });
        } else {
          // Dispatch an action to stop the sound
          store.dispatch({ type: "STOP_SOUND" });
        }
      }
    });
  },
};

// Generator code for 'play_sound' block
javascriptGenerator["play_sound"] = function (block) {
  var soundName = block.getFieldValue("SOUND_NAME");
  var code = `var audio = new Audio(${soundName}));
audio.play();`;
  console.log(code);
  return code;
};

// ... (continue with other block definitions and generators)

// Function to stop the sound
Blockly.Blocks["stop_sound"] = {
  init: function () {
    this.appendDummyInput().appendField("Stop Sound");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Stop the currently playing sound");
  },
};

// Generator code for 'stop_sound' block
javascriptGenerator["stop_sound"] = function (block) {
  var code = " audio.pause(); \n audio.currentTime = 0;";
  console.log(code);
  return code;
};

// Define the 'start_sound' block
Blockly.Blocks["start_sound"] = {
  init: function () {
    this.appendDummyInput().appendField("Start Sound");
    this.appendDummyInput()
      .appendField("Sound Name:")
      .appendField(new Blockly.FieldTextInput("meow"), "SOUND_NAME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Start playing a sound");
  },
};

// Generator code for 'start_sound' block
javascriptGenerator["start_sound"] = function (block) {
  var soundName = block.getFieldValue("SOUND_NAME");
  var code = "audio.play();\n";
  console.log(code);
  return code;
};

// Define the 'change_by_effect' block
Blockly.Blocks["change_by_effect"] = {
  init: function () {
    this.appendDummyInput().appendField("Change Sound by Effect");
    this.appendDummyInput()
      .appendField("Effect Type:")
      .appendField(new Blockly.FieldTextInput("pitch"), "EFFECT_TYPE");
    this.appendDummyInput()
      .appendField("Amount:")
      .appendField(new Blockly.FieldNumber(10), "AMOUNT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Change the sound by a specified effect");
  },
};

// Generator code for 'change_by_effect' block
javascriptGenerator["change_by_effect"] = function (block) {
  var effectType = block.getFieldValue("EFFECT_TYPE");
  var amount = block.getFieldValue("AMOUNT");
  var code = `var pitchEffect = audio.createPitchShift();\n pitchEffect.pitch += ${amount}; \npitchEffect.connect(audio.destination);\n`;
  console.log(code);
  return code;
};

// Define the 'set_by_effect' block
Blockly.Blocks["set_by_effect"] = {
  init: function () {
    this.appendDummyInput().appendField("Set Sound by Effect");
    this.appendDummyInput()
      .appendField("Effect Type:")
      .appendField(new Blockly.FieldTextInput("pitch"), "EFFECT_TYPE");
    this.appendDummyInput()
      .appendField("Value:")
      .appendField(new Blockly.FieldNumber(50), "VALUE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Set the sound by a specified effect");
  },
};

// Generator code for 'set_by_effect' block
javascriptGenerator["set_by_effect"] = function (block) {
  var effectType = block.getFieldValue("EFFECT_TYPE");
  var value = block.getFieldValue("VALUE");
  var code = `pitchEffect.pitch += ${value};`;
  console.log(code);
  return code;
};

// Define the 'clear_sound_effects' block
Blockly.Blocks["clear_sound_effects"] = {
  init: function () {
    this.appendDummyInput().appendField("Clear Sound Effects");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Clear all sound effects");
  },
};

// Generator code for 'clear_sound_effects' block
javascriptGenerator["clear_sound_effects"] = function (block) {
  var code = "audio.pause();\n audio.volume = 100%;/n";
  console.log(code);
  return code;
};

// Define the 'change_volume_by' block
Blockly.Blocks["change_volume_by"] = {
  init: function () {
    this.appendDummyInput().appendField("Change Volume by");
    this.appendDummyInput()
      .appendField("Amount:")
      .appendField(new Blockly.FieldNumber(10), "AMOUNT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Change the volume by a specified amount");

    // Add onchange event listener to change the volume
    this.setOnChange(function (changeEvent) {
      var amount = this.getFieldValue("AMOUNT");
      // playVolumeChangeSound(amount);
    });
  },
};

javascriptGenerator["change_volume_by"] = function (block) {
  var amount = block.getFieldValue("AMOUNT");
  var code = `audio.volume += ${amount};
if (audio.volume < 0) {
  audio.volume = 0;
}else if (audio.volume > 1) {
  audio.volume = 1;
}`;
  console.log(code);
  return code;
};

// Function to change the volume
function changeVolumeBy(amount) {
  // Implement logic to change the volume by the specified amount
  // For example, update the volume of the audio element
  // audio.volume += amount;
  console.log(`Changing volume by ${amount}`);
}

// Define the 'set_volume_to' block
Blockly.Blocks["set_volume_to"] = {
  init: function () {
    this.appendDummyInput().appendField("Set Volume to");
    this.appendDummyInput()
      .appendField("Volume:")
      .appendField(new Blockly.FieldNumber(50), "VOLUME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Set the volume to a specified value");

    // Add onchange event listener to set the volume
    this.setOnChange(function (changeEvent) {
      var volume = this.getFieldValue("VOLUME");
      setVolumeTo(volume);
    });
  },
};

javascriptGenerator["set_volume_to"] = function (block) {
  var volume = block.getFieldValue("VOLUME");
  var code = `audio.volume = ${volume};
if (audio.volume < 0) {
  audio.volume = 0;
} else if (audio.volume > 1) {
  audio.volume = 1;
}`;
  console.log(code);
  return code;
};

// Function to set the volume
function setVolumeTo(volume) {
  // Check if the audio variable is defined
  if (audio) {
    // Set the volume of the audio element
    audio.volume = volume / 100; // Assuming the volume is in the range [0, 100]

    // Ensure the volume stays within the valid range [0, 1]
    audio.volume = Math.max(0, Math.min(1, audio.volume));

    console.log(`Setting volume to ${volume}`);
  }
}

// Category definition
