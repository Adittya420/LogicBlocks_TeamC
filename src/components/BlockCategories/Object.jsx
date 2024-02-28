import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { useSelector } from "react-redux";


export const Object = `
  <category name="Object" colour="">
    <block type="detect_object"></block>
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
  var code = `detect_object`;
  console.log(code);
  return code;
};
