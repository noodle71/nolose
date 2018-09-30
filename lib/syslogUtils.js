const util = require('util');
const Buffer = require('buffer').Buffer;

function leadZero(n) {
  return n < 10 ? '0' + n : n.toString();
}

/**
 * Get current date in syslog format. Thanks https://github.com/kordless/lodge
 * @returns {String}
 */
function getDate() {
  const dt = new Date();
  const hours = leadZero(dt.getUTCHours());
  const minutes = leadZero(dt.getUTCMinutes());
  const seconds = leadZero(dt.getUTCSeconds());
  const month = leadZero((dt.getUTCMonth() + 1));
  const day = leadZero(dt.getUTCDate());
  const year = dt.getUTCFullYear();
  return year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
}

/**
 * Just copy from node.js console
 * @param f
 * @returns
 */
function format(f) {
  if (typeof f !== 'string') {
    const objects = [];
    for (let i = 0; i < arguments.length; i++) {
      objects.push(util.inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  let i = 1;
  const args = arguments;
  let str = String(f).replace(/%[sdj]/g, function(x) {
    switch (x) {
      case '%s': return args[i++];
      case '%d': return +args[i++];
      case '%j': return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  for (let len = args.length; i < len; ++i) {
    str += ' ' + args[i];
  }
  return str;
}

function breateBufferMsg(facility, severity, hostname, tag, message){
  let msg = '<' + (facility * 8 + severity) + '>' +
    getDate() + ' ' + hostname + ' ' +
    tag + '[' + process.pid + ']:' + message;

  if (message.charAt(message.length - 1) != '\n') {
    msg += '\n';
  }
  return Buffer.from(msg);
}

module.exports = {
  breateBufferMsg,
  getDate,
  format
};