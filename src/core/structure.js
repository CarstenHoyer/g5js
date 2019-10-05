const mat4 = require('gl-matrix/mat4')

module.exports = function (g5, p5) {
  g5.prototype.push = function () {
    this.states.push(this.state)
    this.state = Object.assign({}, this.state)
    this.state.transformMatrix = mat4.fromValues(...this.state.transformMatrix.map(v => v))
    return this.callSuper('push', arguments)
  }

  g5.prototype.pop = function () {
    const state = this.states.pop()
    if (state) {
      this.state = Object.assign({}, state)
      this.state.transformMatrix = mat4.fromValues(...this.state.transformMatrix.map(v => v))
    }
    return this.callSuper('pop', arguments)
  }
}
