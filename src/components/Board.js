import React from 'react'
import PropTypes from 'prop-types'
import './Board.css'

import Cell from './Cell'

class Board extends React.Component {
  constructor(props) {
    super(props)

    this.rows = props.height / props.cellSize
    this.cols = props.width / props.cellSize
  }

  setRef = ref => (this.ref = ref)

  getElementOffset() {
    const rect = this.ref.getBoundingClientRect()
    const doc = document.documentElement

    return {
      x: rect.left + window.pageXOffset - doc.clientLeft,
      y: rect.top + window.pageYOffset - doc.clientTop
    }
  }

  handleClick = event => {
    const elementOffset = this.getElementOffset()
    const offsetX = event.clientX - elementOffset.x
    const offsetY = event.clientY - elementOffset.y

    const { cellSize, onClick } = this.props
    const x = Math.floor(offsetX / cellSize)
    const y = Math.floor(offsetY / cellSize)

    if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
      onClick({ x, y })
    }
  }

  renderCell = cell => {
    return (
      <Cell
        key={`${cell.x},${cell.y}`}
        x={cell.x}
        y={cell.y}
        size={this.props.cellSize}
      />
    )
  }

  render() {
    const { cells, width, height } = this.props
    return (
      <div
        ref={this.setRef}
        className="Board"
        style={{ width, height }}
        onClick={this.handleClick}
      >
        {cells.map(this.renderCell)}
      </div>
    )
  }
}

Board.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  cells: PropTypes.array,
  cellSize: PropTypes.number,
  onClick: PropTypes.func
}

Board.defaultProps = {
  width: 800,
  height: 600,
  cells: [],
  onClick: () => null
}

export default Board
