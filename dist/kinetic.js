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
  this.startPosition = new this.Vector(0, 0);
  this.pressed = false;
  this.activated = false;
  this.swiped = false;
  this.timestamp = 0;
  this.trackTime = 0;
  this.elapsed = 0;
};

Pointer.prototype.tap = function tap (position) {
  this.velocity = new this.Vector(0, 0);
  this.amplitude = new this.Vector(0, 0);
  this.startPosition = position;
  this.timestamp = 0;
  this.trackTime = 0;
  this.elapsed = 0;
  this.pressed = true;
  this.swiped = false;
};

Pointer.prototype.drag = function drag (position) {
  this.position = position;
  this.delta.iadd(this.position.sub(this.startPosition));
  this.startPosition = this.position;
  this.activated = true;
};

Pointer.prototype.launch = function launch (velocityThreshold, amplitudeFactor) {
  if (this.velocity.magnitude() > velocityThreshold) {
    this.amplitude = this.velocity.imul(amplitudeFactor);
    this.swiped = true;
  }
  this.pressed = false;
  this.trackTime = 0;
};

Pointer.prototype.track = function track (time, movingAvarageFilter) {
  this.timestamp = this.timestamp || time;
  this.trackTime = this.trackTime || time;
  if (time - this.trackTime >= TRACK_THRESHOLD) {
    this.elapsed = time - this.timestamp;
    this.timestamp = time;
    this.trackTime = 0;

    var v = this.delta.mul(movingAvarageFilter).idiv(1 + this.elapsed);
    this.velocity = v.lerp(this.velocity, 0.2);
  }
};

Pointer.prototype.swipe = function swipe (time, decelerationRate, deltaThreshold) {
  this.elapsed = time - this.timestamp;
  this.delta = this.amplitude.mul(Math.exp(-this.elapsed / decelerationRate));
  if (this.delta.magnitude() > deltaThreshold) {
    this.activated = true;
  } else {
    this.swiped = false;
  }
};

Pointer.prototype.deactivate = function deactivate () {
  this.delta.zero();
  this.activated = false;
};

// iOS decelerationRate = normal
var DECELERATION_RATE = 325;

function noop () {}

function activated (pointer) {
  return pointer.activated
}

function pressed (pointer) {
  return pointer.pressed
}

function alive (pointer) {
  return pointer.activated || pointer.pressed
}

function swiped (pointer) {
  return pointer.swiped
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
  this.offset = new this.Vector(0, 0);
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
  for (var i = 0; i < this.pointers.length; i++) {
    var pointer = this.pointers[i];
    if (pointer.pressed) {
      pointer.track(time, this.movingAvarageFilter);
    }
  }
};

Kinetic.prototype.notify = function notify () {
  for (var i = 0; i < this.events.length; i++) {
    var pointers = this.pointers.filter(activated);
    if (pointers.length) {
      this.events[i](pointers);
    }
  }
};

Kinetic.prototype.deactivate = function deactivate () {
  for (var i = 0; i < this.pointers.length; i++) {
    this.pointers[i].deactivate();
  }
};

Kinetic.prototype.swipe = function swipe (time) {
  for (var i = 0; i < this.pointers.length; i++) {
    var pointer = this.pointers[i];
    if (pointer.swiped) {
      pointer.swipe(time, DECELERATION_RATE, this.deltaThreshold);
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
  var result = null;
  for (var i = 0; i < this.pointers.length; i++) {
    var pointer = this.pointers[i];
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
  this.el.addEventListener('mousedown', this, true);
  this.el.addEventListener('touchstart', this, true);
  this.el.addEventListener('touchmove', this, true);
  this.el.addEventListener('touchend', this, true);
  this.el.addEventListener('touchcancel', this, true);
};

Kinetic.prototype.unhandleEvents = function unhandleEvents () {
  this.el.removeEventListener('mousedown', this, true);
  this.el.removeEventListener('touchstart', this, true);
  this.el.removeEventListener('touchmove', this, true);
  this.el.removeEventListener('touchend', this, true);
  this.el.removeEventListener('touchcancel', this, true);
};

Kinetic.prototype.handleEvent = function handleEvent (e) {
  e.preventDefault();
  switch (e.type) {
    case 'mousedown': return this.mousedownHandler(e)
    case 'mousemove': return this.mousemoveHandler(e)
    case 'mouseup': return this.mouseupHandler(e)
    case 'touchstart': return this.touchstartHandler(e)
    case 'touchmove': return this.touchmoveHandler(e)
    case 'touchend':
    case 'touchcancel': return this.touchendHandler(e)
  }
};

Kinetic.prototype.getId = function getId (e) {
  if (e.identifier) {
    return e.identifier
  } else {
    return mouseEventId
  }
};

Kinetic.prototype.tap = function tap (e) {
  var clientRect = this.el.getBoundingClientRect();
  this.offset = new this.Vector(clientRect.left, clientRect.top);

  var id = this.getId(e);
  var Vector = this.Vector;
  var pointer = this.find(id);
  if (!pointer) {
    pointer = new Pointer({ id: id, Vector: Vector });
    this.add(pointer);
  }
  pointer.tap(this.position(e).isub(this.offset));

  this.ondragstart();
};

Kinetic.prototype.drag = function drag (e) {
  var position = this.position(e).isub(this.offset);
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

Kinetic.prototype.mousedownHandler = function mousedownHandler (e) {
  document.addEventListener('mousemove', this, true);
  document.addEventListener('mouseup', this, true);

  this.tap(e);
};

Kinetic.prototype.mousemoveHandler = function mousemoveHandler (e) {
  if (e.type === 'mousemove' || this.pointers.filter(pressed).length) {
    this.drag(e);
  }
};

Kinetic.prototype.mouseupHandler = function mouseupHandler (e) {
  document.removeEventListener('mousemove', this, true);
  document.removeEventListener('mouseup', this, true);

  this.release(e);
};

Kinetic.prototype.touchstartHandler = function touchstartHandler (e) {
  for (var i = 0; i < e.changedTouches.length; i++) {
    this.tap(e.changedTouches[i]);
  }
};

Kinetic.prototype.touchmoveHandler = function touchmoveHandler (e) {
  for (var i = 0; i < e.targetTouches.length; i++) {
    this.drag(e.targetTouches[i]);
  }
};

Kinetic.prototype.touchendHandler = function touchendHandler (e) {
  for (var i = 0; i < e.changedTouches.length; i++) {
    this.release(e.changedTouches[i]);
  }
};

Kinetic.VELOCITY_THRESHOLD = 10;
Kinetic.AMPLITUDE_FACTOR = 0.8;
Kinetic.DELTA_THRESHOLD = 0.5;
Kinetic.MOVING_AVARAGE_FILTER = 200;

Kinetic.instances = [];

export default Kinetic;
