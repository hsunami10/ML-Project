var canvas = document.getElementById('canvas');
canvas.width = 1000;
canvas.height = 500;
var dims = 50;
var bottom = canvas.height - dims;
var c = canvas.getContext('2d');

// code - ArrowDown, ArrowUp, ArrowRight, ArrowLeft, Space
var keys = {};
var keylistener = function(e) {
  e = e || event;
  keys[e.code] = e.type == 'keydown';
}
document.addEventListener('keydown', keylistener);
document.addEventListener('keyup', keylistener);

class Player {
  constructor(x, y) {
    this.width = this.height = dims;
    this.x = x, this.y = y;
    this.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    this.speed = 5;
    this.ascend = this.descend = false;
  }

  draw() {
    c.fillStyle = this.color;

    if (keys['ArrowDown']) console.log('shield');
    if (keys['ArrowUp'] && !this.ascend && !this.descend) this.ascend = true;
    if (keys['ArrowRight']) this.x += this.speed;
    if (keys['ArrowLeft']) this.x -= this.speed;
    if (keys['Space']) console.log('shoot');

    // Handle Jumping
    if (this.ascend) {
      this.y -= 10;
      if (this.y < 325) {
        this.ascend = false;
        this.descend = true;
      }
    }
    if (this.descend) {
      this.y += 10;
      if (this.y >= bottom) this.ascend = this.descend = false;
    }

    c.fillRect(this.x, this.y, this.width, this.height);
  }
}

var p1 = new Player(canvas.width / 2 - dims / 2, bottom);

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = 'rgb(200,200,200)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  p1.draw();
}
animate();
