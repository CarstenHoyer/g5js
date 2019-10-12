/* global expect */
window.p5 = require('p5/lib/p5')
global.G5 = require('../src/core/main')

global.s = input => {
  return input.trim().split('\n').map(i => i.trim())
}

global.validate = (g5, gcode) => {
  expect(g5.gcode.commands.length).toBe(gcode.length)
  gcode.map((code, i) => expect(g5.gcode.commands[i]).toBe(code))
}
