const fs = require('fs');
const Logger = require('../lib/SyslogSSL.js');
const log = new Logger({
  'tag': process.env.TAG,
  'key': fs.readFileSync(process.env.PRIVATE_KEY),
  'cert': fs.readFileSync(process.env.PUBLIC_KEY),
  'ca': [fs.readFileSync(process.env.CA_ROOT)]
});

log.send('this is a message', 'info', 'my.app.test')
.then(() => log.log('notice: %d', Date.now()))
.then(() => log.info('info'))
.then(() => log.warn('warn'))
.then(() => log.error('error'))
.then(() => log.dir({ a: 1 }))
.then(() => log.time('time'))
.then(() => log.timeEnd('time'))
// .then( () => process.exit(0))
;