const constants = require("../core/constants");
module.exports = function(g5, p5) {
  g5.prototype._toRadians = function(angle) {
    if (this._angleMode === constants.DEGREES) {
      return angle * constants.DEG_TO_RAD;
    }
    return angle;
  };
};
