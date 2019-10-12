/* global G5, extend, test, HALF_PI, validate, s, CORNERS, CENTER, RADIUS */
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
  const g5 = extend({}, function () {}, window.p5)
  g5.line(100, 50, 400, 10)

  validate(g5, s(`
    G0 X100 Y50
    G0 Z0
    G1 X400 Y10 F1500
    G0 Z1
  `))
})

test('can create rect', async () => {
  const g5 = extend({}, function () {}, window.p5)
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
  const g5 = extend({}, function () {}, window.p5)
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
  const g5 = extend({}, function () {}, window.p5)
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
  const g5 = extend({}, function () {}, window.p5)
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
  const g5 = extend({}, function () {}, window.p5)
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
  const g5 = extend({}, function () {}, window.p5)
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
  const g5 = extend({}, function () {}, window.p5)
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
  const g5 = extend({}, function () {}, window.p5)
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
  const g5 = extend({}, function () {}, window.p5)
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
  const g5 = extend({}, function () {}, window.p5)
  g5.circle(100, 100, 100)
  validate(g5, s(`
    G0 X150 Y100
    G0 Z0
    G3 X135.3553466796875 Y135.3553466796875 I-50 F1500
    G3 X100 Y150 I-35.35533905029297 J-35.35533905029297 F1500
    G3 X64.64466094970703 Y135.3553466796875 J-50 F1500
    G3 X50 Y100 I35.35533905029297 J-35.35533905029297 F1500
    G3 X64.64466094970703 Y64.64466094970703 I50 F1500
    G3 X100 Y50 I35.35533905029297 J35.35533905029297 F1500
    G3 X135.3553466796875 Y64.64466094970703 J50 F1500
    G3 X150 Y100 I-35.35533905029297 J35.35533905029297 F1500
    G0 Z1
  `))
})

test('can create a bezier', async () => {
  const g5 = extend({}, function () {}, window.p5)
  g5.bezier(50, 100, 50, 72.38576251, 72.38576251, 50, 100, 50)
  validate(g5, s(`
    G0 X50 Y100
    G0 Z0
    G3 X64.64466094970703 Y64.64466094970703 I50 F1500
    G3 X100 Y50 I35.35533905029297 J35.35533905029297 F1500
    G0 Z1
  `))
})

test('can create a bezier with ccw rotation', async () => {
  const g5 = extend({}, function () {}, window.p5)
  g5.bezier(10, 100, 23, 50, 20, 90, 100, 100)
  validate(g5, s(`
    G0 X10 Y100
    G0 Z0
    G3 X12.175150871276855 Y91.99646759033203 I364.9889831542969 J94.89713287353516 F1500
    G3 X13.546516418457031 Y87.4954605102539 I116.77351379394531 J33.11911392211914 F1500
    G3 X16.08868980407715 Y80.95621490478516 I59.966365814208984 J19.548526763916016 F1500
    G3 X17.83403778076172 Y78.05780792236328 I13.353843688964844 J6.066642761230469 F1500
    G3 X20.9610652923584 Y75.84549713134766 I5.171887397766113 J3.994164228439331 F1500
    G3 X25.037492752075195 Y75.68446350097656 I2.319495677947998 J7.0400309562683105 F1500
    G3 X27.658950805664062 Y76.57120513916016 I-3.7801356315612793 J15.493471145629883 F1500
    G3 X35.520137786865234 Y80.27861785888672 I-63.14645004272461 J144.08343505859375 F1500
    G2 X42.77098846435547 Y83.85529327392578 I181.49794006347656 J-358.8058776855469 F1500
    G2 X47.411861419677734 Y85.9966049194336 I69.634765625 J-144.81976318359375 F1500
    G2 X53.92084503173828 Y88.71186828613281 I67.33102416992188 J-152.24569702148438 F1500
    G2 X60.46659851074219 Y91.1205825805664 I59.48823928833008 J-151.56272888183594 F1500
    G2 X68.78597259521484 Y93.74165344238281 I54.612144470214844 J-158.82725524902344 F1500
    G2 X77.65928649902344 Y96.0503158569336 I51.15036392211914 J-178.38943481445312 F1500
    G2 X88.3309555053711 Y98.2403335571289 I45.25627517700195 J-193.4317169189453 F1500
    G2 X100 Y100 I40.58241653442383 J-229.5473175048828 F1500
    G0 Z1
  `))
})

test('can create arc', async () => {
  const g5 = extend({}, function () {}, window.p5)
  g5.arc(50, 50, 100, 100, 1.7853981267948965, 3.926990853589793) // HALF_PI - QUARTER_PI, PI + QUARTER_PI in p5
  validate(g5, s(`
    G0 X39.352 Y98.853
    G0 Z0
    G3 X14.644661903381348 Y14.644659996032715 I10.647918701171875 J-48.853065490722656 F1500
    G0 Z1
  `))
})

test('can create quarter arc', async () => {
  const g5 = extend({}, function () {}, window.p5)
  g5.arc(50, 50, 100, 100, 0, HALF_PI)
  validate(g5, s(`
    G0 X100 Y50
    G0 Z0
    G3 X50 Y100 I-50 F1500
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
