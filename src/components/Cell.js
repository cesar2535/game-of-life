import React from 'react'
import PropTypes from 'prop-types'

const Cell = ({ x, y, size }) => (
  <div
    className="Cell"
    style={{
      top: `${size * y + 1}px`,
      left: `${size * x + 1}px`,
      width: `${size - 1}px`,
      height: `${size - 1}px`
    }}
  />
)

Cell.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  size: PropTypes.number
}

export default Cell
