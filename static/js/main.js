var colors = ["#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#795548", "#9e9e9e", "#607d8b"]

function rand (start, end) {
  return Math.floor(Math.random() * (end - start + 1)) + start;
}

var container = document.getElementById('container')
var containerWidth = parseInt(container.getBoundingClientRect().width)
var containerHeight = parseInt(container.getBoundingClientRect().height)

function Rect () {
  this.el = document.createElement('div')
  this.kinetic = new Kinetic({ el: this.el })
  this.kinetic.listen(this._dragHandler.bind(this))
  this.color = colors[rand(0, colors.length - 1)]

  container.appendChild(this.el) 
  this.el.classList.add('rect')

  this.setPosition(new Kinetic.Vector(rand(0, containerWidth), rand(0, containerHeight)))
  this.setSize(new Kinetic.Vector(Math.max(containerWidth, containerHeight) / 4,  Math.max(containerWidth, containerHeight) / 4))
  this.el.style.background = this.color

  Kinetic.spawn(this.kinetic)
}

Rect.from = function () {
  return new Rect()
}

Rect.prototype.setPosition = function (position) {
  this.position = position
  this.el.style.transform = 'translate3d(' + this.position.x + 'px, ' + this.position.y + 'px, 0)'
}

Rect.prototype.setSize = function (size) {
  this.size = size
  this.el.style.width = this.size.x + 'px'
  this.el.style.height = this.size.y + 'px'
}

Rect.prototype._dragHandler = function (pointers) {
  if (pointers.length === 2 && pointers[0].pressed() && pointers[1].pressed()) {
    pointers = pointers.sort(function (pointerA, pointerB) {
      return (pointerA.position.x > pointerB.position.x) - (pointerA.position.x < pointerB.position.x)
    })
    var scaleFactor = pointers[0].delta.add(pointers[1].delta.mul(-1))
    this.setPosition(this.position.add(scaleFactor))
    this.setSize(this.size.add(scaleFactor.imul(-2)))
  } else {
    this.setPosition(this.position.add(pointers[0].delta))
  } 
}

Kinetic.digest()

var rects = Array.apply(null, Array(5)).map(Rect.from)