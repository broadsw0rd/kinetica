(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Kinetic = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var vectory = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.Vector = factory();
})(commonjsGlobal, function () {
  'use strict';

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

  Vector.set = function (x, y, vector) {
    return vector.set(x, y);
  };

  Vector.prototype.set = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
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

  /* istanbul ignore else */
  if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    Vector.prototype[Symbol.toStringTag] = 'Vector';
  }

  Vector.toArray = function (vector) {
    return vector.toArray();
  };

  Vector.prototype.toArray = function () {
    return [this.x, this.y];
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
      get: function () {
        return new Vector(this.x, this.x);
      },
      set: function (vector) {
        this.x = vector.x;
        this.y = vector.x;
      }
    },
    xy: {
      configurable: true,
      get: function () {
        return new Vector(this.x, this.y);
      },
      set: function (vector) {
        this.x = vector.x;
        this.y = vector.y;
      }
    },
    yx: {
      configurable: true,
      get: function () {
        return new Vector(this.y, this.x);
      },
      set: function (vector) {
        this.x = vector.y;
        this.y = vector.x;
      }
    },
    yy: {
      configurable: true,
      get: function () {
        return new Vector(this.y, this.y);
      },
      set: function (vector) {
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
    Vector.prototype[Symbol.iterator] = function iterator() {
      return new VectorIterator(this);
    };
  }

  return Vector;
});
});

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var TRACK_THRESHOLD = 100;

var Pointer = function () {
  function Pointer(_ref) {
    var id = _ref.id;
    classCallCheck(this, Pointer);

    this.id = id;
    this.position = new vectory(0, 0);
    this.delta = new vectory(0, 0);
    this.velocity = new vectory(0, 0);
    this.amplitude = new vectory(0, 0);
    this._startPosition = new vectory(0, 0);
    this._pressed = false;
    this._activated = false;
    this._swiped = false;
    this._timestamp = 0;
    this._trackTime = 0;
    this._elapsed = 0;
  }

  Pointer.prototype.tap = function tap(position) {
    this.velocity = new vectory(0, 0);
    this.amplitude = new vectory(0, 0);
    this._startPosition = position;
    this._timestamp = 0;
    this._trackTime = 0;
    this._elapsed = 0;
    this._pressed = true;
  };

  Pointer.prototype.drag = function drag(position) {
    this.position = position;
    this.delta.iadd(this.position.sub(this._startPosition));
    this._startPosition = this.position;
    this._activated = true;
  };

  Pointer.prototype.launch = function launch(velocityThreshold, amplitudeFactor) {
    if (this.velocity.magnitude() > velocityThreshold) {
      this.amplitude = this.velocity.imul(amplitudeFactor);
      this._swiped = true;
    }
    this._pressed = false;
    this._trackTime = 0;
  };

  Pointer.prototype.track = function track(time, movingAvarageFilter) {
    this._timestamp = this._timestamp || time;
    this._trackTime = this._trackTime || time;
    if (time - this._trackTime >= TRACK_THRESHOLD) {
      this._elapsed = time - this._timestamp;
      this._timestamp = time;
      this._trackTime = 0;

      var v = this.delta.mul(movingAvarageFilter).idiv(1 + this._elapsed);
      this.velocity = v.lerp(this.velocity, 0.2);
    }
  };

  Pointer.prototype.swipe = function swipe(time, decelerationRate, deltaThreshold) {
    this._elapsed = time - this._timestamp;
    this.delta = this.amplitude.mul(Math.exp(-this._elapsed / decelerationRate));
    if (this.delta.magnitude() > deltaThreshold) {
      this._activated = true;
    } else {
      this._swiped = false;
    }
  };

  Pointer.prototype.deactivate = function deactivate() {
    this.delta.zero();
    this._activated = false;
  };

  Pointer.prototype.activated = function activated() {
    return this._activated;
  };

  Pointer.prototype.pressed = function pressed() {
    return this._pressed;
  };

  Pointer.prototype.swiped = function swiped() {
    return this._swiped;
  };

  return Pointer;
}();

// iOS decelerationRate = normal
var DECELERATION_RATE = 325;

function noop() {}

function activated(pointer) {
  return pointer.activated();
}

function alive(pointer) {
  return pointer.activated() || pointer.pressed();
}

function swiped(pointer) {
  return pointer.swiped();
}

var mouseEventId = -1;

var Kinetic = function () {
  Kinetic.spawn = function spawn(kinetic) {
    Kinetic.instances.push(kinetic);
    kinetic.handleEvents();
  };

  Kinetic.kill = function kill(kinetic) {
    var idx = Kinetic.instances.indexOf(kinetic);
    if (idx !== -1) {
      Kinetic.instances.splice(idx, 1);
      kinetic.unhandleEvents();
    }
  };

  Kinetic.notify = function notify(time) {
    for (var i = 0, kinetic; i < Kinetic.instances.length; i++) {
      kinetic = Kinetic.instances[i];
      kinetic.track(time);
      kinetic.notify();
      kinetic.deactivate();
      kinetic.swipe(time);
      kinetic.collect();
      kinetic.check();
    }
  };

  Kinetic.position = function position(e) {
    return new vectory(Kinetic.clientX(e), Kinetic.clientY(e));
  };

  Kinetic.clientX = function clientX(e) {
    return e.clientX;
  };

  Kinetic.clientY = function clientY(e) {
    return e.clientY;
  };

  function Kinetic(_ref) {
    var el = _ref.el;
    var velocityThreshold = _ref.velocityThreshold;
    var amplitudeFactor = _ref.amplitudeFactor;
    var deltaThreshold = _ref.deltaThreshold;
    var movingAvarageFilter = _ref.movingAvarageFilter;
    var ondragstart = _ref.ondragstart;
    var ondragmove = _ref.ondragmove;
    var ondragend = _ref.ondragend;
    var onswipestart = _ref.onswipestart;
    var onswipeend = _ref.onswipeend;
    classCallCheck(this, Kinetic);

    this.el = el;
    this.velocityThreshold = velocityThreshold || Kinetic.VELOCITY_THRESHOLD;
    this.amplitudeFactor = amplitudeFactor || Kinetic.AMPLITUDE_FACTOR;
    this.deltaThreshold = deltaThreshold || Kinetic.DELTA_THRESHOLD;
    this.movingAvarageFilter = movingAvarageFilter || Kinetic.MOVING_AVARAGE_FILTER;

    this.ondragstart = ondragstart || noop;
    this.ondragmove = ondragmove || noop;
    this.ondragend = ondragend || noop;
    this.onswipestart = onswipestart || noop;
    this.onswipeend = onswipeend || noop;

    this.pointers = [];
    this.events = [];

    this._swiped = false;
    this._offset = new vectory(0, 0);
  }

  Kinetic.prototype.subscribe = function subscribe(handler) {
    this.events.push(handler);
  };

  Kinetic.prototype.unsubscribe = function unsubscribe(handler) {
    var idx = this.events.indexOf(handler);
    if (idx !== -1) {
      this.events.splice(idx, 1);
    }
  };

  Kinetic.prototype.track = function track(time) {
    for (var i = 0; i < this.pointers.length; i++) {
      var pointer = this.pointers[i];
      if (pointer.pressed()) {
        pointer.track(time, this.movingAvarageFilter);
      }
    }
  };

  Kinetic.prototype.notify = function notify() {
    for (var i = 0; i < this.events.length; i++) {
      var pointers = this.pointers.filter(activated);
      if (pointers.length) {
        this.events[i](pointers);
      }
    }
  };

  Kinetic.prototype.deactivate = function deactivate() {
    for (var i = 0; i < this.pointers.length; i++) {
      this.pointers[i].deactivate();
    }
  };

  Kinetic.prototype.swipe = function swipe(time) {
    for (var i = 0; i < this.pointers.length; i++) {
      var pointer = this.pointers[i];
      if (pointer.swiped()) {
        pointer.swipe(time, DECELERATION_RATE, this.deltaThreshold);
      }
    }
  };

  Kinetic.prototype.collect = function collect() {
    this.pointers = this.pointers.filter(alive);
  };

  Kinetic.prototype.check = function check() {
    if (!this._swiped) {
      if (this.pointers.filter(swiped).length) {
        this._swiped = true;
        this.onswipestart();
      }
    } else {
      if (!this.pointers.filter(swiped).length) {
        this._swiped = false;
        this.onswipeend();
      }
    }
  };

  Kinetic.prototype.find = function find(id) {
    for (var i = 0; i < this.pointers.length; i++) {
      var pointer = this.pointers[i];
      if (pointer.id === id) {
        return pointer;
      }
    }
    return null;
  };

  Kinetic.prototype.add = function add(pointer) {
    this.pointers.push(pointer);
  };

  Kinetic.prototype.handleEvents = function handleEvents() {
    this.el.addEventListener('mousedown', this);
    this.el.addEventListener('pointerdown', this);
    this.el.addEventListener('touchstart', this);
    this.el.addEventListener('touchmove', this);
    this.el.addEventListener('touchend', this);
  };

  Kinetic.prototype.unhandleEvents = function unhandleEvents() {
    this.el.removeEventListener('mousedown', this);
    this.el.removeEventListener('pointerdown', this);
    this.el.removeEventListener('touchstart', this);
    this.el.removeEventListener('touchmove', this);
    this.el.removeEventListener('touchend', this);
  };

  Kinetic.prototype.handleEvent = function handleEvent(e) {
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
  };

  Kinetic.prototype.getId = function getId(e) {
    if (e.pointerId != null) {
      return e.pointerId;
    } else if (e.identifier) {
      return e.identifier;
    } else {
      return mouseEventId;
    }
  };

  Kinetic.prototype.tap = function tap(e) {
    var clientRect = this.el.getBoundingClientRect();
    this._offset = new vectory(clientRect.left, clientRect.top);

    var id = this.getId(e);
    var pointer = this.find(id);
    if (!pointer) {
      pointer = new Pointer({ id: id });
      this.add(pointer);
    }
    pointer.tap(Kinetic.position(e).isub(this._offset));

    this.ondragstart();
  };

  Kinetic.prototype.drag = function drag(e) {
    var position = Kinetic.position(e).isub(this._offset);
    var id = this.getId(e);
    var pointer = this.find(id);
    pointer.drag(position);

    this.ondragmove();
  };

  Kinetic.prototype.release = function release(e) {
    var id = this.getId(e);
    var pointer = this.find(id);
    pointer.launch(this.velocityThreshold, this.amplitudeFactor);

    this.ondragend();
  };

  Kinetic.prototype._mousedownHandler = function _mousedownHandler(e) {
    document.addEventListener('mousemove', this);
    document.addEventListener('pointermove', this);
    document.addEventListener('mouseup', this);
    document.addEventListener('pointerup', this);

    this.tap(e);
  };

  Kinetic.prototype._mousemoveHandler = function _mousemoveHandler(e) {
    this.drag(e);
  };

  Kinetic.prototype._mouseupHandler = function _mouseupHandler(e) {
    document.removeEventListener('pointermove', this);
    document.removeEventListener('mousemove', this);
    document.removeEventListener('pointerup', this);
    document.removeEventListener('mouseup', this);

    this.release(e);
  };

  Kinetic.prototype._touchstartHandler = function _touchstartHandler(e) {
    for (var i = 0; i < e.changedTouches.length; i++) {
      this.tap(e.changedTouches[i]);
    }
  };

  Kinetic.prototype._touchmoveHandler = function _touchmoveHandler(e) {
    for (var i = 0; i < e.targetTouches.length; i++) {
      this.drag(e.targetTouches[i]);
    }
  };

  Kinetic.prototype._touchendHandler = function _touchendHandler(e) {
    for (var i = 0; i < e.changedTouches.length; i++) {
      this.release(e.changedTouches[i]);
    }
  };

  return Kinetic;
}();

Kinetic.Vector = vectory;

Kinetic.VELOCITY_THRESHOLD = 10;
Kinetic.AMPLITUDE_FACTOR = 0.8;
Kinetic.DELTA_THRESHOLD = 0.5;
Kinetic.MOVING_AVARAGE_FILTER = 200;

Kinetic.instances = [];

return Kinetic;

})));