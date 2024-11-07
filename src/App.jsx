import { useEffect, useRef, useState } from "react";
import { times } from "lodash";
import raf from "raf";
import "./App.css";

import Board from "./components/Board";

const DIRS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
];

function App() {
  const [isRunning, setRunning] = useState(false);
  const [interval, setInterval] = useState(100);
  const [cells, setCells] = useState([]);
  const [cellSize, setCellSize] = useState(20);
  const [dimension, setDimension] = useState({ width: 800, height: 600 });
  /** @type {React.MutableRefObject<boolean[][]>} */
  const boardRef = useRef([]);
  const tableRef = useRef({
    cols: dimension.width / cellSize,
    rows: dimension.height / cellSize,
  });
  const frameRef = useRef({ id: -1, then: 0, startedAt: 0 });

  function fetchBoard() {
    const rows = dimension.height / cellSize;
    const cols = dimension.width / cellSize;
    const board = times(rows, () => times(cols, () => false));
    return board;
  }

  /**
   * @returns ({ x: number, y: number })[]
   */
  function makeCells() {
    return boardRef.current.reduce((acc, rows, y) => {
      const cells = rows.reduce((acc, item, x) => {
        return item ? acc.concat({ x, y }) : acc;
      }, []);
      return acc.concat(cells);
    }, []);
  }

  function calculateNeighbors(board, x, y) {
    const neighbors = DIRS.reduce((acc, dir) => {
      const y1 = y + dir[0];
      const x1 = x + dir[1];
      const hasNeighbors =
        x1 >= 0 &&
        x1 < tableRef.current.cols &&
        y1 >= 0 &&
        y1 < tableRef.current.rows &&
        board[y1][x1];

      if (hasNeighbors) {
        return acc + 1;
      }
      return acc;
    }, 0);

    return neighbors;
  }

  function loop() {
    frameRef.current.id = raf(loop);
    const now = Date.now();
    const elapsed = now - frameRef.current.then;

    if (elapsed > interval) {
      frameRef.current.then = now - (elapsed % interval);

      const tempBoard = fetchBoard();
      const nextBoard = tempBoard.map((row, y) => {
        return row.map((col, x) => {
          const neighbors = calculateNeighbors(boardRef.current, x, y);
          if (boardRef.current[y][x]) {
            if (neighbors === 2 || neighbors === 3) {
              return true;
            } else {
              return false;
            }
          } else {
            if (!boardRef.current[y][x] && neighbors === 3) {
              return true;
            }
            return col;
          }
        });
      });

      boardRef.current = nextBoard;
      setCells(makeCells());
    }
  }

  function stopLoop() {
    if (frameRef.current.id >= 0) {
      raf.cancel(frameRef.current.id);
      frameRef.current.id = -1;
    }
  }

  function handleClick({ x, y }) {
    boardRef.current[y][x] = !boardRef.current[y][x];

    setCells(makeCells());
  }
  function handleIntervalChange(event) {
    setInterval(event.target.value);
  }
  function handleStop() {
    setRunning(false);
    stopLoop();
  }
  function handleStart() {
    setRunning(true);

    frameRef.current.then = Date.now();
    frameRef.current.startedAt = frameRef.current.then;
    frameRef.current.id = raf(loop);
  }
  function handleRandom() {
    const board = boardRef.current.map((row, y) =>
      row.map((col, x) => Math.random() >= 0.5)
    );
    boardRef.current = board;
    setCells(makeCells());
  }
  function handleClear() {
    boardRef.current = fetchBoard();
    setCells(makeCells());
    handleStop();
  }

  useEffect(() => {
    boardRef.current = fetchBoard();
  }, []);

  return (
    <div className="app">
      <div>Total cells: {cells.length}</div>
      <Board
        width={dimension.width}
        height={dimension.height}
        cellSize={cellSize}
        cells={cells}
        onClick={handleClick}
      />
      <div className="controls">
        Update every <input value={interval} onChange={handleIntervalChange} />{" "}
        ms
        {isRunning ? (
          <button className="button" onClick={handleStop}>
            Stop
          </button>
        ) : (
          <button className="button" onClick={handleStart}>
            Run
          </button>
        )}
        <button className="button" onClick={handleRandom}>
          Random
        </button>
        <button className="button" onClick={handleClear}>
          Clear
        </button>
      </div>
    </div>
  );
}

export default App;
