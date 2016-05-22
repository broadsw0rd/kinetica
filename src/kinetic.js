import Vector from './vectory.js'
import Pointer from './pointer.js'

var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame

// iOS decelerationRate = normal
var DECELERATION_RATE = 325

var startTime
var currentTime

function activated (pointer) {
  return pointer.activated()
}

function alive (pointer) {
  return pointer.activated() || pointer.pressed()
}

var mouseEventId = -1

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
      kinetic.track(time)
      kinetic.notify()
      kinetic.deactivate()
      kinetic.swipe(time)
      kinetic.collect()
    }
  }

  static position (e) {
    return new Vector(Kinetic.clientX(e), Kinetic.clientY(e))
  }

  static clientX (e) {
    return e.clientX
  }

  static clientY (e) {
    return e.clientY
  }

  constructor ({ el, velocityThreshold, amplitudeFactor, deltaThreshold, movingAvarageFilter }) {
    this.el = el
    this.velocityThreshold = velocityThreshold || Kinetic.VELOCITY_THRESHOLD
    this.amplitudeFactor = amplitudeFactor || Kinetic.AMPLITUDE_FACTOR
    this.deltaThreshold = deltaThreshold || Kinetic.DELTA_THRESHOLD
    this.movingAvarageFilter = movingAvarageFilter || Kinetic.MOVING_AVARAGE_FILTER
    this.pointers = []
    this.events = []
    this._offset = new Vector(0, 0)
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
    for (var i = 0; i < this.pointers.length; i++) {
      var pointer = this.pointers[i]
      if (pointer.pressed()) {
        pointer.track(time, this.movingAvarageFilter)
      }
    }
  }

  notify () {
    for (var i = 0; i < this.events.length; i++) {
      var pointers = this.pointers.filter(activated)
      if (pointers.length) {
        this.events[i](pointers)
      }
    }
  }

  deactivate () {
    for (var i = 0; i < this.pointers.length; i++) {
      this.pointers[i].deactivate()
    }
  }

  swipe (time) {
    for (var i = 0; i < this.pointers.length; i++) {
      var pointer = this.pointers[i]
      if (pointer.swiped()) {
        pointer.swipe(time, DECELERATION_RATE, this.deltaThreshold)
      }
    }
  }

  collect () {
    this.pointers = this.pointers.filter(alive)
  }

  find (id) {
    for (var i = 0; i < this.pointers.length; i++) {
      var pointer = this.pointers[i]
      if (pointer.id === id) {
        return pointer
      }
    }
    return null
  }

  add (pointer) {
    this.pointers.push(pointer)
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

    var id
    if (e.pointerId != null) {
      id = e.pointerId
    } else if (e.id) {
      id = e.id
    } else {
      id = mouseEventId
    }
    var pointer = this.find(id)
    if (!pointer) {
      pointer = new Pointer({ id })
      this.add(pointer)
    }
    pointer.tap(Kinetic.position(e).isub(this._offset))
  }

  drag (e) {
    var position = Kinetic.position(e).isub(this._offset)
    var id
    if (e.pointerId != null) {
      id = e.pointerId
    } else if (e.id) {
      id = e.id
    } else {
      id = mouseEventId
    }
    var pointer = this.find(id)
    pointer.drag(position)
  }

  release (e) {
    var id
    if (e.pointerId != null) {
      id = e.pointerId
    } else if (e.id) {
      id = e.id
    } else {
      id = mouseEventId
    }
    var pointer = this.find(id)
    pointer.launch(this.velocityThreshold, this.amplitudeFactor)
  }

  _mousedownHandler (e) {
    document.addEventListener('mousemove', this)
    document.addEventListener('pointermove', this)
    document.addEventListener('mouseup', this)
    document.addEventListener('pointerup', this)

    this.tap(e)
  }

  _mousemoveHandler (e) {
    this.drag(e)
  }

  _mouseupHandler (e) {
    document.removeEventListener('pointermove', this)
    document.removeEventListener('mousemove', this)
    document.removeEventListener('pointerup', this)
    document.removeEventListener('mouseup', this)

    this.release(e)
  }

  _touchstartHandler (e) {
    for (var i = 0; i < e.changedTouches.length; i++) {
      this.tap(e.changedTouches[i])
    }
  }

  _touchmoveHandler (e) {
    for (var i = 0; i < e.targetTouches.length; i++) {
      this.drag(e.targetTouches[i])
    }
  }

  _touchendHandler (e) {
    for (var i = 0; i < e.changedTouches.length; i++) {
      this.release(e.changedTouches[i])
    }
  }
}

Kinetic.Vector = Vector

Kinetic.VELOCITY_THRESHOLD = 10
Kinetic.AMPLITUDE_FACTOR = 0.8
Kinetic.DELTA_THRESHOLD = 0.5
Kinetic.MOVING_AVARAGE_FILTER = 200

Kinetic.instances = []

export default Kinetic
