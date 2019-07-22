/*
  Test all options to send logs to Devo
*/
const Logger = require('../lib/SyslogSSL.js');
const loggerFactory = require('./common/loggerFactory.js');
const log = loggerFactory({
  'tag': process.env.TAG
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