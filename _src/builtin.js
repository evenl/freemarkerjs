module.exports = {
  upper_case (cmd) {
    cmd.cmd += '.toUpperCase()'
  },
  lower_case (cmd) {
    cmd.cmd += '.toLowerCase()'
  },
  capitalize (cmd) {
    cmd.cmd += '.toLowerCase().replace(/\\b./g, (a) => a.toUpperCase())'
  },
  /* 'left_pad' : function(cmd) {
    var str = "var padding = new Array(" + cmd.param + "+ 1).join(\"0\");";
    str = str + "(padding + " + cmd.cmd + ").slice(-padding.length);";
    return cmd.cmd = str;
  } */
  length (cmd) {
    cmd.cmd += '.length'
  }
}
