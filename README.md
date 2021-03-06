<h1 align="center">Kinetica</h1>
<h4 align="center">Unprecedented kinetic engine.</h2>
<p align="center">
	<a href="https://www.npmjs.com/package/kinetica" target="_blank">
    <img src="https://img.shields.io/npm/v/kinetica.svg" alt="NPM version" target="_blank"></img>
  </a>
  <a href="https://www.bithound.io/github/broadsw0rd/kinetica">
    <img src="https://www.bithound.io/github/broadsw0rd/kinetica/badges/score.svg" alt="bitHound Overall Score">
  </a>
  <a href="https://github.com/feross/standard" target="_blank">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat" alt="js-standard-style"></img>
  </a>
</p>

## Table of Contents

- [Features](#features)
- [Dependencies](#dependencies)
- [Install](#install)
- [Usage](#usage)
- [Examples](#examples)
- [API](#api)
- [Development](#development)

## Features

- Designed with performance in mind
- Lightweight - [10.4 KB](https://github.com/broadsw0rd/kinetica/blob/master/dist/kinetic.min.js)
- Mobile friendly - supports mouse events, touch events and pointer events

## Dependencies

- [Vectory](https://www.npmjs.com/package/vectory)

## Install

Download [dev](https://rawgit.com/broadsw0rd/kinetica/master/dist/kinetic.js) or [prod](https://rawgit.com/broadsw0rd/kinetica/master/dist/kinetic.min.js) version and put it in your html

```html
<script src="vendor/kinetic.min.js"></script>
```

## Usage

```js
// start the digest loop
requestAnimationFrame(function loop (t) {
  Kinetic.notify(t)
  requestAnimationFrame(loop)
})

// create kinetic instance
var kinetic = new Kinetic({
  el: document.body,
  Vector: Vector
})

// spawn it
Kinetic.spawn(kinetic)

// implement scroll
var $target = document.getElementById('container')

var position = new Vector(0, 0)

function scrollTo (position) {
  $target.style.transform = `translateY(${position.y}px)`
}

function isValidScroll (position) {
  return position.y <= 0 && position.y > -5000 + window.innerHeight
}

function scrollY (pointers) {
  if (pointers.length === 1) {
    var pointer = pointers[0]
    var next = position.add(pointer.delta)
    if (isValidScroll(next)) {
      scrollTo(next)
      position = next
    }
  }
}

// subscribe to kinetic
kinetic.subscribe(scrollY)
```

## Examples

- **[All](https://codepen.io/collection/AMJybY/)**
- [Scroll Y](https://codepen.io/broadsw0rd/full/rzgamQ)
- [Scroll X](https://codepen.io/broadsw0rd/full/OjYXVG)
- [Scroll XY](https://codepen.io/broadsw0rd/full/QMREGj)

## API

## Development

Command | Description
------- | -----------
`npm run check` | Check standard code style by [snazzy](https://www.npmjs.com/package/snazzy)
`npm run build` | Wrap source code in [UMD](https://github.com/umdjs/umd) by [rollup](http://rollupjs.org/)
`npm run min` | Minify code by [UglifyJS](https://github.com/mishoo/UglifyJS)
