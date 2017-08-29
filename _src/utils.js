module.exports = {
  _o (cmd) {
    return `p.push("${escape(cmd)}");`
  },

  _p (cmd) {
    return `p.push(${this._v(cmd, true)});`
  },

  _d (cmd) {
    return `console.debug(this, "${escape(cmd)}");`
  },

  _v (name, out) {
    return out ? `utils._fm_out(this.${name})` : `this.${name}`
  },

  _fm_out (val) {
    if (typeof val === 'object') {
      if (typeof val._render === 'function') {
        return val._render()
      } else if (val[0]) {
        return val[0]
      }
    }

    return val
  }
}
