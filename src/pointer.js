import Vector from './vector.js'

// -------------------------------------
// Pointer
// -------------------------------------

function Pointer({ id }){
	this.id = id
	this.position = new Vector(0, 0)
    this.delta = new Vector(0, 0)
    this.velocity = new Vector(0, 0)
    this.amplitude = new Vector(0, 0)
    this._startPosition = new Vector(0, 0)
    this._pressed = false
    this._shouldNotify = false
    this._swiped = false
    this._timestamp = 0
    this._trackTime = 0
    this._elapsed = 0
}

Pointer.TRACK_THRESHOLD = 100

Pointer.prototype.shouldNotify = function(){
    return this._shouldNotify
}

Pointer.prototype.pressed = function(){
    return this._pressed
}

Pointer.prototype.swiped = function(){
    return this._swiped
}

Pointer.prototype.tap = function(position){
    this.velocity = new Vector(0, 0)
    this.amplitude = new Vector(0, 0)
	this._startPosition = position
    this._timestamp = 0
    this._trackTime = 0
    this._elapsed = 0
    this._pressed = true
}

Pointer.prototype.drag = function(position){
	this.position = position
    this.delta.iadd(this.position.sub(this._startPosition))
    this._startPosition = this.position
    this._shouldNotify = true
}

Pointer.prototype.release = function(velocityThreshold, amplitudeFactor){
	if(this.velocity.length() > velocityThreshold){
        this.amplitude = this.velocity.imul(amplitudeFactor)
        this._swiped = true
    }
    this._pressed = false
    this._trackTime = 0
}

Pointer.prototype.track = function(time, movingAvarageFilter){
	this._timestamp = this._timestamp || time
	this._trackTime = this._trackTime || time
    if(time - this._trackTime >= Pointer.TRACK_THRESHOLD){
        this._elapsed = time - this._timestamp
        this._timestamp = time
        this._trackTime = 0

        var v = this.delta.mul(movingAvarageFilter).idiv(1 + this._elapsed)
        this.velocity = v.imul(0.8).iadd(this.velocity.imul(0.2))
    }
    else {
    	this._trackTime = time
    }
}

Pointer.prototype.swipe = function(time, decelerationRate, deltaThreshold){
    this._elapsed = time - this._timestamp
    this.delta = this.amplitude.mul(Math.exp(-this._elapsed / decelerationRate))
    if(this.delta.length() > deltaThreshold){
        this._shouldNotify = true
    }
    else {
        this._swiped = false
    }
}