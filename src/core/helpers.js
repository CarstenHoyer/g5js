/* global CORNER, CORNERS, RADIUS, CENTER */
require('./constants')

const canvas = {
  modeAdjust: function (a, b, c, d, mode) {
    if (mode === CORNER) {
      return { x: a, y: b, w: c, h: d }
    } else if (mode === CORNERS) {
      return { x: a, y: b, w: c - a, h: d - b }
    } else if (mode === RADIUS) {
      return { x: a - c, y: b - d, w: 2 * c, h: 2 * d }
    } else if (mode === CENTER) {
      return { x: a - c * 0.5, y: b - d * 0.5, w: c, h: d }
    }
  }
}

module.exports = canvas
