const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const WIDTH = (canvas.width = window.innerWidth);
const HEIGHT = (canvas.height = window.innerHeight);

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
const frameSpeed = 5;

let ravens = [];
class Raven {
  constructor() {
    this.flapSpeed = Math.round(Math.random() * 6);
    this.frames = 0;
    this.height = Math.random() * 125 + 70;
    this.width = this.height * 1.4;
    this.x = WIDTH;
    this.y = Math.random() * (HEIGHT - this.height);
    this.image = new Image();
    this.image.src = "raven.png";
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 + -2.5;
    this.markedForDeletion = false;
    this.spriteWidth = 271;
    this.spriteHeight = 194;
  }
  update() {
    this.x -= this.directionX;
    if (this.x < 0 - this.width) this.markedForDeletion = true;
    this.frames++;
    if (this.frames % frameSpeed === 0) {
      this.flapSpeed == 5 ? (this.flapSpeed = 0) : this.flapSpeed++;
    }
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.spriteWidth * this.flapSpeed,
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

function animate(timestamp) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  let deltatime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltatime;
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
  }
  [...ravens].forEach((object) => object.update());
  [...ravens].forEach((object) => object.draw());
  ravens = ravens.filter((obj) => !obj.markedForDeletion);

  requestAnimationFrame(animate);
}
animate(0);
