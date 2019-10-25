/* global CORNER, CORNERS, CENTER, RADIUS */
const util = require("util");
const canvas = require("../helpers");

module.exports = function(g5) {
  g5.prototype.concat = function(commands) {
    Array.prototype.push.apply(this.gcode.commands, commands);
    return this;
  };

  g5.prototype.bezier = function(...args) {
    this.callSuper("_validateParameters", "bezier", args);

    if (this.gcode.state.doStroke) {
      this.renderBezier(...args);
    }

    return this.callSuper("bezier", args);
  };

  g5.prototype.arc = function(x, y, w, h, start, stop, mode, detail) {
    const { feedrate: f } = this.gcode.config;
    this.callSuper("_validateParameters", "arc", arguments);

    // if the current stroke and fill settings wouldn't result in something
    // visible, exit immediately
    if (!this.gcode.state.doStroke && !this.gcode.state.doFill) {
      return this;
    }

    start = this._toRadians(start);
    stop = this._toRadians(stop);

    // p5 supports negative width and heights for ellipses
    w = Math.abs(w);
    h = Math.abs(h);

    var vals = canvas.modeAdjust(x, y, w, h, this.gcode.state.ellipseMode);
    var angles = this._normalizeArcAngles(start, stop, vals.w, vals.h, true);

    if (angles.correspondToSamePoint) {
      // If the arc starts and ends at (near enough) the same place, we choose to
      // draw an ellipse instead.  This is preferable to faking an ellipse (by
      // making stop ever-so-slightly less than start + TWO_PI) because the ends
      // join up to each other rather than at a vertex at the centre (leaving
      // an unwanted spike in the stroke/fill).
      this.renderEllipse([vals.x, vals.y, vals.w, vals.h, f]);
    } else {
      this.renderArc(
        vals.x,
        vals.y,
        vals.w,
        vals.h,
        angles.start, // [0, TWO_PI)
        angles.stop, // [start, start + TWO_PI)
        mode,
        f
      );
    }
    return this.callSuper("arc", arguments);
  };

  g5.prototype.ellipse = function(x, y, w, h) {
    this.callSuper("_validateParameters", "ellipse", arguments);
    // if the current stroke and fill settings wouldn't result in something
    // visible, exit immediately
    if (!this.gcode.state.doStroke && !this.gcode.state.doFill) {
      return this;
    }

    // p5 supports negative width and heights for rects
    if (w < 0) {
      w = Math.abs(w);
    }

    if (typeof h === "undefined") {
      // Duplicate 3rd argument if only 3 given.
      h = w;
    } else if (h < 0) {
      h = Math.abs(h);
    }

    const vals = canvas.modeAdjust(x, y, w, h, this.gcode.state.ellipseMode);
    console.log(vals);
    this.renderEllipse([vals.x, vals.y, vals.w, vals.h]);
    return this.callSuper("ellipse", arguments);
  };

  g5.prototype.circle = function() {
    const args = Array.prototype.slice.call(arguments, 0, 2);
    args.push(arguments[2]);
    args.push(arguments[2]);
    return this.ellipse(...args);
  };

  g5.prototype.line = function(...args) {
    this.callSuper("_validateParameters", "line", args);
    if (this.gcode.state.doStroke) {
      this.renderLine(...args);
    }
    return this.callSuper("line", arguments);
  };

  g5.prototype.point = function(...args) {
    this.callSuper("_validateParameters", "point", args);
    if (this.gcode.state.doStroke) {
      this.renderPoint(...args);
    }
    return this.callSuper("point", arguments);
  };

  g5.prototype.quad = function(...args) {
    this.callSuper("_validateParameters", "quad", arguments);
    if (this.gcode.state.doStroke || this.gcode.state.doFill) {
      this.renderQuad(...args);
    }
    return this.callSuper("quad", arguments);
  };

  g5.prototype.rect = function() {
    this.callSuper("_validateParameters", "rect", arguments);
    if (this.gcode.state.doStroke || this.gcode.state.doFill) {
      const vals = canvas.modeAdjust(
        arguments[0],
        arguments[1],
        arguments[2],
        arguments[3],
        this.gcode.state.rectMode
      );
      const args = [vals.x, vals.y, vals.w, vals.h];
      // append the additional arguments (either cornder radii, or
      // segment details) to the argument list
      for (let i = 4; i < arguments.length; i++) {
        args[i] = arguments[i];
      }

      this.renderRect(args);
    }

    return this.callSuper("rect", arguments);
  };

  g5.prototype.square = function(x, y, s, tl, tr, br, bl) {
    return this.rect(x, y, s, s, tl, tr, br, bl);
  };

  g5.prototype.triangle = function(...args) {
    this.callSuper("_validateParameters", "triangle", args);
    if (this.gcode.state.doStroke || this.gcode.state.doFill) {
      this.renderTriangle(args);
    }
    return this.callSuper("triangle", arguments);
  };
};
