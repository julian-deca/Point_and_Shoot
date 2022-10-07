const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const WIDTH = (canvas.width = window.innerWidth);
const HEIGHT = (canvas.height = window.innerHeight);

const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
const frameSpeed = 5;

let score = 0;
let gameOver = false;
ctx.font = "Bold 50px Impact";

let ravens = [];
class Raven {
  constructor() {
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.4;
    this.height = this.spriteHeight * this.sizeModifier;
    this.width = this.spriteWidth * this.sizeModifier;
    this.frames = 0;
    this.x = WIDTH;
    this.y = Math.random() * (HEIGHT - this.height);
    this.image = new Image();
    this.image.src = "raven.png";
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 + -2.5;
    this.markedForDeletion = false;
    this.frame = Math.round(Math.random() * 6);
    this.maxFrame = 4;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 50 + 50;
    this.randomColor = [
      Math.round(Math.random() * 255),
      Math.round(Math.random() * 255),
      Math.round(Math.random() * 255),
    ];
    this.color =
      "rgb(" +
      this.randomColor[0] +
      "," +
      this.randomColor[1] +
      "," +
      this.randomColor[2] +
      ")";
  }
  update(deltatime) {
    if (this.y < 0 || this.y > HEIGHT - this.height) {
      this.directionY = -this.directionY;
    }
    this.x -= this.directionX;
    this.y += this.directionY;
    if (this.x < 0 - this.width) this.markedForDeletion = true;

    this.timeSinceFlap += deltatime;
    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;
      this.timeSinceFlap = 0;
      particles.push(new Particle(this.x, this.y, this.width, this.color));
    }
    if (this.x < 0 - this.width) gameOver = true;
  }
  draw() {
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.spriteWidth * this.frame,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

let explosions = [];
class Explosion {
  constructor(x, y, size) {
    this.image = new Image();
    this.image.src = "boom.png";
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.size = size;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.sound = new Audio();
    this.sound.src = "2.ogg";
    this.sound.volume = 0.2;
    this.timeSinceLastFrame = 0;
    this.frameInterval = 100;
    this.markedForDeletion = false;
  }
  update(deltatime) {
    if (this.frame === 0) this.sound.play();
    this.timeSinceLastFrame += deltatime;
    if (this.timeSinceLastFrame > this.frameInterval) {
      this.frame++;
      this.timeSinceLastFrame = 0;
      if (this.frame > 5) this.markedForDeletion = true;
    }
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.spriteWidth * this.frame,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y - this.size / 4,
      this.size,
      this.size
    );
  }
}

let particles = [];
class Particle {
  constructor(x, y, size, color) {
    this.size = size;
    this.x = x + this.size / 2;
    this.y = y + this.size / 3;
    this.radious = (Math.random() * this.size) / 10;
    this.maxRadious = Math.random() * 20 + 35;
    this.markedForDeletion = false;
    this.speedX = Math.random() * 1 + 0.5;
    this.color = color;
  }
  update() {
    this.x += this.speedX;
    this.radious += 0.2;
    if (this.radious > this.maxRadious) this.markedForDeletion = true;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radious, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 50, 75);
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 53, 78);
}
function drawGameOver() {
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText("GAME OVER, your score is: " + score, WIDTH / 2, HEIGHT / 2);
  ctx.fillStyle = "white";
  ctx.fillText(
    "GAME OVER, your score is: " + score,
    WIDTH / 2 + 3,
    HEIGHT / 2 + 3
  );
}

window.addEventListener("click", (e) => {
  const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
  const pc = detectPixelColor.data;
  ravens.forEach((object) => {
    if (
      object.randomColor[0] === pc[0] &&
      object.randomColor[1] === pc[1] &&
      object.randomColor[2] === pc[2]
    ) {
      object.markedForDeletion = true;
      score++;
      explosions.push(new Explosion(object.x, object.y, object.width));
    }
  });
});

function animate(timestamp) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  collisionCtx.clearRect(0, 0, WIDTH, HEIGHT);

  let deltatime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltatime;
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
    ravens.sort((a, b) => {
      return a.width - b.width;
    });
  }
  drawScore();
  [...particles, ...ravens, ...explosions].forEach((object) =>
    object.update(deltatime)
  );
  [...particles, ...ravens, ...explosions].forEach((object) => object.draw());
  ravens = ravens.filter((obj) => !obj.markedForDeletion);
  explosions = explosions.filter((obj) => !obj.markedForDeletion);

  if (!gameOver) requestAnimationFrame(animate);
  else drawGameOver();
}
animate(0);
