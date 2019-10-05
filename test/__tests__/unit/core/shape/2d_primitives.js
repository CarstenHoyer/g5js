/* global G5, test, HALF_PI, validate, s, CORNERS, CENTER, RADIUS */
const vec2 = require('gl-matrix/vec2')
const math = require('mathjs/dist/math')
// test('can create point', () => {
//   const g5 = new G5()
//   g5.point(100, 50)

//   validate(g5, s(`
//     G0 X100 Y50
//     G0 Z0
//     G4 P1000
//     G0 Z1
//   `))
// })

test('can what', () => {
  // const a = vec2.fromValues(2, 4)
  // const b = vec2.fromValues(1, 1)
  // const d = vec2.fromValues(2, 2)
  // const c = vec2.subtract(vec2.create(), a, vec2.subtract(vec2.create(), b, d))
  // const e = vec2.scale(vec2.create(), a, 2)
  // expect(e[0]).toBe(4)
  // expect(e[1]).toBe(8)

  const { complex, re, im } = math
  const a = complex(2, 3)
  const b = complex('4 - 2i')
  const c = math.add(a, b)
  expect(re(c)).toBe(6)
  expect(im(c)).toBe(1)
})

test('can create line', async () => {
  const g5 = await G5({}, null)
  g5.line(100, 50, 400, 10)

  validate(g5, s(`
    G0 X100 Y50
    G0 Z0
    G1 X400 Y10 F1500
    G0 Z1
  `))
})

test('can create rect', async () => {
  const g5 = await G5({}, null)
  g5.rect(10, 20, 400, 400)

  validate(g5, s(`
    G0 X10 Y20
    G0 Z0
    G1 X410 Y20 F1500
    G1 X410 Y420 F1500
    G1 X10 Y420 F1500
    G1 X10 Y20 F1500
    G0 Z1
  `))
})

test('can create rect with rectMode CORNERS', async () => {
  const g5 = await G5({}, null)
  g5.rectMode(CORNERS)
  g5.rect(10, 20, 400, 400)

  validate(g5, s(`
    G0 X10 Y20
    G0 Z0
    G1 X400 Y20 F1500
    G1 X400 Y400 F1500
    G1 X10 Y400 F1500
    G1 X10 Y20 F1500
    G0 Z1
  `))
})

test('can create rect with rectMode CENTER', async () => {
  const g5 = await G5({}, null)
  g5.rectMode(CENTER)
  g5.rect(60, 80, 100, 120)

  validate(g5, s(`
    G0 X10 Y20
    G0 Z0
    G1 X110 Y20 F1500
    G1 X110 Y140 F1500
    G1 X10 Y140 F1500
    G1 X10 Y20 F1500
    G0 Z1
  `))
})

test('can create rect with rectMode RADIUS', async () => {
  const g5 = await G5({}, null)
  g5.rectMode(RADIUS)
  g5.rect(60, 80, 100, 120)

  validate(g5, s(`
    G0 X-40 Y-40
    G0 Z0
    G1 X160 Y-40 F1500
    G1 X160 Y200 F1500
    G1 X-40 Y200 F1500
    G1 X-40 Y-40 F1500
    G0 Z1
  `))
})

test('can create quad', async () => {
  const g5 = await G5({}, null)
  g5.quad(38, 31, 86, 20, 69, 63, 30, 76)

  validate(g5, s(`
    G0 X38 Y31
    G0 Z0
    G1 X86 Y20 F1500
    G1 X69 Y63 F1500
    G1 X30 Y76 F1500
    G1 X38 Y31 F1500
    G0 Z1
  `))
})

test('can create triangle', async () => {
  const g5 = await G5({}, null)
  g5.triangle(30, 75, 58, 20, 86, 75)

  validate(g5, s(`
    G0 X30 Y75
    G0 Z0
    G1 X58 Y20 F1500
    G1 X86 Y75 F1500
    G1 X30 Y75 F1500
    G0 Z1
  `))
})

test('can create square', async () => {
  const g5 = await G5({}, null)
  g5.square(30, 20, 55)

  validate(g5, s(`
    G0 X30 Y20
    G0 Z0
    G1 X85 Y20 F1500
    G1 X85 Y75 F1500
    G1 X30 Y75 F1500
    G1 X30 Y20 F1500
    G0 Z1
  `))
})

test('can create square with rounded corners', async () => {
  const g5 = await G5({}, null)
  g5.square(10, 10, 60, 10)

  validate(g5, s(`
    G0 X10 Y20
    G0 Z0
    G3 X20 Y10 I10 F1500
    G1 X60 Y10 F1500
    G3 X70 Y20 J10 F1500
    G1 X70 Y60 F1500
    G3 X60 Y70 I-10 F1500
    G1 X20 Y70 F1500
    G3 X10 Y60 J-10 F1500
    G1 X10 Y20 F1500
    G0 Z1
  `))
})

test('can create square with two rounded corners', async () => {
  const g5 = await G5({}, null)
  g5.square(10, 10, 60, 10, 20)

  validate(g5, s(`
    G0 X10 Y20
    G0 Z0
    G3 X20 Y10 I10 F1500
    G1 X50 Y10 F1500
    G3 X70 Y30 J20 F1500
    G1 X70 Y50 F1500
    G3 X50 Y70 I-20 F1500
    G1 X30 Y70 F1500
    G3 X10 Y50 J-20 F1500
    G1 X10 Y20 F1500
    G0 Z1
  `))
})

test('can create circle', async () => {
  const g5 = await G5({}, null)
  g5.circle(100, 100, 100)

  validate(g5, s(`
    G0 X100 Y150
    G3 X64.645 Y135.355 J-50 F1
    G3 X50 Y100 I35.35533905029297 J-35.35533905029297 F1
    G3 X64.645 Y64.645 I50 F1
    G3 X100 Y50 I35.35533905029297 J35.35533905029297 F1
    G3 X135.355 Y64.645 J50 F1
    G3 X150 Y100 I-35.35533905029297 J35.35533905029297 F1
    G3 X135.355 Y135.355 I-50 F1
    G3 X100 Y150 I-35.35533905029297 J-35.35533905029297 F1
    G0 Z1
  `))
})

test('can create arc', async () => {
  const g5 = await G5({}, null)
  g5.arc(50, 50, 80, 80, 1.7853981267948965, 3.926990853589793) // HALF_PI - QUARTER_PI, PI + QUARTER_PI in p5

  validate(g5, s(`
    G0 X130 Y90
    G0 Z0
    G2 R20
    G0 Z1
  `))
})

// test('can create ellipse', () => {
//   const g5 = new G5()
//   g5.ellipse(60, 110, 100, 200)

//   validate(g5, s(`
//     G0 X10 Y30
//     G0 Z0
//     G2 R20
//     G0 Z1
//   `))
// })
