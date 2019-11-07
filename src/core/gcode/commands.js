const _getPoint = function(point) {
  let x = point[0];
  x = Math.abs(x) < 1e-10 ? 0 : x;
  x = +x.toFixed(3);
  let y = point[1];
  y = Math.abs(y) < 1e-10 ? 0 : y;
  y = +y.toFixed(3);
  return [x, y];
};

const down = function() {
  return "G0 Z0";
};

const up = function() {
  return "G0 Z1";
};

const dwell = function(sec) {
  return `G4 P${sec * 1000}`;
};

const move = function(point, f) {
  const [x, y] = _getPoint(point);
  if (!f) {
    return `G0 X${x} Y${y} ; rapid move`;
  }
  return `G1 X${x} Y${y} F${f} ; move`;
};

const arc = function(center, stop, cw, f) {
  const cmd = !cw ? "G2" : "G3";

  let gcode = `${cmd} X${stop[0]} Y${stop[1]}`;

  if (center[0]) {
    gcode += ` I${center[0]}`;
  }

  if (center[1]) {
    gcode += ` J${center[1]}`;
  }

  if (f) {
    gcode += ` F${f}`;
  }

  return `${gcode} ; ${arguments.callee.name}`;
};

const circle = function(x, y, d) {
  return `G2 X${x} Y${y} I${d}`;
};

module.exports = {
  down,
  up,
  dwell,
  move,
  arc,
  circle
};
