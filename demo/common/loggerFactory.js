const fs = require('fs');
const Logger = require('../../lib/SyslogSSL.js');
const global = require('../../package.json').vars;
const files = {
  'key': fs.readFileSync(global.key),
  'cert': fs.readFileSync(global.cert),
  'ca': [fs.readFileSync(global.ca)]
};

// https://stackoverflow.com/questions/10888610/ignore-invalid-self-signed-ssl-certificate-in-node-js-with-https-request
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

module.exports = (settings) => {
  return new Logger(Object.assign({}, global, files, settings));
};