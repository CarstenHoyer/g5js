const mat3 = require("gl-matrix/mat3");
const vec3 = require("gl-matrix/vec3");

module.exports = function(g5, p5) {
  g5.prototype._apply = function(a, b, c, d, e, f) {
    const { transformMatrix: m } = this.gcode.state;
    const transform = mat3.fromValues(a, b, e, c, d, f, 0, 0, 1);
    mat3.mul(m, m, transform);
  };

  g5.prototype.applyMatrix = function() {
    this.callSuper("_validateParameters", "applyMatrix", arguments);
    return this.callSuper("applyMatrix", arguments);
  };

  g5.prototype.resetMatrix = function() {
    this.callSuper("_validateParameters", "resetMatrix", arguments);
    return this.callSuper("resetMatrix", arguments);
  };

  g5.prototype.rotate = function(angle, axis = [0, 0, 1]) {
    this.callSuper("_validateParameters", "rotate", arguments);
    const { transformMatrix } = this.gcode.state;
    const angleInRadians = this._toRadians(angle);
    mat3.rotate(transformMatrix, transformMatrix, angleInRadians, axis);
    return this.callSuper("rotate", arguments);
  };

  // g5.prototype.rotateX = function () {
  //   this.callSuper('_validateParameters', 'rotateX', arguments)
  //   return this.callSuper('rotateX', arguments)
  // }

  // g5.prototype.rotateY = function () {
  //   this.callSuper('_validateParameters', 'rotateY', arguments)
  //   return this.callSuper('rotateY', arguments)
  // }

  // g5.prototype.rotateZ = function () {
  //   this.callSuper('_validateParameters', 'rotateZ', arguments)
  //   return this.callSuper('rotateZ', arguments)
  // }

  g5.prototype.scale = function(x, y, z) {
    this.callSuper("_validateParameters", "scale", arguments);
    const { transformMatrix } = this.gcode.state;
    // Only check for Vector argument type if Vector is available
    if (this.Vector && x instanceof this.Vector) {
      var v = x;
      x = v.x;
      y = v.y;
      z = v.z;
    } else if (x instanceof Array) {
      var rg = x;
      x = rg[0];
      y = rg[1];
      z = rg[2] || 1;
    }
    if (isNaN(y)) {
      y = z = x;
    } else if (isNaN(z)) {
      z = 1;
    }

    mat3.scale(transformMatrix, transformMatrix, [x, y, z]);

    return this.callSuper("scale", arguments);
  };

  g5.prototype.shearX = function(angle) {
    this.callSuper("_validateParameters", "shearX", arguments);
    const rad = this._toRadians(angle);
    // shearX
    this._apply(1, 0, Math.tan(rad), 1, 0, 0);
    return this.callSuper("shearX", arguments);
  };

  g5.prototype.shearY = function(angle) {
    this.callSuper("_validateParameters", "shearY", arguments);
    const rad = this._toRadians(angle);
    // shearY
    this._apply(1, Math.tan(rad), 0, 1, 0, 0);
    return this.callSuper("shearY", arguments);
  };

  g5.prototype.translate = function(x, y, z) {
    this.callSuper("_validateParameters", "translate", arguments);
    const { transformMatrix } = this.gcode.state;
    // support passing a vector as the 1st parameter
    if (x.x && x.y) {
      y = x.y;
      x = x.x;
    }

    z = z || 0;

    mat3.translate(transformMatrix, transformMatrix, vec3.fromValues(x, y, z));
    console.log({ transformMatrix });

    return this.callSuper("translate", arguments);
  };
};
