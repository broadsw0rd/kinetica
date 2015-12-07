var colors = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#9e9e9e", "#607d8b"]

function rand(start, end){
    return Math.floor(Math.random() * (end - start + 1)) + start;
}

var container = document.getElementById('container')
var containerWidth = parseInt(container.getBoundingClientRect().width)
var containerHeight = parseInt(container.getBoundingClientRect().height)

function Ball(){
    this.el = document.createElement('div')
    this.kinetic = new Kinetic({ el: this.el })
    this.kinetic.listen(this._dragHandler.bind(this))
    this.color = colors[rand(0, colors.length - 1)]

    container.appendChild(this.el) 

    this.setPosition(new Kinetic.Vector(rand(0, containerWidth), rand(0, containerHeight)))   
    this.el.classList.add('ball')
    this.el.style.height = this.el.style.width = Math.min(containerWidth, containerHeight) / 10 + 'px'
    this.el.style.background = this.color

    Kinetic.spawn(this.kinetic)
}

Ball.from = function(){
    return new Ball()
}

Ball.prototype.setPosition = function(position){
    this.position = position
    this.el.style.left = this.position.x + 'px'
    this.el.style.top = this.position.y + 'px'    
}

Ball.prototype._dragHandler = function(position, delta){
    this.setPosition(this.position.add(delta))
}

Kinetic.digest()

var bals = Array.apply(null, Array(10)).map(Ball.from)