import Vector from 'vectory'
import Pointer from './pointer.js'

// iOS decelerationRate = normal
var DECELERATION_RATE = 325

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

var mouseEventId = -1

class Kinetic {

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
      kinetic.check()
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

  constructor ({
    el,
    velocityThreshold,
    amplitudeFactor,
    deltaThreshold,
    movingAvarageFilter,
    ondragstart,
    ondragmove,
    ondragend,
    onswipestart,
    onswipeend
  }) {
    this.el = el
    this.velocityThreshold = velocityThreshold || Kinetic.VELOCITY_THRESHOLD
    this.amplitudeFactor = amplitudeFactor || Kinetic.AMPLITUDE_FACTOR
    this.deltaThreshold = deltaThreshold || Kinetic.DELTA_THRESHOLD
    this.movingAvarageFilter = movingAvarageFilter || Kinetic.MOVING_AVARAGE_FILTER

    this.ondragstart = ondragstart || noop
    this.ondragmove = ondragmove || noop
    this.ondragend = ondragend || noop
    this.onswipestart = onswipestart || noop
    this.onswipeend = onswipeend || noop

    this.pointers = []
    this.events = []

    this._swiped = false
    this._offset = new Vector(0, 0)
  }

  subscribe (handler) {
    this.events.push(handler)
  }

  unsubscribe (handler) {
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

  check () {
    if (!this._swiped) {
      if (this.pointers.filter(swiped).length) {
        this._swiped = true
        this.onswipestart()
      }
    } else {
      if (!this.pointers.filter(swiped).length) {
        this._swiped = false
        this.onswipeend()
      }
    }
  }

  find (id) {
    var result = null
    for (var i = 0; i < this.pointers.length; i++) {
      var pointer = this.pointers[i]
      if (pointer.id === id) {
        result = pointer
      }
    }
    if (!result) {
      if (this.pointers.length === 1 && this.pointers[0].swiped()) {
        result = this.pointers[0]
        result.id = id
      }
    }
    return result
  }

  add (pointer) {
    this.pointers.push(pointer)
  }

  handleEvents () {
    if (window.PointerEvent) {
      this.el.addEventListener('pointerdown', this, true)
      this.el.addEventListener('pointermove', this, true)
      this.el.addEventListener('pointerup', this, true)
      this.el.addEventListener('pointercancel', this, true)
    } else {
      this.el.addEventListener('mousedown', this, true)
      this.el.addEventListener('touchstart', this, true)
      this.el.addEventListener('touchmove', this, true)
      this.el.addEventListener('touchend', this, true)
      this.el.addEventListener('touchcancel', this, true)
    }
  }

  unhandleEvents () {
    if (window.PointerEvent) {
      this.el.removeEventListener('pointerdown', this, true)
      this.el.removeEventListener('pointermove', this, true)
      this.el.removeEventListener('pointerup', this, true)
      this.el.removeEventListener('pointercancel', this, true)
    } else {
      this.el.removeEventListener('mousedown', this, true)
      this.el.removeEventListener('touchstart', this, true)
      this.el.removeEventListener('touchmove', this, true)
      this.el.removeEventListener('touchend', this, true)
      this.el.removeEventListener('touchcancel', this, true)
    }
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
      case 'pointerup':
      case 'pointercancel': {
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
      case 'touchend':
      case 'touchcancel': {
        this._touchendHandler(e)
        break
      }
    }
  }

  getId (e) {
    if (e.pointerId != null) {
      return e.pointerId
    } else if (e.identifier) {
      return e.identifier
    } else {
      return mouseEventId
    }
  }

  tap (e) {
    var clientRect = this.el.getBoundingClientRect()
    this._offset = new Vector(clientRect.left, clientRect.top)

    var id = this.getId(e)
    var pointer = this.find(id)
    if (!pointer) {
      pointer = new Pointer({ id })
      this.add(pointer)
    }
    pointer.tap(Kinetic.position(e).isub(this._offset))

    this.ondragstart()
  }

  drag (e) {
    var position = Kinetic.position(e).isub(this._offset)
    var id = this.getId(e)
    var pointer = this.find(id)
    pointer.drag(position)

    this.ondragmove()
  }

  release (e) {
    var id = this.getId(e)
    var pointer = this.find(id)
    pointer.launch(this.velocityThreshold, this.amplitudeFactor)

    this.ondragend()
  }

  _mousedownHandler (e) {
    if (window.PointerEvent) {
      e.target.setPointerCapture(e.pointerId)
    } else {
      document.addEventListener('mousemove', this, true)
      document.addEventListener('mouseup', this, true)
    }

    this.tap(e)
  }

  _mousemoveHandler (e) {
    if (e.type === 'mousemove' || this.pointers.filter(pressed).length) {
      this.drag(e)
    }
  }

  _mouseupHandler (e) {
    if (window.PointerEvent) {
      e.target.releasePointerCapture(e.pointerId)
    } else {
      document.removeEventListener('mousemove', this, true)
      document.removeEventListener('mouseup', this, true)
    }

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
