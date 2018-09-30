const SysLogger = require('./SysLogger.js');
const { breateBufferMsg } = require('./syslogUtils.js');
const tls = require('tls');

class SyslogSSL extends SysLogger {
  constructor(settings) {
    super(settings);
    this.socket = null;
    this.key = settings.key;
    this.cert = settings.cert;
    this.ca = settings.ca;
  }

  close() {
    if (!!this.socket.close) this.socket.close();
    this.socket = null;
  }

  /**
   * Setup SSL socket
   */
  setup() {
    return new Promise((resolve, reject) => {
      this.socket = tls.connect(this.sslOptions);
      this.socket.on('ready', this.connectionOk(resolve));
      this.socket.on('close', this.closedByError('close', reject));
      this.socket.on('end', this.closedByError('end', reject));
      this.socket.on('error', this.closedByError('error', reject));
      this.socket.on('timeout', this.closedByError('timeout', reject));
    });
  }

  connectionOk(cb) {
    return () => {
      console.log(`Socket open`);
      if (!!cb) cb();
    }
  }

  closedByError(reason, cb) {
    return (e) => {
      console.error(`Socket closed -> ${reason}`);
      this.close();
      if (!!cb) cb();
    }
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
      if (this.socket === null) {
        this.setup()
          .then(() => this._send(message, severity, tag))
          .then(resolve);
      } else {
        this.socket.write(
          breateBufferMsg(this.facility, severity, this.hostname, tag, message),
          resolve
        );
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