import React, { useState, useRef } from 'react';

const ResizableDiv = () => {
  const [width, setWidth] = useState(50); // Default width in 'vw' units
  const isResizing = useRef(false); // Track whether the user is resizing

  // Handle the mouse down event to start resizing
  const handleMouseDown = () => {
    isResizing.current = true;
  };

  // Handle the mouse move event to resize the div
  const handleMouseMove = (event) => {
    if (isResizing.current) {
      // Calculate new width in vw based on mouse movement
      const newWidth = Math.max(10, Math.min((event.clientX / window.innerWidth) * 100, 100));
      setWidth(newWidth);
    }
  };

  // Handle the mouse up event to stop resizing
  const handleMouseUp = () => {
    isResizing.current = false;
  };

  return (
    <div 
      onMouseMove={handleMouseMove} 
      onMouseUp={handleMouseUp}
      style={{ height: '100vh', position: 'relative' }}
    >
      {/* Resizable div */}
      <div 
        style={{ 
          width: `${width}vw`, 
          height: '100px', 
          backgroundColor: 'lightblue', 
          position: 'relative' 
        }}
      >
        Resizable Div - Width: {width}vw
        {/* Dragger icon */}
        <div 
          onMouseDown={handleMouseDown}
          style={{ 
            width: '10px', 
            height: '100px', 
            backgroundColor: 'gray', 
            position: 'absolute', 
            right: 0, 
            top: 0, 
            cursor: 'ew-resize'
          }}
        />
      </div>
    </div>
  );
};

export default ResizableDiv;
