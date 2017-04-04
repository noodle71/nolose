const SysLogger = require('./SysLogger.js');
const syslogUtils = require('./syslogUtils.js');
const tls = require('tls');
const Buffer = require('buffer').Buffer

class SyslogSSL extends SysLogger {
  constructor(settings) {
    super(settings);
    this.connection = null;
    this.key = settings.key;
    this.cert = settings.cert;
    this.ca = settings.ca;
  }

  /**
   * Setup SSL connection
   */
  setup(done) {
    this.connection = tls.connect(this.port, this.sslOptions)
      .on("error", (exception) => {
        if (!this.quiet) {
          console.log("SSL connect error : " + exception);
        }
        this.emit("error", exception);
      })
      .on("close", (error) => {
        this.connection = null;
      })
      .on("connect", done);
  }

  /**
   * Send message with SSL
   * @param {String} message
   * @param {Severity} severity
   */
  _send(message, severity, tag, done) {
    tag = tag || this.tag;
    severity = severity || this.severity;
    if (this.connection === null) {
      this.setup(() => {
        this._send(message, severity, tag, done);
      });
      return;
    }
    var msg = new Buffer(
      '<' + (this.facility * 8 + severity) + '>' +
      syslogUtils.getDate() + ' ' + this.hostname + ' ' +
      tag + '[' + process.pid + ']:' + message);

    if (message.charAt(message.length - 1) != '\n') {
      msg += '\n';
    }
    this.connection.write(msg);
  }

  get sslOptions() {
    return {
      host: this.syslogHost,
      key: this.key,
      cert: this.cert,
      ca: this.ca
    };
  }
}

module.exports = SyslogSSL;