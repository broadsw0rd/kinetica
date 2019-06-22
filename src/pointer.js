var TRACK_THRESHOLD = 100

class Pointer {
  constructor ({ id, Vector }) {
    this.id = id
    this.Vector = Vector
    this.position = new this.Vector(0, 0)
    this.delta = new this.Vector(0, 0)
    this.velocity = new this.Vector(0, 0)
    this.amplitude = new this.Vector(0, 0)
    this.startPosition = new this.Vector(0, 0)
    this.pressed = false
    this.activated = false
    this.swiped = false
    this.timestamp = 0
    this.trackTime = 0
    this.elapsed = 0
  }

  tap (position) {
    this.velocity = new this.Vector(0, 0)
    this.amplitude = new this.Vector(0, 0)
    this.startPosition = position
    this.timestamp = 0
    this.trackTime = 0
    this.elapsed = 0
    this.pressed = true
    this.swiped = false
  }

  drag (position) {
    this.position = position
    this.delta.iadd(this.position.sub(this.startPosition))
    this.startPosition = this.position
    this.activated = true
  }

  launch (velocityThreshold, amplitudeFactor) {
    if (this.velocity.magnitude() > velocityThreshold) {
      this.amplitude = this.velocity.imul(amplitudeFactor)
      this.swiped = true
    }
    this.pressed = false
    this.trackTime = 0
  }

  track (time, movingAvarageFilter) {
    this.timestamp = this.timestamp || time
    this.trackTime = this.trackTime || time
    if (time - this.trackTime >= TRACK_THRESHOLD) {
      this.elapsed = time - this.timestamp
      this.timestamp = time
      this.trackTime = 0

      var v = this.delta.mul(movingAvarageFilter).idiv(1 + this.elapsed)
      this.velocity = v.lerp(this.velocity, 0.2)
    }
  }

  swipe (time, decelerationRate, deltaThreshold) {
    this.elapsed = time - this.timestamp
    this.delta = this.amplitude.mul(Math.exp(-this.elapsed / decelerationRate))
    if (this.delta.magnitude() > deltaThreshold) {
      this.activated = true
    } else {
      this.swiped = false
    }
  }

  deactivate () {
    this.delta.zero()
    this.activated = false
  }
}

export default Pointer
