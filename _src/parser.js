const utils = require('./utils')
const symbols = require('./symbols')
const builtin = require('./builtin')

class Parser {
  _setlocalvarscode (obj) {
    const buf = []
    buf.push('this._vars={};')
    for (const p in obj) {
      buf.push('this._vars.', p, " = this['", p, "'];\n")
    }
    return buf.join('')
  }

  splitCmdAndBuiltin (cmd) {
    const res = cmd.split('?')
    if (res[1] === undefined) {
      return {
        cmd: res[0],
        builtin: undefined,
        param: undefined
      }
    }
    return {
      cmd: res[0],
      builtin: res[1].substring(0, res[1].lastIndexOf('(') === -1 ? res[1].length : res[1].lastIndexOf('(')),
      param: res[1].substring(res[1].lastIndexOf('(') + 1, res[1].lastIndexOf(')')) || undefined
    }
  }

  nextToken (template) {
    const found = {}
    for (const symbol of symbols) {
      const n = template.engine.indexOf(symbol.start, template.pos)
      if (n >= 0 && (!found.symbol || n < found.newPos)) {
        const e = template.engine.indexOf(symbol.end, n) + (symbol.end.length - 1)
        if (e >= 0) {
          found.newPos = n
          found.endPos = e
          found.startPos = n + symbol.start.length
          found.symbol = symbol
        }
      }
    }
    return found
  }

  create (template, dir) {
    const parts = []
    parts.push('var p=[];')
    let movePos = true

    while (template.pos >= 0) {
      const token = this.nextToken(template)
      if (!token.symbol) {
        parts.push(utils._o(template.engine.substring(template.pos)))
        break
      }

      parts.push(utils._o(template.engine.substring(template.pos, token.newPos)))
      if (token.symbol.process) {
        const cmd = this.splitCmdAndBuiltin(template.engine.substring(token.startPos, token.endPos))
        if (cmd.builtin !== undefined) {
          builtin[cmd.builtin](cmd)
        }
        movePos = token.symbol.process.call(token, parts, cmd.cmd, template, dir)
      }

      if (movePos === true) {
        template.pos = token.endPos + 1
      }
    }
    parts.push("this._out = unescape(p.join(''));")

    const engine = {
      compiled: parts.join(''),
      template: template.engine
    }
    // console.info(parts.join('\n'))
    return engine
  }

  render (engine, context, dir) {
    const template = {
      engine,
      context: context || {},
      pos: 0
    }

    engine = this.create(template, dir)

    /* const vars = */ this._setlocalvarscode(template.context);
    // console.log(vars)
    (function () {
      eval(engine.compiled)
    }).call(context)
    return template.context._out
  }
}

module.exports = new Parser()
