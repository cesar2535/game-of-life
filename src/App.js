import React, { Component } from 'react'
import { times } from 'lodash'
import raf from 'raf'
import './App.css'

import Board from './components/Board'

const DIRS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1]
]

class App extends Component {
  state = {
    isRunning: false,
    interval: 100,
    cells: [],
    cellSize: 20,
    width: 800,
    height: 600
  }

  constructor(props) {
    super(props)

    this.rows = this.state.height / this.state.cellSize
    this.cols = this.state.width / this.state.cellSize
    this.board = this.initlizeBoard()
  }

  startGame = () => {
    this.setState({ isRunning: true })

    this.then = Date.now()
    this.startTime = this.then

    this._frameId = raf(this.loop)
  }

  stopGame = () => {
    this.setState({ isRunning: false })
    this.stopLoop()
  }

  initlizeBoard() {
    const { width, height, cellSize } = this.state
    const rows = height / cellSize
    const cols = width / cellSize
    const board = times(rows, () => times(cols, () => false))
    return board
  }

  makeCells() {
    return this.board.reduce((acc, rows, y) => {
      const cells = rows.reduce((acc, item, x) => {
        return item ? acc.concat({ x, y }) : acc
      }, [])
      return acc.concat(cells)
    }, [])
  }

  loop = () => {
    this._frameId = raf(this.loop)
    const now = Date.now()
    const elapsed = now - this.then

    if (elapsed > this.state.interval) {
      this.then = now - (elapsed % this.state.interval)

      const newBoard = this.initlizeBoard()

      const board = newBoard.map((row, y) => {
        return row.map((col, x) => {
          const neighbors = this.calculateNeighbors(this.board, x, y)
          if (this.board[y][x]) {
            if (neighbors === 2 || neighbors === 3) {
              return true
            } else {
              return false
            }
          } else {
            if (!this.board[y][x] && neighbors === 3) {
              return true
            }
            return col
          }
        })
      })

      this.board = board
      this.setState({ cells: this.makeCells() })
    }
  }

  stopLoop() {
    if (this._frameId) {
      raf.cancel(this._frameId)
      this._frameId = null
    }
  }

  calculateNeighbors(board, x, y) {
    const neighbors = DIRS.reduce((acc, dir) => {
      const y1 = y + dir[0]
      const x1 = x + dir[1]
      const hasNeighbors =
        x1 >= 0 && x1 < this.cols && y1 >= 0 && y1 < this.rows && board[y1][x1]

      if (hasNeighbors) {
        return acc + 1
      }
      return acc
    }, 0)

    return neighbors
  }

  handleIntervalChange = event => {
    this.setState({ interval: event.target.value })
  }

  handleRandom = () => {
    const board = this.board.map((row, y) =>
      row.map((col, x) => {
        return Math.random() >= 0.5
      })
    )
    this.board = board
    this.setState({ cells: this.makeCells() })
  }

  handleClear = () => {
    this.board = this.initlizeBoard()
    this.setState({
      cells: this.makeCells(),
      isRunning: false
    })
    this.stopLoop()
  }

  handleClick = ({ x, y }) => {
    this.board[y][x] = !this.board[y][x]

    this.setState({ cells: this.makeCells() })
  }

  render() {
    const { width, height, cells, cellSize, isRunning } = this.state
    return (
      <div className="App">
        <div>Total cells: {cells.length}</div>
        <Board
          width={width}
          height={height}
          cellSize={cellSize}
          cells={cells}
          onClick={this.handleClick}
        />
        <div className="controls">
          Update every{' '}
          <input
            value={this.state.interval}
            onChange={this.handleIntervalChange}
          />{' '}
          ms
          {isRunning ? (
            <button className="button" onClick={this.stopGame}>
              Stop
            </button>
          ) : (
            <button className="button" onClick={this.startGame}>
              Run
            </button>
          )}
          <button className="button" onClick={this.handleRandom}>
            Random
          </button>
          <button className="button" onClick={this.handleClear}>
            Clear
          </button>
        </div>
      </div>
    )
  }
}

export default App
