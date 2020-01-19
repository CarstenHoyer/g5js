const { move, down, up, arc, dwell } = require("./gcode/commands");
const constants = require("./constants");
const vec2 = require("gl-matrix/vec2");

const isEpsilon = val => Math.abs(val) <= 1e-6;

const transformPoints = function(points, matrix) {
  return points
    .map(point => {
      let conv = [];
      vec2.transformMat3(conv, point, matrix);
      return conv;
    })
    .map(point => [
      isEpsilon(point[0]) ? 0 : point[0],
      isEpsilon(point[1]) ? 0 : point[1]
    ]);
};

module.exports = function(g5, p5) {
  g5.prototype._pointsAreEqual = (p1, p2) => p1[0] === p2[0] && p1[1] === p2[1];

  g5.prototype._up = function(pos) {
    if (this.gcode.drawing) {
      this.concat([up(this.gcode.config.up)]);
      this.gcode.pos = { x: pos[0], y: pos[1] };
      this.gcode.drawing = false;
    }
  };

  g5.prototype._moveAndDraw = function(point) {
    const [x, y] = point;
    const { x: posX, y: posY } = this.gcode.pos;
    if (x !== posX || y !== posY) {
      this.concat([move(point)]);
    }
    if (!this.gcode.drawing) {
      this.concat([down(this.gcode.config.down)]);
      this.gcode.drawing = true;
    }
  };

  g5.prototype._rotatePoint = function(angle, start, center) {
    return {
      x:
        Math.cos(angle) * (start.x - center.x) -
        Math.sin(angle) * (start.y - center.y) +
        center.x,
      y:
        Math.sin(angle) * (start.x - center.x) +
        Math.cos(angle) * (start.y - center.y) +
        center.y
    };
  };

  g5.prototype._computeBezier = function(points) {
    const {
      compute,
      __retain,
      __allocArray,
      __getArrayView,
      FLOAT64ARRAY_ID
    } = this.mod;
    const id = __retain(__allocArray(FLOAT64ARRAY_ID, points));
    const arcPoints = __getArrayView(compute(id, 5, 0.4));
    const arcs = [];
    for (let i = 0; i < arcPoints.length; i += 6) {
      arcs.push(
        this._arc(
          arcPoints[i], // StartAngle
          arcPoints[i + 1], // SweepAngle
          arcPoints[i + 2], // center x
          arcPoints[i + 3], // center y
          arcPoints[i + 4], // radius
          arcPoints[i + 4], // radius
          arcPoints[i + 5] // clockwise
        )
      );
    }

    return arcs.reverse();
  };

  g5.prototype._centerX = function(x1, y1, x2, y2, radius) {
    const radsq = radius * radius;
    const q = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    const x3 = (x1 + x2) / 2;
    return x3 + Math.sqrt(radsq - (q / 2) * (q / 2)) * ((y1 - y2) / q);
  };

  g5.prototype._centerY = function(x1, y1, x2, y2, radius) {
    const radsq = radius * radius;
    const q = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    const y3 = (y1 + y2) / 2;
    return y3 + Math.sqrt(radsq - (q / 2) * (q / 2)) * ((x2 - x1) / q);
  };

  g5.prototype._arcCenter = function(x1, y1, x2, y2, radius) {
    return vec2.fromValues(
      this._centerX(x1, y1, x2, y2, radius),
      this._centerY(x1, y1, x2, y2, radius)
    );
  };

  g5.prototype._arc = function(startAngle, sweepAngle, x, y, rw, rh, cw) {
    const { transformMatrix: matrix } = this.gcode.state;
    const start = { x: x + rw, y };
    const sp = this._rotatePoint(
      cw ? startAngle : startAngle + sweepAngle,
      start,
      { x, y }
    );
    const ep = this._rotatePoint(
      cw ? startAngle + sweepAngle : startAngle,
      start,
      { x, y }
    );

    const points = transformPoints(
      [
        cw ? vec2.fromValues(sp.x, sp.y) : vec2.fromValues(ep.x, ep.y),
        cw ? vec2.fromValues(ep.x, ep.y) : vec2.fromValues(sp.x, sp.y)
      ],
      matrix
    );

    const cp = cw
      ? this._arcCenter(...points[0], ...points[1], rw * matrix[0])
      : this._arcCenter(...points[1], ...points[0], rw * matrix[0]);
    const center = vec2.fromValues(cp[0] - points[0][0], cp[1] - points[0][1]);

    return { start: points[0], center, stop: points[1], cp, cw };
  };

  g5.prototype.renderLine = function(x1, y1, x2, y2) {
    const { feedrate: f } = this.gcode.config;
    const { transformMatrix: matrix } = this.gcode.state;

    const points = transformPoints(
      [vec2.fromValues(x1, y1), vec2.fromValues(x2, y2)],
      matrix
    );

    this._moveAndDraw(points[0]);
    this.concat([move(points[1], f)]);
    this._up(points[1]);
  };

  g5.prototype.renderBezier = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    if (x1 === x2 && y1 === y2 && x3 === x4 && y3 === y4) {
      return this.renderLine(x1, y1, x4, y4);
    }
    const { feedrate: f } = this.gcode.config;
    const arcs = this._computeBezier([x1, y1, x2, y2, x3, y3, x4, y4]);
    this._moveAndDraw(arcs[0].start);
    this.concat(arcs.map(a => arc(a.center, a.stop, a.cw, f)));
    this._up(arcs[arcs.length - 1].stop);
  };

  g5.prototype.renderEllipse = function(args) {
    const { feedrate: f } = this.gcode.config;

    const x = args[0];
    const y = args[1];
    const w = args[2];
    const h = args[3];

    const kappa = 0.5522847498;
    // control point offset horizontal
    const ox = (w / 2) * kappa;
    // control point offset vertical
    const oy = (h / 2) * kappa;
    // x-end
    const xe = x + w;
    // y-end
    const ye = y + h;
    // x-middle
    const xm = x + w / 2;
    // y-middle
    const ym = y + h / 2;

    const points = [
      xm,
      y,
      xm + ox,
      y,
      xe,
      ym - oy,
      xe,
      ym,
      x,
      ym,
      x,
      ym - oy,
      xm - ox,
      y,
      xm,
      y,
      xm,
      ye,
      xm - ox,
      ye,
      x,
      ym + oy,
      x,
      ym,
      xe,
      ym,
      xe,
      ym + oy,
      xm + ox,
      ye,
      xm,
      ye
    ];

    const arcs = this._computeBezier(points);
    this._moveAndDraw(arcs[0].start);
    this.concat(arcs.map(a => arc(a.center, a.stop, a.cw, f)));
    this._up(arcs[arcs.length - 1].stop);
  };

  g5.prototype.renderArc = function(
    x,
    y,
    w,
    h,
    start,
    stop,
    mode,
    partial = false
  ) {
    const { feedrate: f } = this.gcode.config;

    var rx = w / 2.0;
    var ry = h / 2.0;
    var epsilon = 0.00001; // Smallest visible angle on displays up to 4K.
    var arcToDraw = 0;
    var curves = [];

    let nx = x + rx;
    let ny = y + ry;

    // Create curves
    while (stop - start >= epsilon) {
      arcToDraw = Math.min(stop - start, constants.HALF_PI);
      curves.push(
        p5.Renderer2D.prototype["_acuteArcToBezier"].call(
          this,
          start,
          arcToDraw
        )
      );
      start += arcToDraw;
    }

    curves = curves.reverse().reduce((acc, curve) => {
      acc.push(vec2.fromValues(nx + curve.ax * rx, ny + curve.ay * ry));
      acc.push(vec2.fromValues(nx + curve.bx * rx, ny + curve.by * ry));
      acc.push(vec2.fromValues(nx + curve.cx * rx, ny + curve.cy * ry));
      acc.push(vec2.fromValues(nx + curve.dx * rx, ny + curve.dy * ry));
      return acc;
    }, []);

    const arcs = this._computeBezier(
      curves.reduce((acc, p) => {
        acc.push(p[0], p[1]);
        return acc;
      }, [])
    );

    if (!partial) {
      this._moveAndDraw(arcs[0].start);
    }
    this.concat(arcs.map(a => arc(a.center, a.stop, a.cw, f)));

    const { transformMatrix: matrix } = this.gcode.state;

    const modePoints = transformPoints([[nx, ny], curves[0]], matrix);

    if (mode === constants.PIE) {
      this.concat([move(modePoints[0], f), move(modePoints[1], f)]);
      !partial && this._up(modePoints[1]);
    } else if (mode === constants.CHORD) {
      this.concat([move(modePoints[1], f)]);
      !partial && this._up(modePoints[1]);
    } else {
      !partial && this._up(arcs[arcs.length - 1].stop);
    }
  };

  g5.prototype.renderPoint = function(x, y) {
    const { transformMatrix: matrix } = this.gcode.state;

    const points = transformPoints([vec2.fromValues(x, y)], matrix);

    return this.concat([
      move(points[0]),
      down(this.gcode.config.down),
      dwell(this.gcode.config.dwell),
      up(this.gcode.config.up)
    ]);
  };

  g5.prototype.renderTriangle = function(args) {
    const { transformMatrix: matrix } = this.gcode.state;
    const { feedrate: f } = this.gcode.config;
    const x1 = args[0];
    const y1 = args[1];
    const x2 = args[2];
    const y2 = args[3];
    const x3 = args[4];
    const y3 = args[5];

    const points = transformPoints(
      [
        vec2.fromValues(x1, y1),
        vec2.fromValues(x2, y2),
        vec2.fromValues(x3, y3)
      ],
      matrix
    );

    this._moveAndDraw(points[0]);
    this.concat([move(points[1], f), move(points[2], f), move(points[0], f)]);
    this._up(points[0]);
  };

  g5.prototype.renderQuad = function(x1, y1, x2, y2, x3, y3, x4, y4) {
    const { feedrate: f } = this.gcode.config;
    const { transformMatrix: matrix } = this.gcode.state;

    const points = transformPoints(
      [
        vec2.fromValues(x1, y1),
        vec2.fromValues(x2, y2),
        vec2.fromValues(x3, y3),
        vec2.fromValues(x4, y4)
      ],
      matrix
    );

    this._moveAndDraw(points[0]);
    this.concat([
      move(points[1], f),
      move(points[2], f),
      move(points[3], f),
      move(points[0], f)
    ]);
    this._up(points[0]);
  };

  g5.prototype.renderRect = function(args) {
    const { feedrate: f } = this.gcode.config;
    const { transformMatrix: matrix } = this.gcode.state;
    const x = args[0];
    const y = args[1];
    const w = args[2];
    const h = args[3];
    let tl = args[4];
    let tr = args[5];
    let br = args[6];
    let bl = args[7];

    if (typeof tl === "undefined") {
      // No rounded corners
      const points = transformPoints(
        [
          vec2.fromValues(x, y),
          vec2.fromValues(x + w, y),
          vec2.fromValues(x + w, y + h),
          vec2.fromValues(x, y + h)
        ],
        matrix
      );

      this._moveAndDraw(points[0]);
      this.concat([
        move(points[1], f),
        move(points[2], f),
        move(points[3], f),
        move(points[0], f)
      ]);
      this._up(points[0]);
    } else {
      // At least one rounded corner
      // Set defaults when not specified
      if (typeof tr === "undefined") {
        tr = tl;
      }
      if (typeof br === "undefined") {
        br = tr;
      }
      if (typeof bl === "undefined") {
        bl = br;
      }

      // corner rounding must always be positive
      const absW = Math.abs(w);
      const absH = Math.abs(h);
      const hw = absW / 2;
      const hh = absH / 2;

      // Clip radii
      if (absW < 2 * tl) {
        tl = hw;
      }
      if (absH < 2 * tl) {
        tl = hh;
      }
      if (absW < 2 * tr) {
        tr = hw;
      }
      if (absH < 2 * tr) {
        tr = hh;
      }
      if (absW < 2 * br) {
        br = hw;
      }
      if (absH < 2 * br) {
        br = hh;
      }
      if (absW < 2 * bl) {
        bl = hw;
      }
      if (absH < 2 * bl) {
        bl = hh;
      }

      const points = transformPoints(
        [
          vec2.fromValues(x, y + tl), // top left bottom, 0
          vec2.fromValues(x + w - tr, y), // top right top, 3
          vec2.fromValues(x + w, y + h - br), // bottom right top 6
          vec2.fromValues(x + bl, y + h), // bottom left bottom 9
          vec2.fromValues(x, y),
          vec2.fromValues(x + w - tr * 2, y),
          vec2.fromValues(x + w - br * 2, y + h - br * 2),
          vec2.fromValues(x, y + h - bl * 2)
        ],
        matrix
      );

      // Draw shape
      this._moveAndDraw(points[0]);
      if (!this._pointsAreEqual(points[0], points[4])) {
        this.renderArc(
          x,
          y,
          tl * 2,
          tl * 2,
          constants.PI,
          constants.HALF_PI * 3,
          constants.OPEN,
          true
        );
      }
      this.concat([move(points[1], f)]);
      if (!this._pointsAreEqual(points[1], points[5])) {
        this.renderArc(
          x + w - tr * 2,
          y,
          tr * 2,
          tr * 2,
          constants.HALF_PI * 3,
          constants.TWO_PI,
          constants.OPEN,
          true
        );
      }
      this.concat([move(points[2], f)]);
      if (!this._pointsAreEqual(points[2], points[6])) {
        this.renderArc(
          x + w - br * 2,
          y + h - br * 2,
          br * 2,
          br * 2,
          0,
          constants.HALF_PI,
          constants.OPEN,
          true
        );
      }
      this.concat([move(points[3], f)]);
      if (!this._pointsAreEqual(points[3], points[7])) {
        this.renderArc(
          x,
          y + h - bl * 2,
          bl * 2,
          bl * 2,
          constants.HALF_PI,
          constants.PI,
          constants.OPEN,
          true
        );
      }
      this.concat([move(points[0], f)]);
      this._up(points[0]);
    }
  };
};
