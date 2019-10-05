/* global CORNER, CORNERS, CENTER, RADIUS */

module.exports = function (g5, p5) {
  g5.prototype.rectMode = function (m) {
    this.callSuper('_validateParameters', 'rectMode', arguments)
    if (
      m === CORNER ||
      m === CORNERS ||
      m === RADIUS ||
      m === CENTER
    ) {
      this.state.rectMode = m
    }
    return this.callSuper('circle', arguments)
  }
}
