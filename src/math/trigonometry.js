/* global DEGREES, DEG_TO_RAD */
module.exports = function (g5, p5) {
  g5.prototype._toRadians = function (angle) {
    if (this._angleMode === DEGREES) {
      return angle * DEG_TO_RAD
    }
    return angle
  }
}
