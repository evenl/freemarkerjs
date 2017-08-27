const path = require('path')
const utils = require('./utils')
const fs = require('fs')

function condition (type, parts, cmd, template) {
  if (cmd.indexOf('??') >= 0) {
    let expr = cmd.substring(0, cmd.length - 2)
    expr = utils._v(expr)
    parts.push(`${type} (${expr}) {`)
  } else if (cmd.indexOf('?size') >= 0) {
    const pos = cmd.indexOf('?size')
    const expr = `${utils._v(cmd.substring(0, pos))}.length${cmd.substring(pos + 5)}`
    parts.push(`${type} (${expr}) {`)
  } else {
    parts.push(`${type} (${utils._v(cmd)}) {`)
  }
  return true
}

module.exports = [
  {
    start: '${',
    end: '}',
    process (parts, cmd, template) {
      parts.push(utils._p(cmd))
      return true
    }
  },
  {
    start: '<#if',
    end: '>',
    process (parts, cmd, template) {
      return condition('if', parts, cmd, template)
    }
  },
  {
    start: '</#if',
    end: '>',
    process (parts, cmd, template) {
      parts.push('}')
      return true
    }
  },
  {
    start: '<#elseif',
    end: '>',
    process (parts, cmd, template) {
      return condition('} else if', parts, cmd, template)
    }
  },
  {
    start: '<#else',
    end: '>',
    process (parts, cmd, template) {
      parts.push('} else {')
      return true
    }
  },
  {
    start: '<#list',
    end: '>',
    process (parts, cmd, template) {
      // <#list envelopes as envelope >
      const match = cmd.match(/\s*(\S*)\s*as\s*(\S*)\s*/)
      if (match) {
        parts.push(`for (var ${match[2]}_index in ${utils._v(match[1])})`)
      }
      parts.push('{')
      if (match) {
        parts.push(`${utils._v(match[2])}=${utils._v(match[1])}[${match[2]}_index];`)
      }
      return true
    }
  },
  {
    start: '</#list',
    end: '>',
    process (parts, cmd, template) {
      parts.push('}')
      return true
    }
  },
  {
    start: '<#--',
    end: '-->',
    process (parts, cmd, template) {
      return true
    }
  },
  {
    start: '<#include ',
    end: '>',
    process (parts, cmd, template, dir) {
      const cmdLength = cmd.length + 1
      const symbolLength = this.symbol.start.length + this.symbol.end.length + 1

      cmd = cmd.replace(/\s/g, '')
      cmd = cmd.replace(/"/g, '')
      const include = fs.readFileSync(path.resolve(dir, cmd), 'utf8')
      template.engine = template.engine.slice(0, template.pos) + include + template.engine.slice(template.pos + 1 + symbolLength + cmdLength)
      return false
    }
  }
]
