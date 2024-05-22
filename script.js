const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 800
canvas.height = 500

const keys = []
let gameState = "start";

// buttons
const playButton = {
   x: 350,
   y: 200,
   width: 100,
   height: 50,
   text: "Play"
}

const howToPlayButton = {
   x: 350,
   y: 300,
   width: 100,
   height: 50,
   text: "How to Play"
}

const player = {
   x: 300,
   y: 100,
   width: 65,
   height: 55,
   frameX: 0,
   frameY: 0,
   speed: 1,
   velocityX: 0,
   velocityY: 0,
   acceleration: 0.2,
   drag: 0.98,
   facingRight: false
}

const playerSprite = new Image();
playerSprite.src = "images/purplefish.png"
const background = new Image();
background.src = "images/background.png"

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH, flipH) {
   ctx.save();
   if (flipH) {
      ctx.scale(-1, 1);
      dX = -dX - dW;
   }

   ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH)
   ctx.restore();
}

function animate() {
   ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

   drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height, player.facingRight)

   movePlayer()
   requestAnimationFrame(animate)
}
animate()

window.addEventListener("keydown", function(e) {
   keys[e.keyCode] = true;
});

window.addEventListener("keyup", function(e) {
   delete keys[e.keyCode];
});

function movePlayer() {
   // 
   // for up arrow
   if(keys[38]) {
      player.velocityY -= player.acceleration;
   }

   // for down arrow
   if(keys[40]) {
      player.velocityY += player.acceleration;
   }

   // for left arrow
   if(keys[37]) {
      player.velocityX -= player.acceleration;
      player.facingRight = false;
   }

   // for right arrow; make sure to flip
   if(keys[39]) {
      player.velocityX += player.acceleration;
      player.facingRight = true;
   }

   player.velocityX *= player.drag;
   player.velocityY *= player.drag;

   // update player based on velocity
   player.x += player.velocityX;
   player.y += player.velocityY;

   // bounds for player
   if (player.x < 0) {
      player.x = 0;
      player.velocityX = 0;
   }
   if (player.x + player.width > canvas.width) {
      player.x = canvas.width - player.width;
      player.velocityX = 0;
   }
   if (player.y < 0) {
      player.y = 0;
      player.velocityY = 0;
   }
   if (player.y + player.height > canvas.height) {
      player.y = canvas.height - player.height;
      player.velocityY = 0;
   }
}