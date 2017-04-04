const EventEmitter = require('events').EventEmitter;
const os = require("os");
const util = require('util');
const HOST_NAME = os.hostname();
const syslogUtils = require('./syslogUtils.js');
const TAG = 'my.app.nolose';


class SysLogger extends EventEmitter {
  constructor(settings) {
    super();
    this._times = {};
    this.tag = settings.tag || TAG;
    this.facility = settings.facility || SysLogger.Facility.user;
    this.hostname = settings.hostname || HOST_NAME;
    this.syslogHost = settings.syslogHost || "eu.elb.relay.logtrust.net";
    this.port = settings.port || 443;
    this.quiet = settings.quiet || false;
  }

  /**
   * Send formatted message to syslog
   * @param {String} message
   * @param {Number|String} severity
   */
  send(message, severity, tag, done) {
    severity = severity || this.severity;
    tag = tag || this.tag;
    this._send(message, severity, tag, done);
  }

  /**
   * Send log message with notice severity.
   */
  log() {
    this._send(syslogUtils.format.apply(this, arguments), SysLogger.Severity.notice);
  }

  /**
   * Send log message with info severity.
   */
  info() {
    this._send(syslogUtils.format.apply(this, arguments), SysLogger.Severity.info);
  }

  /**
   * Send log message with warn severity.
   */
  warn() {
    this._send(syslogUtils.format.apply(this, arguments), SysLogger.Severity.warn);
  }

  /**
   * Send log message with err severity.
   */
  error() {
    this._send(syslogUtils.format.apply(this, arguments), SysLogger.Severity.err);
  }

  /**
   * Log object with `util.inspect` with notice severity
   */
  dir(object) {
    this._send(util.inspect(object) + '\n', SysLogger.Severity.notice);
  }

  time(label) {
    this._times[label] = Date.now();
  }

  timeEnd(label) {
    var duration = Date.now() - this._times[label];
    this.log('%s: %dms', label, duration);
  }

  //Constants
  static get Facility() {
    return {
      kern: 0,
      user: 1,
      mail: 2,
      daemon: 3,
      auth: 4,
      syslog: 5,
      lpr: 6,
      news: 7,
      uucp: 8,
      local0: 16,
      local1: 17,
      local2: 18,
      local3: 19,
      local4: 20,
      local5: 21,
      local6: 22,
      local7: 23
    };
  }

  static get Severity() {
    return {
      emerg: 0,
      alert: 1,
      crit: 2,
      err: 3,
      warn: 4,
      notice: 5,
      info: 6,
      debug: 7
    };
  }
}

module.exports = SysLogger;