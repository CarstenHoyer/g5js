/* global CORNER, CENTER */
import loader from 'assemblyscript/lib/loader'
import * as mat3 from 'gl-matrix/cjs/mat3'
import './constants'

const defaultState = {
  doStroke: true,
  doFill: true,
  rectMode: CORNER,
  ellipseMode: CENTER,
  transformMatrix: mat3.create()
}

global.extend = function (cfg, sketch, p5) {
  class G5 extends p5 {
    constructor (config, ...props) {
      super(...props)

      const cfg = config || {}
      this.gcode = {
        states: [],
        state: {
          ...defaultState
        },
        commands: [],
        config: {
          feedrate: cfg.feedrate || 300,
          dwell: cfg.dwell || 1
        },
        copy: () => {
          const el = document.createElement('textarea')
          el.style.cssText = 'position: absolute; top: 0; right: 0'
          el.value = this.gcode.commands.join('\n')
          document.body.appendChild(el)
        },
        resetMatrix: () => {
          this.gcode.state.transformMatrix = mat3.create()
        }
      }

      this.p5Draw = this._draw

      this._draw = () => {
        if (!this.mod) {
          this.requestAnimId = window.requestAnimationFrame(this._draw)
          return
        }
        this.p5Draw()
      }
    }

    printGcode () {
      return this.gcode.commands
    }

    callSuper () {
      if (arguments.length === 2) {
        const [method, args] = arguments
        return p5.prototype[method]
          ? p5.prototype[method].call(this, ...args)
          : this
      } else {
        const [method, func, args] = arguments
        return p5.prototype[method]
          ? p5.prototype[method].call(this, func, ...args)
          : this
      }
    }

    setModule () {
      const self = this
      try {
        const imports = {
          env: {
            abort (_msg, _file, line, column) {
              console.error('abort called at main.ts:' + line + ':' + column)
            },
            memory: new window.WebAssembly.Memory({ initial: 1024 })
          },
          console: {
            'console.logs': function (ptr) {
              console.log(self.mod.__getString(ptr))
            },
            'console.log64a': function (ptr) {
              console.log(self.mod.__getArrayView(ptr))
            }
          },
          imports: {}
        }

        if (process.env.JEST_WORKER_ID) {
          const fs = require('fs')
          const bytes = fs.readFileSync('node_modules/beziertobiarc/dist/optimized.wasm')
          self.mod = loader.instantiateBuffer(bytes, imports)
        } else {
          loader.instantiateStreaming(window.fetch('./wasm/optimized.wasm'), imports)
            .then(function (mod) {
              self.mod = mod
            })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

  require('./g5.Renderer2D')(G5)
  require('../math/trigonometry')(G5)
  require('./shape/2d_primitives')(G5)
  require('./shape/attributes')(G5)
  require('./structure')(G5)
  require('./transform')(G5)

  const g5 = new G5(cfg, sketch)
  g5.setModule()
  return g5
}
