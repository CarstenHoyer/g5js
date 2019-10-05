const mat4 = require('gl-matrix/mat4')
const vec3 = require('gl-matrix/vec3')

module.exports = function (g5, p5) {
  g5.prototype.applyMatrix = function () {
    this.callSuper('_validateParameters', 'applyMatrix', arguments)
    return this.callSuper('applyMatrix', arguments)
  }

  g5.prototype.resetMatrix = function () {
    this.callSuper('_validateParameters', 'resetMatrix', arguments)
    return this.callSuper('resetMatrix', arguments)
  }

  g5.prototype.rotate = function (angle, axis = [0, 0, 1]) {
    this.callSuper('_validateParameters', 'rotate', arguments)
    const { transformMatrix } = this.state
    const angleInRadians = this._toRadians(angle)
    mat4.rotate(
      transformMatrix,
      transformMatrix,
      angleInRadians,
      axis
    )
    return this.callSuper('rotate', arguments)
  }

  g5.prototype.rotateX = function () {
    this.callSuper('_validateParameters', 'rotateX', arguments)
    return this.callSuper('rotateX', arguments)
  }

  g5.prototype.rotateY = function () {
    this.callSuper('_validateParameters', 'rotateY', arguments)
    return this.callSuper('rotateY', arguments)
  }

  g5.prototype.rotateZ = function () {
    this.callSuper('_validateParameters', 'rotateZ', arguments)
    return this.callSuper('rotateZ', arguments)
  }

  g5.prototype.scale = function () {
    this.callSuper('_validateParameters', 'scale', arguments)
    return this.callSuper('scale', arguments)
  }

  g5.prototype.shearX = function () {
    this.callSuper('_validateParameters', 'shearX', arguments)
    return this.callSuper('shearX', arguments)
  }

  g5.prototype.shearY = function () {
    this.callSuper('_validateParameters', 'shearY', arguments)
    return this.callSuper('shearY', arguments)
  }

  g5.prototype.translate = function (x, y, z) {
    this.callSuper('_validateParameters', 'translate', arguments)
    const { transformMatrix } = this.state
    // support passing a vector as the 1st parameter
    if (x.x && x.y) {
      y = x.y
      x = x.x
    }

    z = z || 0

    mat4.translate(
      transformMatrix,
      transformMatrix,
      vec3.fromValues(x, y, z)
    )

    return this.callSuper('translate', arguments)
  }
}
