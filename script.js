const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = 800
canvas.height = 500

const keys = []

const player = {
   x: 0,
   y: 0,
   frameX: 0,
   frameY: 0,
   speed: 9,
   moving: false
}

const playerSprite = new Image();