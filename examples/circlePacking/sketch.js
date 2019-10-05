const circles = []
const minRadius = 2
const maxRadius = 100
const totalCircles = 100
const createCircleAttempts = 500

setup = function () {
  createCanvas(600, 600).parent('frame')
  noLoop()
  noFill()
  strokeWeight(1)
  stroke(255, 0, 0)
}

draw = function () {
  // p5.line(0, 200, p5.height, 200)
  // p5.line(200, 0, 200, p5.width)
  // p5.circle(200, 200, 100)
  // p5.circle(100, 100, 100)
  arc(100, 100, 80, 80, 0, PI)
  // p5.gcode.commands.map(m => console.log(m))
  // console.log(JSON.stringify(p5.gcode.commands))
  // for (let i = 0; i < totalCircles; i++) {
  //   createAndDrawCircle()
  // }
  // const p = [75, 100, 75, 72.38576251, 86.192881255, 50, 100, 50, 100, 50, 113.807118745, 50, 125, 72.38576251, 125, 100, 125, 100, 125, 127.61423749, 113.807118745, 150, 100, 150, 100, 150, 86.192881255, 150, 75, 127.61423749, 75, 100]
  // for (let i = 0; i < 8; i += 8) {
  //   p5.bezier(p[i], p[i+1], p[i+2], p[i+3], p[i+4], p[i+5], p[i+6], p[i+7])
  // }
  //p5.circle(100, 100, 100)
  // p5.ellipse(100, 100, 100, 50)
  // const pt0 = [100, 500, 150, 100, 500, 150, 350, 350]
  // const pt1 = [200, 600, 200, 200, 600, 450, 450, 250]
  // const pt2 = [300, 700, 550, 300, 300, 400, 700, 600]
  // const pt3 = [233.89831, 285.0169000000001, 233.89831, 293.0169000000001, 230.5649766666668, 301.0169000000001, 223.89831, 309.0169000000001]
  // const pt4 = [204.89831, 328.0169, 198.89831, 334.0169, 191.2316433333334, 337.0169, 181.89831, 337.0169]
  // const pt5 = [199, 135, 199, 134, 210, 134, 211, 134]
  // const pt6 = [100, 100, 1000, 550, 200, 0, 450, 450]
  // p5.bezier(...pt0)
  // p5.bezier(...pt1)
  // p5.bezier(...pt2)
  // p5.bezier(...pt3)
  // p5.bezier(...pt4)
  // p5.bezier(...pt5)
  // p5.bezier(...pt6)
  // p5.bezier(50, 100, 50, 72.38576251, 72.38576251, 50, 100, 50)
  // p5.bezier(100, 50, 127.61423749, 50, 150, 72.38576251, 150, 100)
  // p5.bezier(150, 100, 150, 127.61423749, 127.61423749, 150, 100, 150)
  // p5.bezier(100, 150, 72.38576251, 150, 50, 127.61423749, 50, 100)
  // p5.circle(210, 509, 4)
  // console.log(p5.gcode.commands.join('\n'))
}

function createAndDrawCircle () {
  let newCircle
  let circleSafeToDraw = false
  for (var tries = 0; tries < createCircleAttempts; tries++) {
    newCircle = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * width),
      radius: minRadius
    }

    if (doesCircleHaveACollision(newCircle)) {
      continue
    } else {
      circleSafeToDraw = true
      break
    }
  }

  if (!circleSafeToDraw) {
    return
  }

  for (var radiusSize = minRadius; radiusSize < maxRadius; radiusSize++) {
    newCircle.radius = radiusSize
    if (doesCircleHaveACollision(newCircle)) {
      newCircle.radius--
      break
    }
  }

  circles.push(newCircle)
  circle(newCircle.x, newCircle.y, newCircle.radius * 2)
}

function doesCircleHaveACollision (circle) {
  for (var i = 0; i < circles.length; i++) {
    var otherCircle = circles[i]
    var a = circle.radius + otherCircle.radius
    var x = circle.x - otherCircle.x
    var y = circle.y - otherCircle.y

    if (a >= Math.sqrt((x * x) + (y * y))) {
      return true
    }
  }

  if (circle.x + circle.radius >= width ||
      circle.x - circle.radius <= 0) {
    return true
  }

  if (circle.y + circle.radius >= height ||
      circle.y - circle.radius <= 0) {
    return true
  }

  return false
}


// const Sketch = (p5) => {
//   p5.setup = function () {
//     p5.createCanvas(600, 600).parent('frame')
//     p5.noLoop()
//     p5.noFill()
//     p5.strokeWeight(1)
//     p5.stroke(255, 0, 0)
//   }

//   p5.draw = function () {
//     // p5.line(0, 200, p5.height, 200)
//     // p5.line(200, 0, 200, p5.width)
//     // p5.circle(200, 200, 100)
//     // p5.circle(100, 100, 100)
//     p5.arc(100, 100, 80, 80, 0, p5.PI)
//     // p5.gcode.commands.map(m => console.log(m))
//     // console.log(JSON.stringify(p5.gcode.commands))
//     // for (let i = 0; i < totalCircles; i++) {
//     //   createAndDrawCircle()
//     // }
//     // const p = [75, 100, 75, 72.38576251, 86.192881255, 50, 100, 50, 100, 50, 113.807118745, 50, 125, 72.38576251, 125, 100, 125, 100, 125, 127.61423749, 113.807118745, 150, 100, 150, 100, 150, 86.192881255, 150, 75, 127.61423749, 75, 100]
//     // for (let i = 0; i < 8; i += 8) {
//     //   p5.bezier(p[i], p[i+1], p[i+2], p[i+3], p[i+4], p[i+5], p[i+6], p[i+7])
//     // }
//     //p5.circle(100, 100, 100)
//     // p5.ellipse(100, 100, 100, 50)
//     // const pt0 = [100, 500, 150, 100, 500, 150, 350, 350]
//     // const pt1 = [200, 600, 200, 200, 600, 450, 450, 250]
//     // const pt2 = [300, 700, 550, 300, 300, 400, 700, 600]
//     // const pt3 = [233.89831, 285.0169000000001, 233.89831, 293.0169000000001, 230.5649766666668, 301.0169000000001, 223.89831, 309.0169000000001]
//     // const pt4 = [204.89831, 328.0169, 198.89831, 334.0169, 191.2316433333334, 337.0169, 181.89831, 337.0169]
//     // const pt5 = [199, 135, 199, 134, 210, 134, 211, 134]
//     // const pt6 = [100, 100, 1000, 550, 200, 0, 450, 450]
//     // p5.bezier(...pt0)
//     // p5.bezier(...pt1)
//     // p5.bezier(...pt2)
//     // p5.bezier(...pt3)
//     // p5.bezier(...pt4)
//     // p5.bezier(...pt5)
//     // p5.bezier(...pt6)
//     // p5.bezier(50, 100, 50, 72.38576251, 72.38576251, 50, 100, 50)
//     // p5.bezier(100, 50, 127.61423749, 50, 150, 72.38576251, 150, 100)
//     // p5.bezier(150, 100, 150, 127.61423749, 127.61423749, 150, 100, 150)
//     // p5.bezier(100, 150, 72.38576251, 150, 50, 127.61423749, 50, 100)
//     // p5.circle(210, 509, 4)
//     console.log(p5.gcode.commands.join('\n'))
//   }

//   function createAndDrawCircle () {
//     let newCircle
//     let circleSafeToDraw = false
//     for (var tries = 0; tries < createCircleAttempts; tries++) {
//       newCircle = {
//         x: Math.floor(Math.random() * p5.width),
//         y: Math.floor(Math.random() * p5.width),
//         radius: minRadius
//       }

//       if (doesCircleHaveACollision(newCircle)) {
//         continue
//       } else {
//         circleSafeToDraw = true
//         break
//       }
//     }

//     if (!circleSafeToDraw) {
//       return
//     }

//     for (var radiusSize = minRadius; radiusSize < maxRadius; radiusSize++) {
//       newCircle.radius = radiusSize
//       if (doesCircleHaveACollision(newCircle)) {
//         newCircle.radius--
//         break
//       }
//     }

//     circles.push(newCircle)
//     p5.circle(newCircle.x, newCircle.y, newCircle.radius * 2)
//   }

//   function doesCircleHaveACollision (circle) {
//     for (var i = 0; i < circles.length; i++) {
//       var otherCircle = circles[i]
//       var a = circle.radius + otherCircle.radius
//       var x = circle.x - otherCircle.x
//       var y = circle.y - otherCircle.y

//       if (a >= Math.sqrt((x * x) + (y * y))) {
//         return true
//       }
//     }

//     if (circle.x + circle.radius >= p5.width ||
//        circle.x - circle.radius <= 0) {
//       return true
//     }

//     if (circle.y + circle.radius >= p5.height ||
//         circle.y - circle.radius <= 0) {
//       return true
//     }

//     return false
//   }
// }

// module.exports = Sketch
