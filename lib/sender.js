const fs = require('fs');
var Logger = require('./SyslogSSL.js');
var log = new Logger({
  'tag': 'my.app.test',
  'key': fs.readFileSync('ltcerts/afernandez.key'),
  'cert': fs.readFileSync('ltcerts/afernandez.crt'),
  'ca': [fs.readFileSync('ltcerts/chain.crt')]
});


log.on("error", function(err) {
  console.log("Received Error : " + err);
});
log.send('this is a message', 'info', 'my.app.test'); // Custom app tag
log.log('notice: %d', Date.now());
log.info('info');
log.warn('warn');
log.error('error');
log.dir({a:1});
log.time('time');
log.timeEnd('time');
