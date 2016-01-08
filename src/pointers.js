import Pointer from './pointer.js'

// -------------------------------------
// Pointers
// -------------------------------------

function onlyPressed(pointer){
    return pointer.pressed()
}

function onlySwiped(pointer){
    return pointer.swiped()
}

function onlyActive(pointer){
    return pointer.active()
}

function Pointers(pointers){
    pointers = pointers || []
    this.reset(pointers)
}

Pointers.PRESSED = 'pressed'
Pointers.SWIPED = 'swiped'
Pointers.ACTIVE = 'active'

Pointer.prototype.at = function(idx){
    return this._pointers[idx]
}

Pointers.prototype.get = function(id){
    for(var i = 0, pointer; i < this.count(); i++){
        pointer = this.at(i)
        if(pointer.id == id){
            return pointer
        }
    }
    return null
}

Pointers.prototype.count = function(){
    return this._pointers.length
}

Pointers.prototype.add = function(pointer){
    this._pointers.push(pointer)
}

Pointers.prototype.remove = function(id){
    var pointer = this.get(id)
    this._pointers.splice(this._pointers.indexOf(pointer), 1)
}

Pointers.prototype.create = function(id){
    this._pointers.push(new Pointer({ id }))
}

Pointers.prototype.clear = function(){
    this.reset([])
}

Pointers.prototype.reset = function(pointers){
    this._pointers = pointers.concat()
}

Pointers.prototype.only = function(predicate){
    switch(predicate){
        case Pointers.PRESSED: return new Pointers(this._pointers.filter(onlyPressed))
        case Pointers.SWIPED: return new Pointers(this._pointers.filter(onlySwiped))
        case Pointers.ACTIVE: return new Pointers(this._pointers.filter(onlyActive))
    }
}