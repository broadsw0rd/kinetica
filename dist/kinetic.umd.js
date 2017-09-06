(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Kinetic = factory());
}(this, (function () { 'use strict';

var TRACK_THRESHOLD = 100;

var Pointer = function Pointer (ref) {
  var id = ref.id;
  var Vector = ref.Vector;

  this.id = id;
  this.Vector = Vector;
  this.position = new this.Vector(0, 0);
  this.delta = new this.Vector(0, 0);
  this.velocity = new this.Vector(0, 0);
  this.amplitude = new this.Vector(0, 0);
  this._startPosition = new this.Vector(0, 0);
  this._pressed = false;
  this._activated = false;
  this._swiped = false;
  this._timestamp = 0;
  this._trackTime = 0;
  this._elapsed = 0;
};

Pointer.prototype.tap = function tap (position) {
  this.velocity = new this.Vector(0, 0);
  this.amplitude = new this.Vector(0, 0);
  this._startPosition = position;
  this._timestamp = 0;
  this._trackTime = 0;
  this._elapsed = 0;
  this._pressed = true;
};

Pointer.prototype.drag = function drag (position) {
  this.position = position;
  this.delta.iadd(this.position.sub(this._startPosition));
  this._startPosition = this.position;
  this._activated = true;
};

Pointer.prototype.launch = function launch (velocityThreshold, amplitudeFactor) {
  if (this.velocity.magnitude() > velocityThreshold) {
    this.amplitude = this.velocity.imul(amplitudeFactor);
    this._swiped = true;
  }
  this._pressed = false;
  this._trackTime = 0;
};

Pointer.prototype.track = function track (time, movingAvarageFilter) {
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

Pointer.prototype.swipe = function swipe (time, decelerationRate, deltaThreshold) {
  this._elapsed = time - this._timestamp;
  this.delta = this.amplitude.mul(Math.exp(-this._elapsed / decelerationRate));
  if (this.delta.magnitude() > deltaThreshold) {
    this._activated = true;
  } else {
    this._swiped = false;
  }
};

Pointer.prototype.deactivate = function deactivate () {
  this.delta.zero();
  this._activated = false;
};

Pointer.prototype.activated = function activated () {
  return this._activated
};

Pointer.prototype.pressed = function pressed () {
  return this._pressed
};

Pointer.prototype.swiped = function swiped () {
  return this._swiped
};

// iOS decelerationRate = normal
var DECELERATION_RATE = 325;

function noop () {}

function activated (pointer) {
  return pointer.activated()
}

function pressed (pointer) {
  return pointer.pressed()
}

function alive (pointer) {
  return pointer.activated() || pointer.pressed()
}

function swiped (pointer) {
  return pointer.swiped()
}

var mouseEventId = -1;

var Kinetic = function Kinetic (ref) {
  var el = ref.el;
  var Vector = ref.Vector;
  var velocityThreshold = ref.velocityThreshold;
  var amplitudeFactor = ref.amplitudeFactor;
  var deltaThreshold = ref.deltaThreshold;
  var movingAvarageFilter = ref.movingAvarageFilter;
  var ondragstart = ref.ondragstart;
  var ondragmove = ref.ondragmove;
  var ondragend = ref.ondragend;
  var onswipestart = ref.onswipestart;
  var onswipeend = ref.onswipeend;

  this.el = el;
  this.Vector = Vector;
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
  this._offset = new this.Vector(0, 0);
};

Kinetic.spawn = function spawn (kinetic) {
  Kinetic.instances.push(kinetic);
  kinetic.handleEvents();
};

Kinetic.kill = function kill (kinetic) {
  var idx = Kinetic.instances.indexOf(kinetic);
  if (idx !== -1) {
    Kinetic.instances.splice(idx, 1);
    kinetic.unhandleEvents();
  }
};

Kinetic.notify = function notify (time) {
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

Kinetic.clientX = function clientX (e) {
  return e.clientX
};

Kinetic.clientY = function clientY (e) {
  return e.clientY
};

Kinetic.prototype.position = function position (e) {
  return new this.Vector(Kinetic.clientX(e), Kinetic.clientY(e))
};

Kinetic.prototype.subscribe = function subscribe (handler) {
  this.events.push(handler);
};

Kinetic.prototype.unsubscribe = function unsubscribe (handler) {
  var idx = this.events.indexOf(handler);
  if (idx !== -1) {
    this.events.splice(idx, 1);
  }
};

Kinetic.prototype.track = function track (time) {
    var this$1 = this;

  for (var i = 0; i < this.pointers.length; i++) {
    var pointer = this$1.pointers[i];
    if (pointer.pressed()) {
      pointer.track(time, this$1.movingAvarageFilter);
    }
  }
};

Kinetic.prototype.notify = function notify () {
    var this$1 = this;

  for (var i = 0; i < this.events.length; i++) {
    var pointers = this$1.pointers.filter(activated);
    if (pointers.length) {
      this$1.events[i](pointers);
    }
  }
};

Kinetic.prototype.deactivate = function deactivate () {
    var this$1 = this;

  for (var i = 0; i < this.pointers.length; i++) {
    this$1.pointers[i].deactivate();
  }
};

Kinetic.prototype.swipe = function swipe (time) {
    var this$1 = this;

  for (var i = 0; i < this.pointers.length; i++) {
    var pointer = this$1.pointers[i];
    if (pointer.swiped()) {
      pointer.swipe(time, DECELERATION_RATE, this$1.deltaThreshold);
    }
  }
};

Kinetic.prototype.collect = function collect () {
  this.pointers = this.pointers.filter(alive);
};

Kinetic.prototype.check = function check () {
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

Kinetic.prototype.find = function find (id) {
    var this$1 = this;

  var result = null;
  for (var i = 0; i < this.pointers.length; i++) {
    var pointer = this$1.pointers[i];
    if (pointer.id === id) {
      result = pointer;
    }
  }
  if (!result) {
    if (this.pointers.length === 1 && this.pointers[0].swiped()) {
      result = this.pointers[0];
      result.id = id;
    }
  }
  return result
};

Kinetic.prototype.add = function add (pointer) {
  this.pointers.push(pointer);
};

Kinetic.prototype.handleEvents = function handleEvents () {
  if (window.PointerEvent) {
    this.el.addEventListener('pointerdown', this, true);
    this.el.addEventListener('pointermove', this, true);
    this.el.addEventListener('pointerup', this, true);
    this.el.addEventListener('pointercancel', this, true);
  } else {
    this.el.addEventListener('mousedown', this, true);
    this.el.addEventListener('touchstart', this, true);
    this.el.addEventListener('touchmove', this, true);
    this.el.addEventListener('touchend', this, true);
    this.el.addEventListener('touchcancel', this, true);
  }
};

Kinetic.prototype.unhandleEvents = function unhandleEvents () {
  if (window.PointerEvent) {
    this.el.removeEventListener('pointerdown', this, true);
    this.el.removeEventListener('pointermove', this, true);
    this.el.removeEventListener('pointerup', this, true);
    this.el.removeEventListener('pointercancel', this, true);
  } else {
    this.el.removeEventListener('mousedown', this, true);
    this.el.removeEventListener('touchstart', this, true);
    this.el.removeEventListener('touchmove', this, true);
    this.el.removeEventListener('touchend', this, true);
    this.el.removeEventListener('touchcancel', this, true);
  }
};

Kinetic.prototype.handleEvent = function handleEvent (e) {
  e.preventDefault();
  switch (e.type) {
    case 'pointerdown':
    case 'mousedown': {
      this._mousedownHandler(e);
      break
    }
    case 'mousemove':
    case 'pointermove': {
      this._mousemoveHandler(e);
      break
    }
    case 'mouseup':
    case 'pointerup':
    case 'pointercancel': {
      this._mouseupHandler(e);
      break
    }
    case 'touchstart': {
      this._touchstartHandler(e);
      break
    }
    case 'touchmove': {
      this._touchmoveHandler(e);
      break
    }
    case 'touchend':
    case 'touchcancel': {
      this._touchendHandler(e);
      break
    }
  }
};

Kinetic.prototype.getId = function getId (e) {
  if (e.pointerId != null) {
    return e.pointerId
  } else if (e.identifier) {
    return e.identifier
  } else {
    return mouseEventId
  }
};

Kinetic.prototype.tap = function tap (e) {
  var clientRect = this.el.getBoundingClientRect();
  this._offset = new this.Vector(clientRect.left, clientRect.top);

  var id = this.getId(e);
  var Vector = this.Vector;
  var pointer = this.find(id);
  if (!pointer) {
    pointer = new Pointer({ id: id, Vector: Vector });
    this.add(pointer);
  }
  pointer.tap(this.position(e).isub(this._offset));

  this.ondragstart();
};

Kinetic.prototype.drag = function drag (e) {
  var position = this.position(e).isub(this._offset);
  var id = this.getId(e);
  var pointer = this.find(id);
  pointer.drag(position);

  this.ondragmove();
};

Kinetic.prototype.release = function release (e) {
  var id = this.getId(e);
  var pointer = this.find(id);
  pointer.launch(this.velocityThreshold, this.amplitudeFactor);

  this.ondragend();
};

Kinetic.prototype._mousedownHandler = function _mousedownHandler (e) {
  if (window.PointerEvent) {
    e.target.setPointerCapture(e.pointerId);
  } else {
    document.addEventListener('mousemove', this, true);
    document.addEventListener('mouseup', this, true);
  }

  this.tap(e);
};

Kinetic.prototype._mousemoveHandler = function _mousemoveHandler (e) {
  if (e.type === 'mousemove' || this.pointers.filter(pressed).length) {
    this.drag(e);
  }
};

Kinetic.prototype._mouseupHandler = function _mouseupHandler (e) {
  if (window.PointerEvent) {
    e.target.releasePointerCapture(e.pointerId);
  } else {
    document.removeEventListener('mousemove', this, true);
    document.removeEventListener('mouseup', this, true);
  }

  this.release(e);
};

Kinetic.prototype._touchstartHandler = function _touchstartHandler (e) {
    var this$1 = this;

  for (var i = 0; i < e.changedTouches.length; i++) {
    this$1.tap(e.changedTouches[i]);
  }
};

Kinetic.prototype._touchmoveHandler = function _touchmoveHandler (e) {
    var this$1 = this;

  for (var i = 0; i < e.targetTouches.length; i++) {
    this$1.drag(e.targetTouches[i]);
  }
};

Kinetic.prototype._touchendHandler = function _touchendHandler (e) {
    var this$1 = this;

  for (var i = 0; i < e.changedTouches.length; i++) {
    this$1.release(e.changedTouches[i]);
  }
};

Kinetic.VELOCITY_THRESHOLD = 10;
Kinetic.AMPLITUDE_FACTOR = 0.8;
Kinetic.DELTA_THRESHOLD = 0.5;
Kinetic.MOVING_AVARAGE_FILTER = 200;

Kinetic.instances = [];

return Kinetic;

})));
