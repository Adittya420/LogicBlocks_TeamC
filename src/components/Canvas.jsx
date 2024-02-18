
import React, { useState } from 'react';
import { Card } from '@mui/material';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import Blockly from 'blockly';
import 'blockly/javascript';

import {javascriptGenerator} from 'blockly/javascript';


// Import Image from src
import Demo from '../Images/trial_sprite_nobkg.png'

// Import the button components
import FlagButton from './Canvas/FlagButton';
import StopButton from './Canvas/StopButton';
import UndoButton from './Canvas/UndoButton';
import RedoButton from './Canvas/RedoButton';
import ExecutionButton from './Canvas/ExecutionButton';
import ZoomIn from './Canvas/ZoomIn';
import ZoomOut from './Canvas/ZoomOut';
import FullScreen from './Canvas/FullScreen';

const Canvas = () => {

  const [imageSize, setImageSize] = useState(100); // useState for zooming in-out
  const maxImageSize = 200; // Maximum limit for image size
  const minImageSize = 100; // Minimum limit for image size

  const [position, setPosition] = useState({ x: 150, y: 100 }); // useState for image position
  const [dragging, setDragging] = useState(false); // useState for dragging
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // useState for mouse position
  const [positionHistory, setPositionHistory] = useState([{ x: 150, y: 100 }]);
  const [currentPosition, setCurrentPosition] = useState({ x: 150, y: 100 });
  const [historyPointer, setHistoryPointer] = useState(0);
  const [zoomHistory, setZoomHistory] = useState([100]); // useState for zoom history
  const [zoomPointer, setZoomPointer] = useState(0);

  const undo = () => {
    if (historyPointer > 0 || zoomPointer > 0) {
      if (zoomPointer > 0) {
        setZoomPointer(zoomPointer - 1);
        setImageSize(zoomHistory[zoomPointer - 1]);
      } else if (historyPointer > 0) {
        setHistoryPointer(historyPointer - 1);
        setCurrentPosition(positionHistory[historyPointer - 1]);
      }
    } else {
      // If no more undo is possible, set current position and zoom to default
      setHistoryPointer(-1);
      setCurrentPosition({ x: 150, y: 100 });
      setZoomPointer(0);
      setImageSize(minImageSize);
    }
  };
  
  const redo = () => {
    if (historyPointer < positionHistory.length - 1 || zoomPointer < zoomHistory.length - 1) {
      if (zoomPointer < zoomHistory.length - 1) {
        setZoomPointer(zoomPointer + 1);
        setImageSize(zoomHistory[zoomPointer + 1]);
      } else if (historyPointer < positionHistory.length - 1) {
        setHistoryPointer(historyPointer + 1);
        setCurrentPosition(positionHistory[historyPointer + 1]);
      }
    } else {
      // If no more redo is possible, set the current position and zoom to the latest values
      setCurrentPosition(positionHistory[positionHistory.length - 1]);
      setImageSize(zoomHistory[zoomHistory.length - 1]);
    }
  };

  const handleZoomIn = () => {
    setImageSize(prevSize => {
      const newSize = prevSize * 1.2;
      const updatedZoomHistory = [...zoomHistory.slice(0, zoomPointer + 1), newSize];
      setZoomHistory(updatedZoomHistory);
      setZoomPointer(zoomPointer + 1);
      return newSize > maxImageSize ? maxImageSize : newSize;
    });
  };

  const handleZoomOut = () => {
    setImageSize(prevSize => {
      const newSize = prevSize * 0.8;
      const updatedZoomHistory = [...zoomHistory.slice(0, zoomPointer + 1), newSize];
      setZoomHistory(updatedZoomHistory);
      setZoomPointer(zoomPointer + 1);
      return newSize < minImageSize ? minImageSize : newSize;
    });
  };


  const handleMouseDown = (e) => {
    setDragging(true);
    setMousePosition({ x: e.clientX, y: e.clientY });
    setPositionHistory([...positionHistory.slice(0, historyPointer + 1), { ...currentPosition }]);
    setHistoryPointer(historyPointer + 1);
  };


  const handleMouseUp = () => {
    setDragging(false);

    if (
      currentPosition.x !== position.x ||
      currentPosition.y !== position.y
    ) {
      setPositionHistory([...positionHistory.slice(0, historyPointer + 1), { ...currentPosition }]);
      setHistoryPointer(historyPointer + 1);
    }
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const dx = e.clientX - mousePosition.x;
      const dy = e.clientY - mousePosition.y;
      setCurrentPosition(prevPosition => ({
        x: prevPosition.x + dx,
        y: prevPosition.y + dy
      }));
      setMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  //fullscreen
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

// execution button
const handleExecuteBlocks = (event) => {
  console.log('Execution button clicked');

  // Get the main workspace
  const workspace = Blockly.getMainWorkspace();

  // Iterate through all blocks in the workspace
  workspace.getAllBlocks().forEach((block) => {
    // Print the ID of each block to the console

    console.log(`Block ID: ${block.id}`);
  });

  

  // // Convert the entire workspace to JavaScript code
  // const code = javascriptGenerator.workspaceToCode(workspace);

  // try {
  //   // Execute the generated JavaScript code
  //   eval(code);
  // } catch (error) {
  //   console.error(`Error executing blocks: ${error}`);
  // }
};

const handleFlagButtonClicked = () => {
  console.log('When flag clicked block is triggered');

  // Get the main workspace
  const workspace = Blockly.getMainWorkspace();

  // Find the 'when flag clicked' block
  const flagClickedBlock = workspace.getAllBlocks().find((block) => block.type === 'flag_clicked_event');

  if (flagClickedBlock) {
    // Log the ID of the 'when flag clicked' block to the console
    console.log(`Block ID: ${flagClickedBlock.id}`);
  } else {
    console.warn("No 'when flag clicked' block found in the workspace");
  }
};








  return (
    <div className={`Canvasbox ${isFullScreen ? 'fullscreen' : ''}`}>
      <Card className={`highlighted ${isFullScreen ? 'fullscreen-card' : ''}`}>
        <h1 style={{ textAlign: 'center', fontSize: '14px' }}>Canvas</h1>
        <Draggable
          position={{ x: currentPosition.x, y: currentPosition.y }}
          onStart={(e, data) => {
            setDragging(true);
            setMousePosition({ x: data.x, y: data.y });
            setPositionHistory([...positionHistory.slice(0, historyPointer + 1), { ...currentPosition }]);
            setHistoryPointer(historyPointer + 1);
          }}
          onDrag={(e, data) => {
            const dx = data.x - mousePosition.x;
            const dy = data.y - mousePosition.y;
            setCurrentPosition((prevPosition) => ({
              x: prevPosition.x + dx,
              y: prevPosition.y + dy,
            }));
            setMousePosition({ x: data.x, y: data.y });
          }}
          onStop={() => {
            setDragging(false);
            setPositionHistory([...positionHistory.slice(0, historyPointer + 1), { ...currentPosition }]);
            setHistoryPointer(historyPointer + 1);
          }}
        >
          <img
            src={Demo}
            alt="Your Image"
            style={{
              width: `${imageSize}px`,
              height: `${imageSize}px`,
              cursor: 'grab',
            }}
            draggable="false"
          />
        </Draggable>



        <div style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%'
        }}>
          <div>
            <ExecutionButton onClick={handleExecuteBlocks} />
            <FlagButton onClick={handleFlagButtonClicked} />
            <StopButton onClick={() => { }} />
            <UndoButton onClick={undo} disabled={historyPointer <= 0 && zoomPointer <= 0} />
            <RedoButton onClick={redo} disabled={historyPointer >= positionHistory.length - 1 && zoomPointer >= zoomHistory.length - 1} />
          </div>
          <div>
            <ZoomIn onClick={handleZoomIn} disabled={imageSize >= maxImageSize} />
            <ZoomOut onClick={handleZoomOut} disabled={imageSize <= minImageSize} />
            <FullScreen onClick={handleFullScreen} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Canvas;
