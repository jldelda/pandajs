'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _canMessage = require('can-message');

var _weakmapEvent = require('weakmap-event');

var _weakmapEvent2 = _interopRequireDefault(_weakmapEvent);

var _ap = require('ap');

var _performanceNow = require('performance-now');

var _performanceNow2 = _interopRequireDefault(_performanceNow);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _thyming = require('thyming');

var _wait = require('./wait');

var _wait2 = _interopRequireDefault(_wait);

var _pandaUsb = require('./panda-usb');

var _pandaUsb2 = _interopRequireDefault(_pandaUsb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// how many messages to batch at maximum when reading as fast as we can
var MAX_MESSAGE_QUEUE = 5000;

var MessageEvent = (0, _weakmapEvent2.default)();
var ErrorEvent = (0, _weakmapEvent2.default)();
var ConnectEvent = (0, _weakmapEvent2.default)();
var DisconnectEvent = (0, _weakmapEvent2.default)();

var Panda = function () {
  function Panda() {
    (0, _classCallCheck3.default)(this, Panda);

    this.onMessage = (0, _ap.partial)(MessageEvent.listen, this);
    this.onError = (0, _ap.partial)(ErrorEvent.listen, this);
    this.onConnect = (0, _ap.partial)(ConnectEvent.listen, this);
    this.onDisconnect = (0, _ap.partial)(DisconnectEvent.listen, this);

    this.device = (0, _pandaUsb2.default)();
    this.device.onError((0, _ap.partial)(ErrorEvent.broadcast, this));
    this.device.onConnect(this.connectHandler.bind(this));
    this.device.onDisconnect(this.disconnectHandler.bind(this));

    this.paused = true;
    this.messageQueue = [];

    this.readLoop = this.readLoop.bind(this);
    this.flushMessageQueue = this.flushMessageQueue.bind(this);
  }

  // state getters


  (0, _createClass3.default)(Panda, [{
    key: 'isConnected',
    value: function isConnected() {
      return !!this.connected;
    }
  }, {
    key: 'isPaused',
    value: function isPaused() {
      return !!this.paused;
    }

    // methods

  }, {
    key: 'connect',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!this.isConnected()) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt('return', this.connected);

              case 2:
                return _context.abrupt('return', this.device.connect());

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function connect() {
        return _ref.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: 'disconnect',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.isConnected()) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt('return', false);

              case 2:
                return _context2.abrupt('return', this.device.disconnect());

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function disconnect() {
        return _ref2.apply(this, arguments);
      }

      return disconnect;
    }()
  }, {
    key: 'start',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.connect();

              case 2:
                return _context3.abrupt('return', this.unpause());

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function start() {
        return _ref3.apply(this, arguments);
      }

      return start;
    }()
  }, {
    key: 'pause',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
        var wasPaused;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                wasPaused = this.isPaused();

                this.paused = true;

                return _context4.abrupt('return', !wasPaused);

              case 3:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function pause() {
        return _ref4.apply(this, arguments);
      }

      return pause;
    }()
  }, {
    key: 'unpause',
    value: function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
        var wasPaused;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                wasPaused = this.isPaused();

                if (wasPaused) {
                  _context5.next = 3;
                  break;
                }

                return _context5.abrupt('return', false);

              case 3:

                this.paused = false;
                this.startReading();

                return _context5.abrupt('return', wasPaused);

              case 6:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function unpause() {
        return _ref5.apply(this, arguments);
      }

      return unpause;
    }()
  }, {
    key: 'health',
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt('return', this.device.health());

              case 1:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function health() {
        return _ref6.apply(this, arguments);
      }

      return health;
    }()

    // event handlers

  }, {
    key: 'connectHandler',
    value: function connectHandler(usbId) {
      this.connected = usbId;
    }
  }, {
    key: 'disconnectHandler',
    value: function disconnectHandler() {
      this.connected = false;
      this.paused = true;
    }

    // message queueing and flushing

  }, {
    key: 'needsFlushMessageQueue',
    value: function needsFlushMessageQueue() {
      var _this = this;

      this.needsFlush = true;
      if (this.flushEvent) {
        return this.flushEvent;
      }

      var unlisten = (0, _raf2.default)(this.flushMessageQueue);

      this.flushEvent = function () {
        _raf2.default.cancel(unlisten);
        _this.flushEvent = false;
      };

      return this.flushEvent;
    }
  }, {
    key: 'flushMessageQueue',
    value: function flushMessageQueue() {
      this.flushEvent();

      if (this.needsFlush && this.messageQueue.length) {
        var messageQueue = this.messageQueue;
        this.messageQueue = [];
        this.needsFlush = false;
        MessageEvent.broadcast(this, messageQueue);
      }
    }
    // internal reading loop

  }, {
    key: 'startReading',
    value: function startReading() {
      if (this.isReading) {
        return true;
      }
      if (this.isPaused()) {
        return false;
      }

      // start loop!
      this.isReading = true;
      this.readLoop();
    }
  }, {
    key: 'readLoop',
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
        var i, data, receiptTime, canMessages;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!this.isPaused()) {
                  _context7.next = 3;
                  break;
                }

                this.isReading = false;
                return _context7.abrupt('return', false);

              case 3:
                this.isReading = true;

                i = 0;

              case 5:
                if (!(i < MAX_MESSAGE_QUEUE)) {
                  _context7.next = 20;
                  break;
                }

                _context7.next = 8;
                return this.device.nextMessage();

              case 8:
                data = _context7.sent;
                receiptTime = (0, _performanceNow2.default)() / 1000;
                canMessages = (0, _canMessage.unpackCAN)(data);

                if (canMessages.length) {
                  _context7.next = 15;
                  break;
                }

                _context7.next = 14;
                return (0, _wait2.default)(1);

              case 14:
                return _context7.abrupt('continue', 17);

              case 15:
                this.messageQueue.push({
                  time: receiptTime,
                  canMessages: canMessages
                });
                this.needsFlushMessageQueue();

              case 17:
                ++i;
                _context7.next = 5;
                break;

              case 20:
                this.needsFlushMessageQueue();

                // repeat!
                (0, _thyming.timeout)(this.readLoop);

              case 22:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function readLoop() {
        return _ref7.apply(this, arguments);
      }

      return readLoop;
    }()
  }]);
  return Panda;
}();

exports.default = Panda;