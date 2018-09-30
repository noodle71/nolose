const fs = require('fs');
const Logger = require('../lib/SyslogSSL.js');
const log = new Logger({
  'tag': process.env.TAG,
  'key': fs.readFileSync(process.env.PRIVATE_KEY),
  'cert': fs.readFileSync(process.env.PUBLIC_KEY),
  'ca': [fs.readFileSync(process.env.CA_ROOT)]
});

Promise.all([
  log.send('this is a message', Logger.Severity.alert, 'my.app.test'),
  log.log('notice: %d', Date.now()),
  log.info('info'),
  log.warn('warn'),
  log.error('error'),
  log.dir({ a: 1 }),
  log.time('time'),
  log.timeEnd('time'),
])
  .then(() => process.exit(0))
  .catch(() => process.exit(1));