
// -------------------------------------
// Vector
// -------------------------------------

function Vector(x, y){
    this.x = x || 0
    this.y = y || 0
}

Vector.from = function([x, y]){
    return new Vector(x, y)
}

Vector.create = function(angle, length) {
    return new Vector(length * Math.cos(angle), length * Math.sin(angle))
}

Vector.prototype.add = function(vector){
    return new Vector(this.x + vector.x, this.y + vector.y)
}

Vector.prototype.iadd = function(vector){
    this.x += vector.x
    this.y += vector.y
    return this
}

Vector.prototype.sub = function(vector){
    return new Vector(this.x - vector.x, this.y - vector.y)
}

Vector.prototype.isub = function(vector){
    this.x -= vector.x
    this.y -= vector.y
    return this
}

Vector.prototype.mul = function(scalar){
    return new Vector(this.x * scalar, this.y * scalar)
}

Vector.prototype.imul = function(scalar){
    this.x *= scalar
    this.y *= scalar
    return this
}

Vector.prototype.div = function(scalar){
    return new Vector(this.x / scalar, this.y / scalar)
}

Vector.prototype.idiv = function(scalar){
    this.x /= scalar
    this.y /= scalar
    return this
}

Vector.prototype.normalized = function(vector){
    var x = this.x
    var y = this.y
    var length = Math.sqrt(x * x + y * y)
    if(length > 0){
        return new Vector(x / length, y / length)
    }
    else{
        return new Vector(0, 0)
    }
}

Vector.prototype.normalize = function(vector){
    var x = this.x
    var y = this.y
    var length = Math.sqrt(x * x + y * y)
    if(length > 0){
        this.x = x / length
        this.y = y / length
    }
    return this
}

Vector.prototype.distance = function(vector){
    var x = this.x - vector.x
    var y = this.y - vector.y
    return Math.sqrt(x * x + y * y)
}

Vector.prototype.length = function(){
    return Math.sqrt(this.x * this.x + this.y * this.y)
}

Vector.prototype.angle = function(){
    return Math.atan2(this.y, this.x)
}

Vector.prototype.zero = function(){
    this.x = 0
    this.y = 0
    return this
}

Vector.prototype.copy = function(){
    return new Vector(this.x, this.y)
}

Vector.prototype.toJSON = function(){
    return [this.x, this.y]
}

Vector.prototype.equal = function(vector){
    return this.x == vector.x && this.y == vector.y
}

export default Vector