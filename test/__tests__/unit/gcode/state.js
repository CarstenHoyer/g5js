/* global extend, test, validate, s, expect */

test('can create point', async () => {
  const g5 = extend({}, function () {}, window.p5)
  g5.point(100, 50)

  validate(g5, s(`
    G0 X100 Y50
    G0 Z0
    G4 P1000
    G0 Z1
  `))
  expect(true).toBe(true)
})
