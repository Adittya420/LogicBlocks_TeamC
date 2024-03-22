import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { useSelector } from "react-redux";
import {
    setModelUrl,
    setDetectedClass,
    setPredictionResult,
    setVideoState,
    setVideoTransparency,
  } from "../../features/Techable";

export const TechableMachine = `
<category name="Teachable Machine" colour="">
<block type="use_model"></block>
<block type="when_model_detects"></block>
<block type="model_prediction"></block>
<block type="prediction_is"></block>
<block type="turn_video"></block>
<block type="set_video_transparency"></block>
</category>
  
`;

Blockly.Blocks["use_model"] = {
  init: function () {
    this.appendDummyInput().appendField("Use Model").appendField(new Blockly.FieldTextInput("Paste URL Here"), "MODEL_URL");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Load the Teachable Machine model from the provided URL");
  },
};

javascriptGenerator["use_model"] = function (block) {
    var modelUrl = block.getFieldValue("MODEL_URL");
    var code = `
      dispatch(setModelUrl('${modelUrl}'));
    `;
    console.log(code);
    return code;
  };

Blockly.Blocks["label"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("label:")
      .appendField(new Blockly.FieldCheckbox(false), "LABEL");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Name the Objects in the video stream");
  },
};


Blockly.Blocks["when_model_detects"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("when model detects")
        .appendField(new Blockly.FieldDropdown([["Class 1", "CLASS_1"], ["Class 2", "CLASS_2"]]), "DETECTED_CLASS");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Set the class that the model detects");
    },
  };
  
  javascriptGenerator["when_model_detects"] = function (block) {
    var detectedClass = block.getFieldValue("DETECTED_CLASS");
    var code = `
      dispatch(setDetectedClass('${detectedClass}'));
    `;
    console.log(code);
    return code;
  };
  
  Blockly.Blocks["model_prediction"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("model prediction")
        .appendField(new Blockly.FieldCheckbox(false), "PREDICTION_ENABLED");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Enable or disable model prediction");
    },
  };
  
  javascriptGenerator["model_prediction"] = function (block) {
    var predictionEnabled = block.getFieldValue("PREDICTION_ENABLED") === "TRUE";
    var code = `
      dispatch(setPredictionResult(${predictionEnabled}));
    `;
    console.log(code);
    return code;
  };
  
  Blockly.Blocks["prediction_is"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("prediction is")
        .appendField(new Blockly.FieldDropdown([["Class 1", "CLASS_1"], ["Class 2", "CLASS_2"]]), "PREDICTED_CLASS");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Set the predicted class");
    },
  };
  
  javascriptGenerator["prediction_is"] = function (block) {
    var predictedClass = block.getFieldValue("PREDICTED_CLASS");
    var code = `
      dispatch(setDetectedClass('${predictedClass}'));
    `;
    console.log(code);
    return code;
  };
  
  Blockly.Blocks["turn_video"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("turn video")
        .appendField(new Blockly.FieldDropdown([["on", "ON"], ["off", "OFF"]]), "VIDEO_STATE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Turn the video on or off");
    },
  };
  
  javascriptGenerator["turn_video"] = function (block) {
    var videoState = block.getFieldValue("VIDEO_STATE") === "ON";
    var code = `
      dispatch(setVideoState(${videoState}));
    `;
    console.log(code);
    return code;
  };
  
  Blockly.Blocks["set_video_transparency"] = {
    init: function () {
      this.appendDummyInput()
        .appendField("set video transparency to")
        .appendField(new Blockly.FieldNumber(50, 0, 100), "TRANSPARENCY_VALUE");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip("Set the transparency value for the video");
    },
  };
  
  javascriptGenerator["set_video_transparency"] = function (block) {
    var transparencyValue = block.getFieldValue("TRANSPARENCY_VALUE");
    var code = `
      dispatch(setVideoTransparency(${transparencyValue}));
    `;
    console.log(code);
    return code;
  };
