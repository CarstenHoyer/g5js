// Force page refresh on hot reload
if (module.hot) {
  module.hot.accept(function () {
    window.location.reload()
  })
}

require('./sketch')
require('../../src/core/init')
