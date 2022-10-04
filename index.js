const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const WIDTH = (canvas.width = window.innerWidth);
const HEIGHT = (canvas.height = window.innerHeight);

let ravens = [];
class Raven {
  constructor() {
    this.width = 100;
    this.height = 50;
    this.x = WIDTH;
    this.y = Math.random() * (HEIGHT - this.height);
    this.directionX = Math.random * 5 + 3;
    this.directionY = Math.random * 5 + -2.5;
  }
  update() {
    this.x -= this.directionX;
  }
  draw() {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
function animate(timestamp) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  requestAnimationFrame(animate);
}
animate();
