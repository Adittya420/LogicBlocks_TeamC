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
import { store } from "../store/store";

const BlocklyComponent = () => {
  const blocklyRef = useRef(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const workspace = Blockly.getMainWorkspace();

  const generateCode = async () => {
    javascriptGenerator.addReservedWords("code");
    var code = javascriptGenerator.workspaceToCode(workspace);
    setGeneratedCode(code);
    await eval(`(async () => { ${code} })();`);
  };

  useEffect(() => {
    if (blocklyRef.current === null) {
      // Initialize Blockly with English
      Blockly.setLocale("en");
      // Construct the complete toolbox XML
      const toolboxXml = `
        <xml id="toolbox" style="display: none">
          ${Logic}
          ${Loops}
          ${Math}
          ${Text}
          ${Sounds}
        </xml>
      `;
      initializeBlockly(toolboxXml); // Initialize Blockly using the separate function
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
      <pre style={{ whiteSpace: "pre-wrap", marginTop: "1px" }}>
        <br></br>
        {generatedCode}
      </pre>
    </div>
  );
};

export default BlocklyComponent;
