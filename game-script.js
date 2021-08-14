
const canvas= document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageNames = ['bird', 'cactus', 'dino'];



// Global game object
const game = {
   counter: 0,
   enemies: [],
   background: [],
   image: {},
   isGameOver: true,
   score: 0,
   timer: null,
   enemySpace: 0 ,
   speedUp: -1
};

let imageLoadCounter = 0;
for(const img of imageNames){
   const imagePath = `image/${img}.png`;
   game.image[img] = new Image();
   game.image[img].src = imagePath;
   game.image[img].onload = () => {
      imageLoadCounter++;
      if (imageLoadCounter === imageNames.length) {
         console.log('complete loading image');
         startGame();
     }
   }
}

function startGame(){
   game.isGameOver = true;
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   ctx.fillStyle = '#44abff';
   ctx.fillRect(0, 0, canvas.width, canvas.height);
   ctx.drawImage(game.image.dino, 240, 100, game.image.dino.width * 3, game.image.dino.height * 3);
   
   ctx.fillStyle = 'black';
   ctx.font = '70px serif'
   ctx.fillText('Start', 330, canvas.height / 2);
   ctx.font = '30px serif';
   ctx.fillText('press enter...', 320, 300);
}

function init(){
   game.counter = 0;
   game.enemies = [];
   game.isGameOver = false;
   game.score = 0;
   game.speedUp = -1;
   createDino();
   game.timer = setInterval(ticker, 30);
}

function ticker(){
   // clear the screen
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   ctx.fillStyle = '#44abff';
   ctx.fillRect(0, 0, canvas.width, canvas.height);

   if(game.counter % 10 === 0){
      createBackground();
   }

   if(game.score % 500 === 0){
      game.speedUp++;
   }

   // TODO enemies
   // whenever scores increased 100, more chance for enemy spawn
   if(Math.floor(Math.random() * ((100 - Math.floor(game.score / 100)) + 30)) === 0){
      if(game.enemySpace <= 5 || 9 <= game.enemySpace){
      createCactus();}
   }
   if(Math.floor(Math.random() * ((200 - Math.floor(game.score / 100)) + 60)) === 0){
      if(game.enemySpace <= 3 || 10 <= game.enemySpace){
      createBird();}
   }

   // move the charactors
   moveDino();
   moveEnemies();
   moveBackground();

   // draw
   drawDino();
   drawEnemies();
   drawBackground();
   drawScore();

   // game over if touch the enemies
   hitCheck();

   // update counter and scores
   game.score++;
   game.counter = (game.counter + 1) % 1000000;
   game.enemySpace = (game.enemySpace + 1) % 15;
}

function createDino(){
   game.dino = {
      x: (game.image.dino.width / 2) + 20,
      y: canvas.height - game.image.dino.height / 2,
      moveY: 0,
      width: game.image.dino.width,
      height: game.image.dino.height,
      image: game.image.dino
   }
}

function createCactus() {
   game.enemies.push({
       x: canvas.width + game.image.cactus.width / 2,
       y: (canvas.height - game.image.cactus.height / 2) - 15,
       width: game.image.cactus.width,
       height: game.image.cactus.height,
       moveX: -15 - game.speedUp,
       image: game.image.cactus
   });
}

function createBird() {
   const birdY = Math.random() * (300 - game.image.bird.height) + 150;
   game.enemies.push({
       x: canvas.width + game.image.bird.width / 2,
       y: birdY,
       width: game.image.bird.width,
       height: game.image.bird.height,
       moveX: -20 - game.speedUp,
       image: game.image.bird
   });
}

function createBackground(){
   game.background = [];
   for(let x = 0; x <= canvas.width; x += 200){
      game.background.push({
         x: x,
         y: canvas.height,
         width: 200,
         moveX: -20
      });
   }
}

function moveDino(){
   game.dino.y += game.dino.moveY;
   if(game.dino.y >= (canvas.height - game.dino.height / 2) - 15){
      game.dino.y = (canvas.height - game.dino.height / 2) - 15;
      game.dino.moveY = 0; 
      // make the Dino on the ground, without getting throuth the ground
   } else{
      game.dino.moveY += 3;
   }
}

function moveEnemies(){
   for(const enemy of game.enemies){
      enemy.x += enemy.moveX;
   }

   // if the charactor goes off the screen, remove it from the Array
   game.enemies = game.enemies.filter(enemy => enemy.x > -enemy.width);
}

function moveBackground(){
   for(const background of game.background){
      background.x += background.moveX;
   }
}

function drawDino(){
   ctx.drawImage(game.image.dino, game.dino.x - game.dino.width / 2, game.dino.y - game.dino.height / 2);
}

function drawEnemies(){
   for(const enemy of game.enemies){
      ctx.drawImage(enemy.image, enemy.x - enemy.width / 2, enemy.y - enemy.height / 2);
   }
}

function drawBackground(){
   ctx.fillStyle = 'sienna';
   for(const background of game.background){
      ctx.fillRect(background.x, background.y - 15, background.width, 15);
      ctx.fillRect(background.x + 20, background.y - 18, background.width - 40, 3);
      ctx.fillRect(background.x + 50, background.y - 21, background.width - 100, 3);
   }
}

function drawScore(){
   ctx.fillStyle = 'black';
   ctx.font = '24px serif';
   ctx.fillText(`score: ${game.score}`, 0, 30);
}

function hitCheck(){
   for(const enemy of game.enemies){
      if(
         Math.abs(game.dino.x - enemy.x) < game.dino.width * 0.8 / 2 + enemy.width * 0.9 / 2 &&
         Math.abs(game.dino.y - enemy.y) < game.dino.height * 0.5 / 2 + enemy.height * 0.9 / 2
      ) {
         game.isGameOver = true;
         ctx.fillStyle = 'black';
         ctx.font = 'bold 100px serif';
         ctx.fillText('Game Over!', 150, 200);
         ctx.font = '27px serif';
         ctx.fillText('press enter...', 330, 240);
         clearInterval(game.timer);
      }
   }
}

document.onkeydown = function(e){
   if(e.key === ' ' && game.dino.moveY === 0){
      game.dino.moveY = -41;
   }
   if(e.key === 'Enter' && game.isGameOver === true){
      init();
   }
}

/// canvas ///

// for drawing

/*

   ctx.fillStyle = 'red'; 
      // set the color

   ctx.fillRect(30, 20, 150, 100);　
      // set the size

*/

///// fillRect(X-POSITION, Y-POSITION, WIDTH, HEIGHT);

/*

https://cdn.fccc.info/L7RW/soroban/a77ac9e34dd4f49d1bbe7c9c5e0b6977/soroban-guide-5549/96af90e2-private.png?Expires=1628803627&Key-Pair-Id=APKAIXOVMBEKCVHZBGWQ&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9jZG4uZmNjYy5pbmZvLyovc29yb2Jhbi8qL3Nvcm9iYW4tZ3VpZGUtNTU0OS8qLioiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2Mjg4MDM2Mjd9fX1dfQ__&Signature=h4qkxOoJQR8seOr3x0OxUadefnZHY5fkX8pLHCS-6izVx7FvgwOckuLYq261UanMKBWUUz8HwTZ~5t8MOnFLgPIpnfKLM9P0BOuIKWB10n5tGRW0w4fKLPq9~VvMB1Up7OqI1PG6Fv1z90ytzbZBfvR1VZOC-TV6ZaR9Eltr9nfJC6K6NU8wWUATuQ3IMVRfdbSvtxjiMynn7kw1PuKrbN3F-yR3Ea9LQTKdVWZjHdLtGoyoXvT4AgiDRw3XiHkIzTy3vjmNsnZHy4G7s1pgFA6lHGbb8XV0m--pzccDGjqSxL1UH4qq1zQ9w04dfarToDzmLxsYXB4Vx~HL0ddA0A__

*/

