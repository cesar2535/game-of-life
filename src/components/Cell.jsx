import React from "react";
import "./Cell.css";

function Cell({ x, y, size }) {
  return (
    <div
      className="cell"
      style={{
        top: `${size * y + 1}px`,
        left: `${size * x + 1}px`,
        width: `${size - 1}px`,
        height: `${size - 1}px`,
      }}
    />
  );
}

export default Cell;
