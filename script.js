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
   text: "play"
}

const howToPlayButton = {
   x: 335,
   y: 300,
   width: 130,
   height: 50,
   text: "how to play"
}

const pauseButton = {
   x: 700,
   y: 10,
   width: 80,
   height: 30,
   text: "pause"
}

const resumeButton = {
   x: 350,
   y: 200,
   width: 100,
   height: 50,
   text: "resume"
}

const restartButton = {
   x: 325,
   y: 100,
   width: 150,
   height: 50,
   text: "start over"
}

const backButton = {
   x: 350,
   y: 400,
   width: 100,
   height: 50,
   text: "back"
}

function drawButton(button) {
   ctx.fillStyle = "white";
   ctx.fillRect(button.x, button.y, button.width, button.height);
   ctx.strokeStyle = "black";
   ctx.strokeRect(button.x, button.y, button.width, button.height);
   ctx.fillStyle = "black";
   ctx.font = "20px Arial";
   ctx.textAlign = "center";
   ctx.textBaseline = "middle";
   ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
}

const playerInitialState = {
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

let player = { ...playerInitialState }

const playerSprite = new Image();
playerSprite.src = "images/purplefish.png"

const fishes = []
const fishSprite = new Image();
fishSprite.src = "images/purplefish.png"

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
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   if(gameState === "start") {
      drawStartScreen();
   } else if (gameState === "play") {
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      drawFishes();
      drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height, player.facingRight);
      drawButton(pauseButton);
      movePlayer();
      handleCollisions();
   } else if (gameState === "pause") {
      drawPauseScreen();
   } else if (gameState === "howToPlay") {
      drawInstructionScreen();
   } else if (gameState === "gameOver") {
      drawGameOverScreen();
   }

   requestAnimationFrame(animate)
}

function resetGame() {
   player = { ...playerInitialState };
   fishes.length = 0;
   spawnFish();
   setInterval(spawnFish, 2000);
   gameState = "play";
}

function drawStartScreen() {
   ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
   drawButton(playButton);
   drawButton(howToPlayButton);
}

function drawPauseScreen() {
   ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
   ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
   drawButton(restartButton);
   drawButton(resumeButton);
   drawButton(backButton);
}
 
function drawInstructionScreen() {
   ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
   ctx.fillStyle = "black";
   ctx.font = "20px Arial"
   ctx.textAlign = "center";
   ctx.fillText("< how to play >", canvas.width / 2, 100)
   ctx.fillText("move around using the arrow keys", canvas.width / 2, 150)
   ctx.fillText("your goal is to eat small fishys and be the biggest fishy", canvas.width / 2, 200)
   ctx.fillText("good luck!", canvas.width / 2, 250)
   drawButton(backButton);
}

function drawGameOverScreen() {
   ctx.fillStyle = "red";
   ctx.fillRect(0, 0, canvas.width, canvas.height);

   ctx.fillStyle = "white";
   ctx.font = "30px Arial"
   ctx.textAlign = "center"
   ctx.fillText("you got eaten, game over", canvas.width / 2, canvas.height / 2);

   drawButton(restartButton);
}

// generate random fishes that move across the screen
function drawFishes() {
   for (let i = 0; i < fishes.length; i++) {
      const fish = fishes[i];
      drawSprite(fishSprite, 0, 0, fish.width, fish.height, fish.x, fish.y, fish.width, fish.height, fish.facingRight);
   }
}

function spawnFish() {
   const fish = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      width: 20 + Math.random() * 50,
      height: 20 + Math.random() * 50,
      speed: Math.random() *2 + 1,
      facingRight: Math.random() > 0.5
   }
   fishes.push(fish);
}

// check make sure fish collisions
function handleCollisions() {
   for (let i = 0; i< fishes.length; i++) {
      const fish = fishes[i];

      // check collision with player
      if (isColliding(player,fish)) {
         if (player.width > fish.width) {
            player.width += fish.width / 10;
            player.height += fish.height / 10;
            player.size += fish.width / 10;
            fishes.splice(i, 1);
            i--
         } else {
            gameState = "gameOver"
         }
      }

      fish.x += fish.facingRight ? fish.speed : -fish.speed;

      // when fish goes out of screen
      if (fish.x < -fish.width || fish.x > canvas.width) {
         fishes.splice(i, 1);
         i--;
         spawnFish();
      }
   }
}

function isColliding(rect1, rect2) {
   return rect1.x < rect2.x + rect2.width &&
          rect1.x + rect1.width > rect2.x &&
          rect1.y < rect2.y + rect2.height &&
          rect1.y + rect1.height > rect2.y;
}

animate()
spawnFish();
setInterval(spawnFish, 2000);

window.addEventListener("keydown", function(e) {
   keys[e.keyCode] = true;
});

window.addEventListener("keyup", function(e) {
   delete keys[e.keyCode];
});

// handle click on buttons
canvas.addEventListener("click", function(e) {
   const rect = canvas.getBoundingClientRect();
   const mouseX = e.clientX - rect.left;
   const mouseY = e.clientY - rect.top;

   if (gameState === "start") {
      if (isInsideButton(mouseX, mouseY, playButton)) {
         gameState = "play";
      } else if (isInsideButton(mouseX, mouseY, howToPlayButton)) {
         gameState = "howToPlay";
      }
   } 
   else if (gameState === "play") {
      if (isInsideButton(mouseX, mouseY, pauseButton)) {
         gameState = "pause";
      }
   } 
   else if (gameState === "pause") {
      if (isInsideButton(mouseX, mouseY, resumeButton)) {
         gameState = "play";
      } else if (isInsideButton(mouseX, mouseY, restartButton)) {
         resetGame();
      } else if (isInsideButton(mouseX, mouseY, backButton)) {
         gameState = "start";
      }
   }
   else if (gameState === "howToPlay") {
      if (isInsideButton(mouseX, mouseY, backButton)) {
         gameState = "start";
      }
   }
   else if (gameState === "gameOver") {
      if (isInsideButton(mouseX, mouseY, restartButton)) {
         resetGame();
      }
   }
})

// wheck backButton pressed, hide instructions
document.getElementById('backButton').addEventListener('click', function() {
   gameState = "start";
   document.getElementById('instructions').style.display = 'none';
})

function isInsideButton(x, y, button) {
   return x > button.x && x < button.x + button.width && y > button.y && y < button.y + button.height;
}

function movePlayer() {
   if (gameState !== "play") return;
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