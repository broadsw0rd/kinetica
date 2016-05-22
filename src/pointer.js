import Vector from './vectory.js'

var TRACK_THRESHOLD = 100

class Pointer {

  constructor ({ id }) {
    this.id = id
    this.position = new Vector(0, 0)
    this.delta = new Vector(0, 0)
    this.velocity = new Vector(0, 0)
    this.amplitude = new Vector(0, 0)
    this._startPosition = new Vector(0, 0)
    this._pressed = false
    this._activated = false
    this._swiped = false
    this._timestamp = 0
    this._trackTime = 0
    this._elapsed = 0
  }

  tap (position) {
    this.velocity = new Vector(0, 0)
    this.amplitude = new Vector(0, 0)
    this._startPosition = position
    this._timestamp = 0
    this._trackTime = 0
    this._elapsed = 0
    this._pressed = true
  }

  drag (position) {
    this.position = position
    this.delta.iadd(this.position.sub(this._startPosition))
    this._startPosition = this.position
    this._activated = true
  }

  launch (velocityThreshold, amplitudeFactor) {
    if (this.velocity.magnitude() > velocityThreshold) {
      this.amplitude = this.velocity.imul(amplitudeFactor)
      this._swiped = true
    }
    this._pressed = false
    this._trackTime = 0
  }

  track (time, movingAvarageFilter) {
    this._timestamp = this._timestamp || time
    this._trackTime = this._trackTime || time
    if (time - this._trackTime >= TRACK_THRESHOLD) {
      this._elapsed = time - this._timestamp
      this._timestamp = time
      this._trackTime = 0

      var v = this.delta.mul(movingAvarageFilter).idiv(1 + this._elapsed)
      this.velocity = v.lerp(this.velocity, 0.2)
    }
  }

  swipe (time, decelerationRate, deltaThreshold) {
    this._elapsed = time - this._timestamp
    this.delta = this.amplitude.mul(Math.exp(-this._elapsed / decelerationRate))
    if (this.delta.magnitude() > deltaThreshold) {
      this._activated = true
    } else {
      this._swiped = false
    }
  }

  deactivate () {
    this.delta.zero()
    this._activated = false
  }

  activated () {
    return this._activated
  }

  pressed () {
    return this._pressed
  }

  swiped () {
    return this._swiped
  }
}

export default Pointer
