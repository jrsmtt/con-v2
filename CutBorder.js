import React from "react";
import "./App.css";

function App() {
  return (
    <div className="container">
      <div className="cut-border-box">
        <div className="content">Content with cut border</div>
      </div>
    </div>
  );
}

export default App;


.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5; /* Adjust to match background */
}

.cut-border-box {
  position: relative;
  border: 4px solid black; /* Main border */
  padding: 20px;
  display: inline-block;
}

.cut-border-box::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -4px; /* Adjust to match border size */
  width: 20px; /* Width of the cut */
  height: 8px; /* Height of the cut */
  background-color: #f5f5f5; /* Same color as background */
  transform: translateY(-50%);
  z-index: 1;
}

.content {
  font-size: 18px;
}
