(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Kinetic = factory());
}(this, function () { 'use strict';

  var babelHelpers = {};

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  babelHelpers;

  function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  Vector.displayName = 'Vector';

  Vector.from = function (data) {
    return new Vector(data[0], data[1]);
  };

  Vector.fromAngle = function (angle, magnitude) {
    return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  };

  Vector.parse = function (string) {
    return Vector.from(string.trim().replace(',', ' ').split(/\s+/).map(parseFloat));
  };

  Vector.add = function (one, another) {
    return another.add(one);
  };

  Vector.prototype.add = function (vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  };

  Vector.iadd = function (one, another) {
    return another.iadd(one);
  };

  Vector.prototype.iadd = function (vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  };

  Vector.sub = function (one, another) {
    return another.sub(one);
  };

  Vector.prototype.sub = function (vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  };

  Vector.isub = function (one, another) {
    return another.isub(one);
  };

  Vector.prototype.isub = function (vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  };

  Vector.mul = function (scalar, vector) {
    return vector.mul(scalar);
  };

  Vector.prototype.mul = function (scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  };

  Vector.imul = function (scalar, vector) {
    return vector.imul(scalar);
  };

  Vector.prototype.imul = function (scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  };

  Vector.div = function (scalar, vector) {
    return vector.div(scalar);
  };

  Vector.prototype.div = function (scalar) {
    return new Vector(this.x / scalar, this.y / scalar);
  };

  Vector.idiv = function (scalar, vector) {
    return vector.idiv(scalar);
  };

  Vector.prototype.idiv = function (scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  };

  Vector.lerp = function (one, another, t) {
    return one.lerp(another, t);
  };

  Vector.prototype.lerp = function (vector, t) {
    var x = (1 - t) * this.x + t * vector.x;
    var y = (1 - t) * this.y + t * vector.y;
    return new Vector(x, y);
  };

  Vector.normalized = function (vector) {
    return vector.normalized();
  };

  Vector.prototype.normalized = function () {
    var x = this.x;
    var y = this.y;
    var length = Math.sqrt(x * x + y * y);
    if (length > 0) {
      return new Vector(x / length, y / length);
    } else {
      return new Vector(0, 0);
    }
  };

  Vector.normalize = function (vector) {
    return vector.normalize();
  };

  Vector.prototype.normalize = function () {
    var x = this.x;
    var y = this.y;
    var length = Math.sqrt(x * x + y * y);
    if (length > 0) {
      this.x = x / length;
      this.y = y / length;
    }
    return this;
  };

  Vector.magnitude = function (vector) {
    return vector.magnitude();
  };

  Vector.prototype.magnitude = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  Vector.dot = function (one, another) {
    return another.dot(one);
  };

  Vector.prototype.dot = function (vector) {
    return this.x * vector.x + this.y * vector.y;
  };

  Vector.distance = function (one, another) {
    return another.distance(one);
  };

  Vector.prototype.distance = function (vector) {
    var x = this.x - vector.x;
    var y = this.y - vector.y;
    return Math.sqrt(x * x + y * y);
  };

  Vector.angleOf = function (vector) {
    return vector.angleOf();
  };

  Vector.prototype.angleOf = function () {
    return Math.atan2(this.y, this.x);
  };

  Vector.angleTo = function (one, another) {
    return another.angleTo(one);
  };

  Vector.prototype.angleTo = function (vector) {
    return Math.acos(this.dot(vector) / this.magnitude() * vector.magnitude());
  };

  Vector.reset = function (one, another) {
    return another.reset(one);
  };

  Vector.prototype.reset = function (vector) {
    this.x = vector.x;
    this.y = vector.y;
    return this;
  };

  Vector.zero = function (vector) {
    return vector.zero();
  };

  Vector.prototype.zero = function () {
    this.x = 0;
    this.y = 0;
    return this;
  };

  Vector.copy = function (vector) {
    return vector.copy();
  };

  Vector.prototype.copy = function () {
    return new Vector(this.x, this.y);
  };

  Vector.toJSON = function (vector) {
    return vector.toJSON();
  };

  Vector.prototype.toJSON = function () {
    return [this.x, this.y];
  };

  Vector.toString = function (vector) {
    return vector ? vector.toString() : Function.prototype.toString.call(this);
  };

  Vector.prototype.toString = function () {
    return this.x.toFixed(3) + ' ' + this.y.toFixed(3);
  };

  Vector.equals = function (one, another) {
    return one.equals(another);
  };

  Vector.prototype.equals = function (vector) {
    return this.x === vector.x && this.y === vector.y;
  };

  Vector.compare = function (one, another) {
    return one.compare(another);
  };

  Vector.prototype.compare = function (vector) {
    var thisMagnitude = this.magnitude();
    var vectorMagnitude = vector.magnitude();
    return (thisMagnitude > vectorMagnitude) - (vectorMagnitude > thisMagnitude);
  };

  Object.defineProperties(Vector.prototype, {
    xx: {
      configurable: true,
      get: function get() {
        return new Vector(this.x, this.x);
      },
      set: function set(vector) {
        this.x = vector.x;
        this.y = vector.x;
      }
    },
    xy: {
      configurable: true,
      get: function get() {
        return new Vector(this.x, this.y);
      },
      set: function set(vector) {
        this.x = vector.x;
        this.y = vector.y;
      }
    },
    yx: {
      configurable: true,
      get: function get() {
        return new Vector(this.y, this.x);
      },
      set: function set(vector) {
        this.x = vector.y;
        this.y = vector.x;
      }
    },
    yy: {
      configurable: true,
      get: function get() {
        return new Vector(this.y, this.y);
      },
      set: function set(vector) {
        this.x = vector.y;
        this.y = vector.y;
      }
    }
  });

  function VectorIterator(vector) {
    this.vector = vector;
    this.__idx = 0;
  }

  VectorIterator.prototype.next = function () {
    if (this.__idx === 0) {
      this.__idx++;
      return {
        done: false,
        value: this.vector.x
      };
    } else if (this.__idx === 1) {
      this.__idx++;
      return {
        done: false,
        value: this.vector.y
      };
    } else {
      return {
        done: true,
        value: void 0
      };
    }
  };

  /* istanbul ignore else */
  if (typeof Symbol !== 'undefined' && Symbol.iterator) {
    Object.defineProperty(Vector.prototype, Symbol.iterator, {
      configurable: true,
      value: function iterator() {
        return new VectorIterator(this);
      }
    });
  }

  // iOS decelerationRate = normal
  var DECELERATION_RATE = 325;

  var startTime;
  var currentTime;

  var Kinetic = function () {
      babelHelpers.createClass(Kinetic, null, [{
          key: 'digest',
          value: function digest(time) {
              startTime = startTime || Date.now();
              currentTime = startTime + (time | 0);
              Kinetic.notify(time);
              requestAnimationFrame(Kinetic.digest);
          }
      }, {
          key: 'spawn',
          value: function spawn(kinetic) {
              Kinetic.instances.push(kinetic);
              kinetic.handleEvents();
          }
      }, {
          key: 'kill',
          value: function kill(kinetic) {
              var idx = Kinetic.instances.indexOf(kinetic);
              if (idx != -1) {
                  Kinetic.instances.splice(idx, 1);
                  kinetic.unhandleEvents();
              }
          }
      }, {
          key: 'notify',
          value: function notify(time) {
              for (var i = 0, kinetic; i < Kinetic.instances.length; i++) {
                  kinetic = Kinetic.instances[i];
                  if (kinetic.pressed()) {
                      kinetic.track(time);
                  }
                  if (kinetic.shouldNotify()) {
                      kinetic.notify();
                  }
                  if (kinetic.swiped()) {
                      kinetic.swipe(time);
                  }
              }
          }
      }, {
          key: 'position',
          value: function position(e) {
              return new Vector(Kinetic.clientX(e), Kinetic.clientY(e));
          }
      }, {
          key: 'clientX',
          value: function clientX(e) {
              return e.targetTouches ? e.targetTouches[0].clientX : e.clientX;
          }
      }, {
          key: 'clientY',
          value: function clientY(e) {
              return e.targetTouches ? e.targetTouches[0].clientY : e.clientY;
          }
      }]);

      function Kinetic(_ref) {
          var el = _ref.el;
          var velocityThreshold = _ref.velocityThreshold;
          var amplitudeFactor = _ref.amplitudeFactor;
          var deltaThreshold = _ref.deltaThreshold;
          var movingAvarageFilter = _ref.movingAvarageFilter;
          babelHelpers.classCallCheck(this, Kinetic);

          this.el = el;
          this.velocityThreshold = velocityThreshold || Kinetic.VELOCITY_THRESHOLD;
          this.amplitudeFactor = amplitudeFactor || Kinetic.AMPLITUDE_FACTOR;
          this.deltaThreshold = deltaThreshold || Kinetic.DELTA_THRESHOLD;
          this.movingAvarageFilter = movingAvarageFilter || Kinetic.MOVING_AVARAGE_FILTER;
          this.events = [];
          this.position = new Vector(0, 0);
          this.delta = new Vector(0, 0);
          this.velocity = new Vector(0, 0);
          this.amplitude = new Vector(0, 0);
          this._offset = new Vector(0, 0);
          this._startPosition = new Vector(0, 0);
          this._pressed = false;
          this._shouldNotify = false;
          this._swiped = false;
          this._framesCount = 0;
          this._timestamp = 0;
          this._elapsed = 0;
          this._pointerId = null;
      }

      babelHelpers.createClass(Kinetic, [{
          key: 'listen',
          value: function listen(handler) {
              this.events.push(handler);
          }
      }, {
          key: 'stopListening',
          value: function stopListening(handler) {
              var idx = this.events.indexOf(handler);
              if (idx != -1) {
                  this.events.splice(idx, 1);
              }
          }
      }, {
          key: 'track',
          value: function track(time) {
              this._timestamp = this._timestamp || time;
              if (this._framesCount == 6) {
                  this._elapsed = time - this._timestamp;
                  this._timestamp = time;
                  this._framesCount = 0;

                  var v = this.delta.mul(this.movingAvarageFilter).idiv(1 + this._elapsed);
                  this.velocity = v.imul(0.8).iadd(this.velocity.imul(0.2));
              } else {
                  this._framesCount++;
              }
          }
      }, {
          key: 'swipe',
          value: function swipe(time) {
              this._elapsed = time - this._timestamp;
              this.delta = this.amplitude.mul(Math.exp(-this._elapsed / DECELERATION_RATE));
              if (this.delta.magnitude() > this.deltaThreshold) {
                  this._shouldNotify = true;
              } else {
                  this._swiped = false;
              }
          }
      }, {
          key: 'notify',
          value: function notify() {
              for (var i = 0; i < this.events.length; i++) {
                  this.events[i](this.position, this.delta);
              }
              this.delta.zero();
              this._shouldNotify = false;
          }
      }, {
          key: 'shouldNotify',
          value: function shouldNotify() {
              return this._shouldNotify;
          }
      }, {
          key: 'pressed',
          value: function pressed() {
              return this._pressed;
          }
      }, {
          key: 'swiped',
          value: function swiped() {
              return this._swiped;
          }
      }, {
          key: 'handleEvents',
          value: function handleEvents() {
              this.el.addEventListener('mousedown', this);
              this.el.addEventListener('pointerdown', this);
              this.el.addEventListener('touchstart', this);
              this.el.addEventListener('touchmove', this);
              this.el.addEventListener('touchend', this);
          }
      }, {
          key: 'unhandleEvents',
          value: function unhandleEvents() {
              this.el.removeEventListener('mousedown', this);
              this.el.removeEventListener('pointerdown', this);
              this.el.removeEventListener('touchstart', this);
              this.el.removeEventListener('touchmove', this);
              this.el.removeEventListener('touchend', this);
          }
      }, {
          key: 'handleEvent',
          value: function handleEvent(e) {
              e.preventDefault();
              switch (e.type) {
                  case 'pointerdown':
                  case 'mousedown':
                      {
                          this._mousedownHandler(e);
                          break;
                      }
                  case 'mousemove':
                  case 'pointermove':
                      {
                          this._mousemoveHandler(e);
                          break;
                      }
                  case 'mouseup':
                  case 'pointerup':
                      {
                          this._mouseupHandler(e);
                          break;
                      }
                  case 'touchstart':
                      {
                          this._touchstartHandler(e);
                          break;
                      }
                  case 'touchmove':
                      {
                          this._touchmoveHandler(e);
                          break;
                      }
                  case 'touchend':
                      {
                          this._touchendHandler(e);
                          break;
                      }
              }
          }
      }, {
          key: 'tap',
          value: function tap(e) {
              var clientRect = this.el.getBoundingClientRect();
              this._offset = new Vector(clientRect.left, clientRect.top);
              this._startPosition = Kinetic.position(e).isub(this._offset);

              this.velocity = new Vector(0, 0);
              this.amplitude = new Vector(0, 0);
              this._timestamp = 0;
              this._framesCount = 0;
              this._pressed = true;
          }
      }, {
          key: 'drag',
          value: function drag(e) {
              this.position = Kinetic.position(e).isub(this._offset);
              this.delta.iadd(this.position.sub(this._startPosition));
              this._startPosition = this.position;
              this._shouldNotify = true;
          }
      }, {
          key: 'release',
          value: function release() {
              if (this.velocity.magnitude() > this.velocityThreshold) {
                  this.amplitude = this.velocity.imul(this.amplitudeFactor);
                  this._swiped = true;
              }
              this._framesCount = 0;
              this._pressed = false;
              this._pointerId = null;
          }
      }, {
          key: '_mousedownHandler',
          value: function _mousedownHandler(e) {
              if (e.pointerId) {
                  if (!this._pointerId) {
                      this._pointerId = e.pointerId;
                  } else if (this._pointerId !== e.pointerId) {
                      return;
                  }
              }
              document.addEventListener('mousemove', this);
              document.addEventListener('pointermove', this);
              document.addEventListener('mouseup', this);
              document.addEventListener('pointerup', this);

              this.tap(e);
          }
      }, {
          key: '_mousemoveHandler',
          value: function _mousemoveHandler(e) {
              if (e.pointerId && this._pointerId !== e.pointerId) {
                  return;
              }
              this.drag(e);
          }
      }, {
          key: '_mouseupHandler',
          value: function _mouseupHandler(e) {
              if (e.pointerId && this._pointerId && this._pointerId !== e.pointerId) {
                  return;
              }
              document.removeEventListener('pointermove', this);
              document.removeEventListener('mousemove', this);
              document.removeEventListener('pointerup', this);
              document.removeEventListener('mouseup', this);

              this.release();
          }
      }, {
          key: '_touchstartHandler',
          value: function _touchstartHandler(e) {
              if (e.targetTouches && e.targetTouches.length > 1) {
                  return;
              }
              this.tap(e);
          }
      }, {
          key: '_touchmoveHandler',
          value: function _touchmoveHandler(e) {
              if (e.targetTouches && e.targetTouches.length > 1) {
                  return;
              }
              this.drag(e);
          }
      }, {
          key: '_touchendHandler',
          value: function _touchendHandler(e) {
              this.release();
          }
      }]);
      return Kinetic;
  }();

  Kinetic.Vector = Vector;
  Kinetic.VELOCITY_THRESHOLD = 10;
  Kinetic.AMPLITUDE_FACTOR = 0.8;
  Kinetic.DELTA_THRESHOLD = 0.5;
  Kinetic.MOVING_AVARAGE_FILTER = 200;
  Kinetic.instances = [];

  return Kinetic;

}));