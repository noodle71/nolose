const util = require('util');

function leadZero(n) {
  return n < 10 ? '0' + n : n.toString();
}

/**
 * Get current date in syslog format. Thanks https://github.com/kordless/lodge
 * @returns {String}
 */
function getDate() {
  var dt = new Date();
  var hours = leadZero(dt.getUTCHours());
  var minutes = leadZero(dt.getUTCMinutes());
  var seconds = leadZero(dt.getUTCSeconds());
  var month = leadZero((dt.getUTCMonth() + 1));
  var day = leadZero(dt.getUTCDate());
  var year = dt.getUTCFullYear();
  return year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
}

/**
 * Just copy from node.js console
 * @param f
 * @returns
 */
function format(f) {
  if (typeof f !== 'string') {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(util.inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var str = String(f).replace(/%[sdj]/g, function(x) {
    switch (x) {
      case '%s': return args[i++];
      case '%d': return +args[i++];
      case '%j': return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  for (var len = args.length; i < len; ++i) {
    str += ' ' + args[i];
  }
  return str;
}

module.exports = {
  getDate,
  format
};