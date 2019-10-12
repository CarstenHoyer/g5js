/* global G5, extend, QUARTER_PI, test, validate, s, CENTER */

test('can rotate rect 90 degrees', async () => {
  const g5 = extend({}, function () {}, window.p5)
  g5.rotate(QUARTER_PI)
  g5.rect(100, 0, 100, 50)

  validate(g5, s(`
    G0 X70.711 Y70.711
    G0 Z0
    G1 X141.421 Y141.421 F1500
    G1 X106.066 Y176.777 F1500
    G1 X35.355 Y106.066 F1500
    G1 X70.711 Y70.711 F1500
    G0 Z1
  `))
})

test('can translate rect', async () => {
  const g5 = extend({}, function () {}, window.p5)
  g5.translate(100, 100)
  g5.rect(0, 0, 100, 50)

  validate(g5, s(`
    G0 X100 Y100
    G0 Z0
    G1 X200 Y100 F1500
    G1 X200 Y150 F1500
    G1 X100 Y150 F1500
    G1 X100 Y100 F1500
    G0 Z1
  `))
})

test('can translate rect in rectMode CENTER', async () => {
  const g5 = extend({}, function () {}, window.p5)
  g5.rectMode(CENTER)
  g5.translate(10, 20)
  g5.rect(25, 30, 50, 60)

  validate(g5, s(`
    G0 X10 Y20
    G0 Z0
    G1 X60 Y20 F1500
    G1 X60 Y80 F1500
    G1 X10 Y80 F1500
    G1 X10 Y20 F1500
    G0 Z1
  `))
})

test('can translate and rotate rect in rectMode CENTER', async () => {
  const g5 = extend({}, function () {}, window.p5)
  g5.translate(100, 100)
  g5.rotate(QUARTER_PI)
  g5.rectMode(CENTER)
  g5.rect(0, 0, 50, 60)

  validate(g5, s(`
    G0 X103.536 Y61.109
    G0 Z0
    G1 X138.891 Y96.464 F1500
    G1 X96.464 Y138.891 F1500
    G1 X61.109 Y103.536 F1500
    G1 X103.536 Y61.109 F1500
    G0 Z1
  `))
})

test('can translate and rotate rect', async () => {
  const g5 = extend({}, function () {}, window.p5)
  g5.translate(100, 100)
  g5.rotate(QUARTER_PI)
  g5.rect(0, 0, 100, 50)

  validate(g5, s(`
    G0 X100 Y100
    G0 Z0
    G1 X170.711 Y170.711 F1500
    G1 X135.355 Y206.066 F1500
    G1 X64.645 Y135.355 F1500
    G1 X100 Y100 F1500
    G0 Z1
  `))
})

test('can rotate and translate rect', async () => {
  const g5 = extend({}, function () {}, window.p5)
  g5.rotate(QUARTER_PI)
  g5.translate(100, 100)
  g5.rect(100, 0, 100, 50)

  validate(g5, s(`
    G0 X70.711 Y212.132
    G0 Z0
    G1 X141.421 Y282.843 F1500
    G1 X106.066 Y318.198 F1500
    G1 X35.355 Y247.487 F1500
    G1 X70.711 Y212.132 F1500
    G0 Z1
  `))
})
