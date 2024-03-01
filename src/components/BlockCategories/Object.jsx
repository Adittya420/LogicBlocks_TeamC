import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { useSelector } from "react-redux";

export const Object = `
  <category name="Object" colour="">
    <block type="detect_object"></block>
    <block type="label"></block>
    <block type="detection"></block>
  </category>
`;

Blockly.Blocks["detect_object"] = {
  init: function () {
    this.appendDummyInput().appendField("Detect Objects");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Detect the Objects in the video stream");
  },
};
javascriptGenerator["detect_object"] = function (block) {
  var code = `
  detect_object
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


javascriptGenerator["label"] = function (block) {
  var newVal = block.getFieldValue("LABEL");
  if(newVal == 'TRUE')
    newVal = true;
  else
    newVal = false;
  var code = `
  dispatch(setLabel(${newVal}))
  `;
  console.log(code);
  return code;
};

Blockly.Blocks["detection"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Detect:")
      .appendField(new Blockly.FieldCheckbox(false), "DETECT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("Detect the Objects in the video stream");
  },
};


javascriptGenerator["detection"] = function (block) {
  var newVal = block.getFieldValue("DETECT");
  if(newVal == 'TRUE')
    newVal = true;
  else
    newVal = false;
  var code = `
  dispatch(setDetectRec(${newVal}))
  `;
  console.log(code);
  return code;
};
