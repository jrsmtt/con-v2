import React, { useState } from 'react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css'; // Import the necessary CSS

const ResizableDiv = () => {
  const [size, setSize] = useState({ width: 200, height: 200 });

  const onResize = (event, { size }) => {
    setSize(size);
  };

  return (
    <div>
      <ResizableBox
        width={size.width}
        height={size.height}
        minConstraints={[100, 100]} // minimum size
        maxConstraints={[500, 500]} // maximum size
        onResize={onResize}
        resizeHandles={['se']} // bottom-right corner drag handle
      >
        <div style={{ width: '100%', height: '100%', position: 'relative', border: '1px solid black' }}>
          Resizable Content
          
          {/* Custom dragger icon */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '20px',
              height: '20px',
              background: 'gray',
              cursor: 'se-resize',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '50%'
            }}
          >
            {/* Icon can be an SVG or character */}
            ⇲
          </div>
        </div>
      </ResizableBox>
    </div>
  );
};

export default ResizableDiv;
