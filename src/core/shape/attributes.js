const constant = require("./../constants");

module.exports = function(g5, p5) {
  g5.prototype.rectMode = function(m) {
    this.callSuper("_validateParameters", "rectMode", arguments);
    if (
      m === constant.CORNER ||
      m === constant.CORNERS ||
      m === constant.RADIUS ||
      m === constant.CENTER
    ) {
      this.gcode.state.rectMode = m;
    }
    return this.callSuper("rectMode", arguments);
  };

  g5.prototype.ellipseMode = function(m) {
    this.callSuper("_validateParameters", "ellipseMode", arguments);
    if (
      m === constant.CORNER ||
      m === constant.CORNERS ||
      m === constant.RADIUS ||
      m === constant.CENTER
    ) {
      this.gcode.state.ellipseMode = m;
    }
    return this.callSuper("ellipseMode", arguments);
  };
};
