/* global extend, test, expect, QUARTER_PI, CENTER, CORNER */
window.p5 = require('p5/lib/p5')
require('p5/lib/addons/p5.dom')
const mat4 = require('gl-matrix/mat4')

test('can push state', async () => {
  const g5 = extend({}, function () {}, window.p5)
  const { transformMatrix, rectMode } = g5.state
  g5.push()
  g5.rectMode(CENTER)
  g5.rotate(QUARTER_PI)
  const {
    transformMatrix: newTransformMatrix,
    rectMode: newRectMode
  } = g5.state

  expect(transformMatrix).toStrictEqual(mat4.create())
  expect(newTransformMatrix).not.toStrictEqual(transformMatrix)
  expect(rectMode).toBe(CORNER)
  expect(newRectMode).toBe(CENTER)
})

test('can pop state', async () => {
  const g5 = extend({}, function () {}, window.p5)
  const { transformMatrix } = g5.state
  g5.push()
  g5.rectMode(CENTER)
  g5.rotate(QUARTER_PI)
  g5.pop()

  const {
    transformMatrix: newTransformMatrix,
    rectMode: newRectMode
  } = g5.state

  expect(transformMatrix).toStrictEqual(mat4.create())
  expect(newTransformMatrix).toStrictEqual(transformMatrix)
  expect(newRectMode).toBe(CORNER)
})
