const { move, down, up, arc, dwell } = require('./gcode/commands')
const vec2 = require('gl-matrix/vec2')

const isEpsilon = (val) => Math.abs(val) <= 1e-6

const transformPoints = function (points, matrix) {
  return points
    .map(point => vec2.transformMat4(point, point, matrix))
    .map(point => ([
      isEpsilon(point[0]) ? 0 : point[0],
      isEpsilon(point[1]) ? 0 : point[1]
    ]))
}

module.exports = function (g5, p5) {
  g5.prototype._rotatePoint = function (angle, start, center) {
    return {
      x: Math.cos(angle) * (start.x - center.x) - Math.sin(angle) * (start.y - center.y) + center.x,
      y: Math.sin(angle) * (start.x - center.x) + Math.cos(angle) * (start.y - center.y) + center.y
    }
  }

  g5.prototype._offset = function (p1, p2) {
    return vec2.fromValues(p2[0] - p1[0], p2[1] - p1[1])
  }

  g5.prototype._computeBezier = function (points) {
    const { compute, __retain, __allocArray, __getArrayView, FLOAT64ARRAY_ID } = this.mod
    const id = __retain(__allocArray(FLOAT64ARRAY_ID, points))
    const arcPoints = __getArrayView(compute(id, 5, 1))
    const arcs = []
    for (let i = 0; i < arcPoints.length; i += 6) {
      arcs.push(this._arc(
        arcPoints[i], // StartAngle
        arcPoints[i + 1], // SweepAngle
        arcPoints[i + 2], // center x
        arcPoints[i + 3], // center y
        arcPoints[i + 4], // radius
        arcPoints[i + 5] // clockwise
      ))
    }

    return arcs.reverse()
  }

  g5.prototype._arc = function (startAngle, sweepAngle, x, y, r, cw) {
    const { transformMatrix: matrix } = this.state
    const start = { x: x + r, y }
    const sp = this._rotatePoint(cw ? startAngle : startAngle + sweepAngle, start, { x, y })
    const ep = this._rotatePoint(cw ? startAngle + sweepAngle : startAngle, start, { x, y })
    const c = cw ? { x: x - sp.x, y: y - sp.y } : { x: x - ep.x, y: y - ep.y }

    const points = transformPoints([
      cw ? vec2.fromValues(sp.x, sp.y) : vec2.fromValues(ep.x, ep.y),
      vec2.fromValues(c.x, c.y),
      cw ? vec2.fromValues(ep.x, ep.y) : vec2.fromValues(sp.x, sp.y)
    ], matrix)

    return { start: points[0], center: points[1], stop: points[2], cw }
  }

  g5.prototype.renderLine = function (x1, y1, x2, y2) {
    const { feedrate: f } = this.gcode.config
    const { transformMatrix: matrix } = this.state

    const points = transformPoints([
      vec2.fromValues(x1, y1),
      vec2.fromValues(x2, y2)
    ], matrix)

    return this.concat([
      move(points[0]),
      down(),
      move(points[1], f),
      up()
    ])
  }

  g5.prototype.renderBezier = function (x1, y1, x2, y2, x3, y3, x4, y4) {
    const { feedrate: f } = this.gcode.config
    const arcs = this._computeBezier([x1, y1, x2, y2, x3, y3, x4, y4])
    this.concat([move(arcs[0].start), down()])
    this.concat(arcs.map(a => arc(a.center, a.stop, a.cw, f)))
    this.concat([up()])
    return this
  }

  g5.prototype.renderEllipse = function (args) {
    const { transformMatrix: matrix } = this.state
    const { feedrate: f } = this.gcode.config

    const x = args[0]
    const y = args[1]
    const w = args[2]
    const h = args[3]

    const kappa = 0.5522847498
    // control point offset horizontal
    const ox = w / 2 * kappa
    // control point offset vertical
    const oy = h / 2 * kappa
    // x-end
    const xe = x + w
    // y-end
    const ye = y + h
    // x-middle
    const xm = x + w / 2
    // y-middle
    const ym = y + h / 2

    const points = [
      xm, y, xm + ox, y, xe, ym - oy, xe, ym,
      x, ym, x, ym - oy, xm - ox, y, xm, y,
      xm, ye, xm - ox, ye, x, ym + oy, x, ym,
      xe, ym, xe, ym + oy, xm + ox, ye, xm, ye
    ]

    const arcs = this._computeBezier(points)
    this.concat([move(arcs[0].start), down()])
    this.concat(arcs.map(a => arc(a.center, a.stop, a.cw, f)))
    this.concat([up()])
    return this
  }

  g5.prototype.renderArc = function (startAngle, sweepAngle, x, y, radius, b, cw, feedrate) {
    const { feedrate: f } = this.gcode.config
    const a = this._arc(startAngle, sweepAngle - startAngle, x, y, radius, cw, feedrate)
    this.concat([move(a.start), down()])
    this.concat([arc(a.center, a.stop, a.cw, f)])
    this.concat([up()])
    return this
  }

  g5.prototype.renderPoint = function (x, y) {
    const { transformMatrix: matrix } = this.state

    const points = transformPoints([
      vec2.fromValues(x, y)
    ], matrix)

    return this.concat([
      move(points[0]),
      down(),
      dwell(1),
      up()
    ])
  }

  g5.prototype.renderTriangle = function (args) {
    const { transformMatrix: matrix } = this.state
    const { feedrate: f } = this.gcode.config
    const x1 = args[0]
    const y1 = args[1]
    const x2 = args[2]
    const y2 = args[3]
    const x3 = args[4]
    const y3 = args[5]

    const points = transformPoints([
      vec2.fromValues(x1, y1),
      vec2.fromValues(x2, y2),
      vec2.fromValues(x3, y3)
    ], matrix)

    return this.concat([
      move(points[0]),
      down(),
      move(points[1], f),
      move(points[2], f),
      move(points[0], f),
      up()
    ])
  }

  g5.prototype.renderQuad = function (x1, y1, x2, y2, x3, y3, x4, y4) {
    const { feedrate: f } = this.gcode.config
    const { transformMatrix: matrix } = this.state

    const points = transformPoints([
      vec2.fromValues(x1, y1),
      vec2.fromValues(x2, y2),
      vec2.fromValues(x3, y3),
      vec2.fromValues(x4, y4)
    ], matrix)

    return this.concat([
      move(points[0]),
      down(),
      move(points[1], f),
      move(points[2], f),
      move(points[3], f),
      move(points[0], f),
      up()
    ])
  }

  g5.prototype.renderRect = function (args) {
    const { feedrate: f } = this.gcode.config
    const { transformMatrix: matrix } = this.state
    const x = args[0]
    const y = args[1]
    const w = args[2]
    const h = args[3]
    let tl = args[4]
    let tr = args[5]
    let br = args[6]
    let bl = args[7]

    if (typeof tl === 'undefined') {
      // No rounded corners
      const points = transformPoints([
        vec2.fromValues(x, y),
        vec2.fromValues(x + w, y),
        vec2.fromValues(x + w, y + h),
        vec2.fromValues(x, y + h)
      ], matrix)

      this.concat([
        move(points[0]),
        down(),
        move(points[1], f),
        move(points[2], f),
        move(points[3], f),
        move(points[0], f),
        up()
      ])
    } else {
      // At least one rounded corner
      // Set defaults when not specified
      if (typeof tr === 'undefined') {
        tr = tl
      }
      if (typeof br === 'undefined') {
        br = tr
      }
      if (typeof bl === 'undefined') {
        bl = br
      }

      // corner rounding must always be positive
      const absW = Math.abs(w)
      const absH = Math.abs(h)
      const hw = absW / 2
      const hh = absH / 2

      // Clip radii
      if (absW < 2 * tl) {
        tl = hw
      }
      if (absH < 2 * tl) {
        tl = hh
      }
      if (absW < 2 * tr) {
        tr = hw
      }
      if (absH < 2 * tr) {
        tr = hh
      }
      if (absW < 2 * br) {
        br = hw
      }
      if (absH < 2 * br) {
        br = hh
      }
      if (absW < 2 * bl) {
        bl = hw
      }
      if (absH < 2 * bl) {
        bl = hh
      }

      const points = transformPoints([
        vec2.fromValues(x, y + tl), // top left bottom,
        vec2.fromValues(x + tl, y + tl), // top left arc center,
        vec2.fromValues(x + tl, y), // top left top,
        vec2.fromValues(x + w - tr, y), // top right top,
        vec2.fromValues(x + w - tr, y + tr), // top right arc center
        vec2.fromValues(x + w, y + tr), // top right bottom
        vec2.fromValues(x + w, y + h - br), // bottom right top
        vec2.fromValues(x + w - br, y + h - br), // bottom right arc center
        vec2.fromValues(x + w - br, y + h), // bottom right left
        vec2.fromValues(x + bl, y + h), // bottom left bottom
        vec2.fromValues(x + bl, y + h - bl), // bottom left arc center
        vec2.fromValues(x, y + h - bl) // boottom left top
      ], matrix)

      // Draw shape
      this.concat([
        move(points[0]),
        down(),
        arc(this._offset(points[0], points[1]), points[2], 1, f),
        move(points[3], f),
        arc(this._offset(points[3], points[4]), points[5], 1, f),
        move(points[6], f),
        arc(this._offset(points[6], points[7]), points[8], 1, f),
        move(points[9], f),
        arc(this._offset(points[9], points[10]), points[11], 1, f),
        move(points[0], f),
        up()
      ])
    }
  }
}
