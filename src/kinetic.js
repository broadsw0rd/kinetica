import Vector from './vectory.js'

var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame

// iOS decelerationRate = normal
var DECELERATION_RATE = 325

var startTime
var currentTime

class Kinetic {

  static digest (time) {
    startTime = startTime || Date.now()
    currentTime = startTime + (time | 0)
    Kinetic.notify(currentTime)
    requestAnimationFrame(Kinetic.digest)
  }

  static spawn (kinetic) {
    Kinetic.instances.push(kinetic)
    kinetic.handleEvents()
  }

  static kill (kinetic) {
    var idx = Kinetic.instances.indexOf(kinetic)
    if (idx !== -1) {
      Kinetic.instances.splice(idx, 1)
      kinetic.unhandleEvents()
    }
  }

  static notify (time) {
    for (var i = 0, kinetic; i < Kinetic.instances.length; i++) {
      kinetic = Kinetic.instances[i]
      if (kinetic.pressed()) {
        kinetic.track(time)
      }
      if (kinetic.shouldNotify()) {
        kinetic.notify()
      }
      if (kinetic.swiped()) {
        kinetic.swipe(time)
      }
    }
  }

  static position (e) {
    return new Vector(Kinetic.clientX(e), Kinetic.clientY(e))
  }

  static clientX (e) {
    return e.targetTouches ? e.targetTouches[0].clientX : e.clientX
  }

  static clientY (e) {
    return e.targetTouches ? e.targetTouches[0].clientY : e.clientY
  }

  constructor ({ el, velocityThreshold, amplitudeFactor, deltaThreshold, movingAvarageFilter }) {
    this.el = el
    this.velocityThreshold = velocityThreshold || Kinetic.VELOCITY_THRESHOLD
    this.amplitudeFactor = amplitudeFactor || Kinetic.AMPLITUDE_FACTOR
    this.deltaThreshold = deltaThreshold || Kinetic.DELTA_THRESHOLD
    this.movingAvarageFilter = movingAvarageFilter || Kinetic.MOVING_AVARAGE_FILTER
    this.events = []
    this.position = new Vector(0, 0)
    this.delta = new Vector(0, 0)
    this.velocity = new Vector(0, 0)
    this.amplitude = new Vector(0, 0)
    this._offset = new Vector(0, 0)
    this._startPosition = new Vector(0, 0)
    this._pressed = false
    this._shouldNotify = false
    this._swiped = false
    this._framesCount = 0
    this._timestamp = 0
    this._elapsed = 0
    this._pointerId = null
  }

  listen (handler) {
    this.events.push(handler)
  }

  stopListening (handler) {
    var idx = this.events.indexOf(handler)
    if (idx !== -1) {
      this.events.splice(idx, 1)
    }
  }

  track (time) {
    this._timestamp = this._timestamp || time
    if (this._framesCount === 6) {
      this._elapsed = time - this._timestamp
      this._timestamp = time
      this._framesCount = 0

      var v = this.delta.mul(this.movingAvarageFilter).idiv(1 + this._elapsed)
      this.velocity = v.imul(0.8).iadd(this.velocity.imul(0.2))
    } else {
      this._framesCount++
    }
  }

  swipe (time) {
    this._elapsed = time - this._timestamp
    this.delta = this.amplitude.mul(Math.exp(-this._elapsed / DECELERATION_RATE))
    if (this.delta.magnitude() > this.deltaThreshold) {
      this._shouldNotify = true
    } else {
      this._swiped = false
    }
  }

  notify () {
    for (var i = 0; i < this.events.length; i++) {
      this.events[i](this.position, this.delta)
    }
    this.delta.zero()
    this._shouldNotify = false
  }

  shouldNotify () {
    return this._shouldNotify
  }

  pressed () {
    return this._pressed
  }

  swiped () {
    return this._swiped
  }

  handleEvents () {
    this.el.addEventListener('mousedown', this)
    this.el.addEventListener('pointerdown', this)
    this.el.addEventListener('touchstart', this)
    this.el.addEventListener('touchmove', this)
    this.el.addEventListener('touchend', this)
  }

  unhandleEvents () {
    this.el.removeEventListener('mousedown', this)
    this.el.removeEventListener('pointerdown', this)
    this.el.removeEventListener('touchstart', this)
    this.el.removeEventListener('touchmove', this)
    this.el.removeEventListener('touchend', this)
  }

  handleEvent (e) {
    e.preventDefault()
    console.log(e.type, e.touches, e.targetTouches, e.changedTouches)
    switch (e.type) {
      case 'pointerdown':
      case 'mousedown': {
        this._mousedownHandler(e)
        break
      }
      case 'mousemove':
      case 'pointermove': {
        this._mousemoveHandler(e)
        break
      }
      case 'mouseup':
      case 'pointerup': {
        this._mouseupHandler(e)
        break
      }
      case 'touchstart': {
        this._touchstartHandler(e)
        break
      }
      case 'touchmove': {
        this._touchmoveHandler(e)
        break
      }
      case 'touchend': {
        this._touchendHandler(e)
        break
      }
    }
  }

  tap (e) {
    var clientRect = this.el.getBoundingClientRect()
    this._offset = new Vector(clientRect.left, clientRect.top)
    this._startPosition = Kinetic.position(e).isub(this._offset)

    this.velocity = new Vector(0, 0)
    this.amplitude = new Vector(0, 0)
    this._timestamp = 0
    this._framesCount = 0
    this._pressed = true
  }

  drag (e) {
    this.position = Kinetic.position(e).isub(this._offset)
    this.delta.iadd(this.position.sub(this._startPosition))
    this._startPosition = this.position
    this._shouldNotify = true
  }

  release () {
    if (this.velocity.magnitude() > this.velocityThreshold) {
      this.amplitude = this.velocity.imul(this.amplitudeFactor)
      this._swiped = true
    }
    this._framesCount = 0
    this._pressed = false
    this._pointerId = null
  }

  _mousedownHandler (e) {
    if (e.pointerId) {
      if (!this._pointerId) {
        this._pointerId = e.pointerId
      } else if (this._pointerId !== e.pointerId) {
        return
      }
    }
    document.addEventListener('mousemove', this)
    document.addEventListener('pointermove', this)
    document.addEventListener('mouseup', this)
    document.addEventListener('pointerup', this)

    this.tap(e)
  }

  _mousemoveHandler (e) {
    if (e.pointerId && this._pointerId !== e.pointerId) {
      return
    }
    this.drag(e)
  }

  _mouseupHandler (e) {
    if (e.pointerId && this._pointerId && this._pointerId !== e.pointerId) {
      return
    }
    document.removeEventListener('pointermove', this)
    document.removeEventListener('mousemove', this)
    document.removeEventListener('pointerup', this)
    document.removeEventListener('mouseup', this)

    this.release()
  }

  _touchstartHandler (e) {
    if (e.targetTouches && e.targetTouches.length > 1) {
      return
    }
    this.tap(e)
  }

  _touchmoveHandler (e) {
    if (e.targetTouches && e.targetTouches.length > 1) {
      return
    }
    this.drag(e)
  }

  _touchendHandler (e) {
    this.release()
  }
}

Kinetic.Vector = Vector

Kinetic.VELOCITY_THRESHOLD = 10
Kinetic.AMPLITUDE_FACTOR = 0.8
Kinetic.DELTA_THRESHOLD = 0.5
Kinetic.MOVING_AVARAGE_FILTER = 200

Kinetic.instances = []

export default Kinetic
