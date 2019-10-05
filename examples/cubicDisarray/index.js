// Force page refresh on hot reload
if (module.hot) {
  module.hot.accept(function () {
    window.location.reload()
  })
}

// const p5 = require('../../node_modules/p5/lib/p5')
// const sketch = require('./sketch')
// const G5 = require('../../src/core/main')(p5)
// new G5({}, sketch)
