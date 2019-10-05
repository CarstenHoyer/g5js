const Sketch = (p5) => {
  p5.setup = function () {
    p5.createCanvas(400, 400).parent('frame')
  }

  p5.draw = function () {
    p5.noLoop()
    p5.noFill()
    const squareSize = 30
    const randomDisplacement = 15
    const rotateMultiplier = 20
    const offset = 10

    for (let i = squareSize; i <= p5.width - squareSize; i += squareSize) {
      for (let j = squareSize; j <= p5.height - squareSize; j += squareSize) {
        const {
          rotateAmt,
          translateAmt
        } = getTransformation(j, rotateMultiplier, randomDisplacement)
        drawRect(i, j, squareSize, translateAmt, rotateAmt, offset)
      }
    }
    console.log(p5.printGcode().join('\n'))
  }

  function drawRect (i, j, squareSize, translateAmt, rotateAmt, offset) {
    p5.push()
    p5.translate(i + translateAmt + offset, j + offset)
    p5.rotate(rotateAmt)
    p5.rect(-squareSize / 2, -squareSize / 2, squareSize, squareSize)
    p5.pop()
  }

  function getTransformation (j, rotateMultiplier, randomDisplacement) {
    let plusOrMinus = Math.random() < 0.5 ? -1 : 1
    const rotateAmt = j / p5.height * Math.PI / 180 * plusOrMinus * Math.random() * rotateMultiplier
    plusOrMinus = Math.random() < 0.5 ? -1 : 1
    const translateAmt = j / p5.height * plusOrMinus * Math.random() * randomDisplacement
    return {
      rotateAmt,
      translateAmt
    }
  }
}

module.exports = Sketch
