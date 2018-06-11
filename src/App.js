import React, { Component } from 'react'
import { times } from 'lodash'
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
    this.loop()
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

  loop() {
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

    this._frameId = window.setTimeout(() => {
      this.loop()
    }, this.state.interval)
  }

  stopLoop() {
    if (this._frameId) {
      window.clearTimeout(this._frameId)
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
        <Board
          width={width}
          height={height}
          cellSize={cellSize}
          cells={cells}
          onClick={this.handleClick}
        />
        <div className="control">
          Update every{' '}
          <input
            value={this.state.interval}
            onChange={this.handleIntervalChange}
          />{' '}
          msec
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
