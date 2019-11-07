const mat3 = require('gl-matrix/mat3')

module.exports = function (g5, p5) {
  g5.prototype.push = function () {
    this.gcode.states.push(this.gcode.state)
    this.gcode.state = Object.assign({}, this.gcode.state)
    this.gcode.state.transformMatrix = mat3.fromValues(...this.gcode.state.transformMatrix.map(v => v))
    return this.callSuper('push', arguments)
  }

  g5.prototype.pop = function () {
    const state = this.gcode.states.pop()
    if (state) {
      this.gcode.state = Object.assign({}, state)
      this.gcode.state.transformMatrix = mat3.fromValues(...this.gcode.state.transformMatrix.map(v => v))
    }
    return this.callSuper('pop', arguments)
  }

  g5.prototype.redraw = function () {
    this.gcode.resetMatrix()
    this.gcode.commands = []
    return this.callSuper('redraw', arguments)
  }
}
