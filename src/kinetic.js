import Vector from './vector.js'

// -------------------------------------
// Kinetic
// -------------------------------------

var DECELERATION_RATE = 325 // iOS decelerationRate = normal

function Kinetic({ el, velocityThreshold, amplitudeFactor, deltaThreshold, movingAvarageFilter }){
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

Kinetic.VELOCITY_THRESHOLD = 10
Kinetic.AMPLITUDE_FACTOR = 0.8
Kinetic.DELTA_THRESHOLD = 0.5
Kinetic.MOVING_AVARAGE_FILTER = 200

Kinetic.instances = []

var currentTime
var startTime

Kinetic.digest = function(time){
    startTime = startTime || Date.now()
    currentTime = startTime + (time | 0)
    Kinetic.notify(time)
    requestAnimationFrame(Kinetic.digest)
}

Kinetic.spawn = function(kinetic){
    Kinetic.instances.push(kinetic)
    kinetic.handleEvents()
}

Kinetic.kill = function(kinetic){
    var idx = Kinetic.instances.indexOf(kinetic)
    if(idx != -1){
        Kinetic.instances.splice(idx, 1)
        kinetic.unhandleEvents()
    }
}

Kinetic.notify = function(time){
    for(var i = 0, kinetic; i < Kinetic.instances.length; i++){
        kinetic = Kinetic.instances[i]
        if(kinetic.pressed()){            
            kinetic.track(time)
        }
        if(kinetic.shouldNotify()){
            kinetic.notify()
        }
        if(kinetic.swiped()){
            kinetic.swipe(time)
        }
    }
}

Kinetic.position = function(e){
    return new Vector(Kinetic.clientX(e), Kinetic.clientY(e))
}

Kinetic.clientX = function(e){
    return e.targetTouches ? e.targetTouches[0].clientX : e.clientX
}

Kinetic.clientY = function(e){
    return e.targetTouches ? e.targetTouches[0].clientY : e.clientY
}

Kinetic.Vector = Vector

Kinetic.prototype.listen = function(handler){
    this.events.push(handler)
}

Kinetic.prototype.stopListening = function(handler){
    var idx = this.events.indexOf(handler)
    if(idx != -1){
        this.events.splice(idx, 1)
    }
}

Kinetic.prototype.track = function(time){
    this._timestamp = this._timestamp || time
    if(this._framesCount == 6){
        this._elapsed = time - this._timestamp
        this._timestamp = time
        this._framesCount = 0

        var v = this.delta.mul(this.movingAvarageFilter).idiv(1 + this._elapsed)
        this.velocity = v.imul(0.8).iadd(this.velocity.imul(0.2))
    }
    else {
        this._framesCount++
    }
}

Kinetic.prototype.swipe = function(time){
    this._elapsed = time - this._timestamp
    this.delta = this.amplitude.mul(Math.exp(-this._elapsed / DECELERATION_RATE))
    if(this.delta.length() > this.deltaThreshold){
        this._shouldNotify = true
    }
    else {
        this._swiped = false
    }
}

Kinetic.prototype.notify = function(){
    for(var i = 0; i < this.events.length; i++){
        this.events[i](this.position, this.delta)
    }
    this.delta.zero()
    this._shouldNotify = false
}

Kinetic.prototype.shouldNotify = function(){
    return this._shouldNotify
}

Kinetic.prototype.pressed = function(){
    return this._pressed
}

Kinetic.prototype.swiped = function(){
    return this._swiped
}

Kinetic.prototype.handleEvents = function(){
    this.el.addEventListener('mousedown', this)
    this.el.addEventListener('pointerdown', this)
    this.el.addEventListener('touchstart', this)
    this.el.addEventListener('touchmove', this)
    this.el.addEventListener('touchend', this)
}

Kinetic.prototype.unhandleEvents = function(){
    this.el.removeEventListener('mousedown', this)
    this.el.removeEventListener('pointerdown', this)
    this.el.removeEventListener('touchstart', this)
    this.el.removeEventListener('touchmove', this)
    this.el.removeEventListener('touchend', this)
}

Kinetic.prototype.handleEvent = function(e){
    e.preventDefault()
    switch(e.type){
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

Kinetic.prototype.tap = function(e){    
    var clientRect = this.el.getBoundingClientRect()
    this._offset = new Vector(clientRect.left, clientRect.top)
    this._startPosition = Kinetic.position(e).isub(this._offset)

    this.velocity = new Vector(0, 0)
    this.amplitude = new Vector(0, 0)
    this._timestamp = 0
    this._framesCount = 0
    this._pressed = true
}

Kinetic.prototype.drag = function(e){
    this.position = Kinetic.position(e).isub(this._offset)
    this.delta.iadd(this.position.sub(this._startPosition))
    this._startPosition = this.position
    this._shouldNotify = true
}

Kinetic.prototype.release = function(){
    if(this.velocity.length() > this.velocityThreshold){
        this.amplitude = this.velocity.imul(this.amplitudeFactor)
        this._swiped = true
    }
    this._framesCount = 0
    this._pressed = false
    this._pointerId = null
}

Kinetic.prototype._mousedownHandler = function(e){
    if(e.pointerId){
        if(!this._pointerId){
            this._pointerId = e.pointerId
        }
        else if(this._pointerId !== e.pointerId){
            return
        }
    }
    document.addEventListener('mousemove', this)
    document.addEventListener('pointermove', this)
    document.addEventListener('mouseup', this)
    document.addEventListener('pointerup', this)

    this.tap(e)
}

Kinetic.prototype._mousemoveHandler = function(e){
    if(e.pointerId && this._pointerId !== e.pointerId){
        return
    }
    this.drag(e)
}

Kinetic.prototype._mouseupHandler = function(e){
    if(e.pointerId && this._pointerId && this._pointerId !== e.pointerId){
        return
    }
    document.removeEventListener('pointermove', this)
    document.removeEventListener('mousemove', this)
    document.removeEventListener('pointerup', this)
    document.removeEventListener('mouseup', this)

    this.release()
}

Kinetic.prototype._touchstartHandler = function(e){    
    if(e.targetTouches && e.targetTouches.length > 1){
        return
    }
    this.tap(e)
}

Kinetic.prototype._touchmoveHandler = function(e){
    if(e.targetTouches && e.targetTouches.length > 1){
        return
    }
    this.drag(e)
}

Kinetic.prototype._touchendHandler = function(e){
    this.release()
}

export default Kinetic
