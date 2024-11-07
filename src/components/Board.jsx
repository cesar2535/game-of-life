import React, { useRef } from "react";
import "./Board.css";

import Cell from "./Cell";

function Board(props) {
  const { cellSize, cells, width, height, onClick } = props;
  /** @type {React.MutableRefObject<HTMLDivElement>} */
  const elementRef = useRef();
  const tableRef = useRef({
    cols: width / cellSize,
    rows: height / cellSize,
  });

  function getElementOffset() {
    const rect = elementRef.current.getBoundingClientRect();
    const doc = document.documentElement;

    return {
      x: rect.left + window.scrollX - doc.clientLeft,
      y: rect.top + window.scrollY - doc.clientTop,
    };
  }

  /**
   * @param {MouseEvent} event
   */
  function handleClick(event) {
    const elementOffset = getElementOffset();
    const offsetX = event.clientX - elementOffset.x;
    const offsetY = event.clientY - elementOffset.y;

    const x = Math.floor(offsetX / cellSize);
    const y = Math.floor(offsetY / cellSize);

    if (
      x >= 0 &&
      x <= tableRef.current.cols &&
      y >= 0 &&
      y <= tableRef.current.rows
    ) {
      onClick({ x, y });
    }
  }

  return (
    <div
      ref={elementRef}
      className="board"
      style={{ width, height }}
      onClick={handleClick}
    >
      {cells.map((cell) => (
        <Cell
          key={`${cell.x},${cell.y}`}
          x={cell.x}
          y={cell.y}
          size={cellSize}
        />
      ))}
    </div>
  );
}

Board.defaultProps = {
  width: 800,
  height: 600,
  cells: [],
  onClick: () => null,
};

export default Board;
