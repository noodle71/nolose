const SysLogger = require('./SysLogger.js');
const {breateBufferMsg} = require('./syslogUtils.js');
const tls = require('tls');

class SyslogSSL extends SysLogger {
  constructor(settings) {
    super(settings);
    this.connection = null;
    this.key = settings.key;
    this.cert = settings.cert;
    this.ca = settings.ca;
  }

  close() {
    if (!!this.connection.close) this.connection.close();
    this.connection = null;
  }

  /**
   * Setup SSL connection
   */
  setup() {
    return new Promise((resolve, reject) => {
      // this.connection = tls.connect(this.sslOptions)
      //   .on("error", reject)
      //   .on("close", (error) => {
      //     this.close();
      //     reject(error);
      //   })
      //   .on("connect", resolve);



        this.connection = tls.connect(this.sslOptions, () => {
          console.log('client connected',
                      socket.authorized ? 'authorized' : 'unauthorized');
          process.stdin.pipe(this.connection);
          process.stdin.resume();
          resolve();
        });
        socket.setEncoding('utf8');
        socket.on('data', (data) => {
          console.log(data);
        });
        socket.on('end', () => {
          server.close();
        });
    });
  }

  /**
   * Send message with SSL
   * @param {String} message
   * @param {Severity} severity
   */
  _send(message, severity, tag) {

    return new Promise((resolve, reject) => {
      tag = tag || this.tag;
      severity = severity || this.severity;
      if (this.connection === null) {
        this.setup()
        .then(() => this._send(message, severity, tag))
        .then(resolve);
      }else{
        this.connection.write(
          breateBufferMsg(this.facility, severity, this.hostname, tag, message)
        );
        resolve(); 
      }
    });
  }

  get sslOptions() {
    return {
      port: this.port,
      host: this.syslogHost,
      key: this.key,
      cert: this.cert,
      ca: this.ca
    };
  }
}

module.exports = SyslogSSL;