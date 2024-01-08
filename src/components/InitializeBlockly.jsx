import Blockly from "blockly/core";
import "blockly/blocks";

const InitializeBlockly = (toolboxXml) => {
  const workspace = Blockly.inject("blocklyDiv", {
    media: "https://unpkg.com/blockly/media/",
    toolbox: toolboxXml,
    zoom: {
      controls: false, // Disable default controls
      wheel: true,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2,
      pinch: true,
    },
    grid: {
      spacing: 20,
      length: 3,
      colour: "#ccc",
      snap: true,
    },
    trashcan: false,
    move: {
      scrollbars: true,
      drag: true,
      wheel: true,
    },
  });

  // Create custom zoom controls
  const customUndoButton = createUndoButton(workspace, 30);
  const customRedoButton = createRedoButton(workspace, 30);

  // Append custom controls to Blockly's div
  const blocklyDiv = workspace.getParentSvg().parentNode;
  blocklyDiv.appendChild(customUndoButton.button);
  blocklyDiv.appendChild(customRedoButton.button);

  // Create custom zoom controls
  const customZoomInButton = createZoomInButton(workspace, 30);
  const customZoomOutButton = createZoomOutButton(workspace, 30);
  const customResetButton = createResetButton(workspace, 30);

  // Append custom controls to Blockly's div
  // const blocklyDiv = workspace.getParentSvg().parentNode;
  blocklyDiv.appendChild(customZoomInButton.button);
  blocklyDiv.appendChild(customResetButton.button);
  blocklyDiv.appendChild(customZoomOutButton.button);

  return workspace;
};

// Helper functions to create undo, redo, zoom-in, zoom-out, and reset buttons
function createZoomInButton(workspace, size) {
  const button = document.createElement("button");
  button.innerHTML = `<img src="/zoom-in.svg" alt="Zoom In">`;
  button.addEventListener("click", () => {
    const currentScale = workspace.getScale();
    const newScale = Math.min(Math.max(currentScale + 0.1, 0.3), 3);
    workspace.setScale(newScale);
  });

  setButtonStyles_zoom(button, size);
  button.style.marginBottom = "80px";
  button.style.marginRight = "8px";
  return { button };
}

function createZoomOutButton(workspace, size) {
  const button = document.createElement("button");
  button.innerHTML = `<img src="/zoom-out.svg" alt="Zoom Out"> `;
  button.addEventListener("click", () => {
    const currentScale = workspace.getScale();
    const newScale = Math.max(currentScale - 0.1, 0.3);
    workspace.setScale(newScale);
  });

  setButtonStyles_zoom(button, size);
  button.style.marginBottom = "45px";
  button.style.marginRight = "8px";
  return { button };
}

function createResetButton(workspace, size) {
  const button = document.createElement("button");
  const imagePath = "/zoom-reset.svg";
  button.innerHTML = `<img src="${imagePath}" alt="Reset"> `;
  button.addEventListener("click", () => {
    centerWorkspace(workspace);
  });

  setButtonStyles_zoom(button, size);
  button.style.marginBottom = "10px";
  button.style.marginRight = "8px";

  return { button };
}

function centerWorkspace(workspace) {
  const viewSize = workspace.getCanvas().getBBox();
  workspace.scrollCenter(
    viewSize.x + viewSize.width / 2,
    viewSize.y + viewSize.height / 2
  );
}

// Helper function to set common button styles
function setButtonStyles_zoom(button, size) {
  button.style.zIndex = "1000";
  button.style.position = "absolute";
  button.style.visibility = "visible";
  button.style.right = "10px";
  button.style.bottom = "10px";
  button.style.width = `${size}px`;
  button.style.height = `${size}px`;
  button.style.borderRadius = "50%";
  button.style.backgroundColor = "transparent";
  button.style.border = "2px solid #808080";
}

function createUndoButton(workspace, size) {
  const button = document.createElement("button");
  button.innerHTML = `<img src="/undo.svg" alt="Undo"> `;
  button.addEventListener("click", () => {
    workspace.undo();
  });

  setButtonStyles(button, size);
  button.style.marginBottom = "10px"; // Adjust the position as needed
  button.style.marginRight = "100px";
  return { button };
}

function createRedoButton(workspace, size) {
  const button = document.createElement("button");
  button.innerHTML = `<img src="/redo.svg" alt="Redo"> `;
  button.addEventListener("click", () => {
    workspace.undo(true);
  });

  setButtonStyles(button, size);
  button.style.marginBottom = "10px"; // Adjust the position as needed
  button.style.marginRight = "65px";
  return { button };
}

// Helper function to set common button styles
function setButtonStyles(button, size) {
  button.style.zIndex = "1000";
  button.style.position = "absolute";
  button.style.visibility = "visible";
  button.style.right = "10px";
  button.style.bottom = "10px";
  button.style.width = `${size}px`;
  button.style.height = `${size}px`;
  button.style.borderRadius = "50%";
  button.style.backgroundColor = "transparent";
  button.style.border = "2px solid #808080";
  ``;
}

export default InitializeBlockly;
