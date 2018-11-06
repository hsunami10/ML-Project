var GAME_WIDTH = 1000; //pixels
var GAME_HEIGHT = 500; //pixels
var GAME_RIGHT_BOUNDARY = 1000;
var GAME_LEFT_BOUNDARY = 0;
var GAME_BOTTOM_BOUNDARY = 0;

var ACCEL_GRAVITY = -5; //pixels per second

var PLAYER_HEIGHT = 50; //pixels
var PLAYER_WIDTH = 50; //pixels
var MAX_PLAYER_SPEED = 5; //pixels per second
var PLAYER_HORIZ_ACCEL = 1; //pixels per second^2
var PLAYER_HP = 200; //points
var PLAYER_MAX_ENERGY = 100; //points
var PLAYER_MAX_SHIELD = 100; //points
var PLAYER_START_ENERGY = 30; //points
var PLAYER_START_SHIELD = 30; //points
var PLAYER_SHIELD_REFRESH_RATE = 1; //points per second
var PLAYER_ENERGY_REFRESH_RATE = 1; //points per second
var PLAYER_JUMP_SPEED = 10; //pixels per second

//array locs for the input types
var PLAYER_INPUT_LEFT = 0;
var PLAYER_INPUT_RIGHT = 1;
var PLAYER_INPUT_JUMP = 2;
var PLAYER_INPUT_SHOOT = 3;
var PLAYER_INPUT_SHIELD = 4;

var HUMAN_KEY_LEFT = "ArrowLeft";
var HUMAN_KEY_RIGHT = "ArrowRight";
var HUMAN_KEY_JUMP = "ArrowUp";
var HUMAN_KEY_SHOOT = "Space";
var HUMAN_KEY_SHIELD = "ArrowDown"

//projectile should be circle I guess?
var PROJECTILE_SPEED = 8; //pixels per second
var PROJECTILE_SIZE_SMALL = 10; //pixels
var PROJECTILE_SIZE_MEDIUM = 20; //pixels
var PROJECTILE_SIZE_LARGE = 30; //pixels
var PROJECTILE_DMG_SMALL = 30;
var PROJECTILE_DMG_MEDIUM = 60;
var PROJECTILE_DMG_LARGE = 90;

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

class Input {
  constructor(input_type) {
    this.input_type = input_type;
  }

  evaluate() {
    var input_arr = Array(5);
    for (i = 0; i < 5; i++) {
      input_arr[i] = false;
    }
    if (this.input_type == "human") {
      
      input_arr[PLAYER_INPUT_LEFT] = keys[HUMAN_KEY_LEFT];
      input_arr[PLAYER_INPUT_RIGHT] = keys[HUMAN_INPUT_RIGHT];
      input_arr[PLAYER_INPUT_JUMP] = keys[HUMAN_KEY_JUMP];
      input_arr[PLAYER_INPUT_SHIELD] = keys[HUMAN_KEY_SHIELD];
      input_arr[PLAYER_INPUT_SHOOT] = keys[HUMAN_KEY_SHOOT];

    }
    else {
      input_arr[PLAYER_INPUT_SHOOT] = true;
    }

    return input_arr;
  }
}

class Player {
  constructor(start_x, start_y, game_frame, player_input) {
    this.width = PLAYER_WIDTH;
    this.height = PLAYER_HEIGHT;
    this.x = start_x
    this.y = start_y;
    this.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    this.dx = 0;
    this.dy = 0;
    this.game_frame = game_frame;
    this.ascend = this.descend = false;
    this.input = player_input;
    this.player_direction = 1;
  }
  is_on_ground() {
    return true;
  }


  update(frame_time) {
    var input_arr = this.input.evaluate();
    

    //HORIZONTAL MOVEMENT
    if (input_arr[PLAYER_INPUT_LEFT]) {
      this.dx -= PLAYER_HORIZ_ACCEL * frame_time;
      this.player_direction = -1;
    }

    if (input_arr[PLAYER_INPUT_RIGHT]) {
      this.dx += PLAYER_HORIZ_ACCEL * frame_time;
      this.player_direction = 1;
    }

    if (this.dx > MAX_PLAYER_SPEED) {
      this.dx = MAX_PLAYER_SPEED;
    }

    if (this.dx < -1 * MAX_PLAYER_SPEED) {
      this.dx = -1 * MAX_PLAYER_SPEED;
    }

    this.x += this.dx;
    

    //VERTICAL MOVEMENT
    if (input_arr[PLAYER_INPUT_JUMP]) {
      if (this.is_on_ground()) {
        this.dy = PLAYER_JUMP_SPEED;
      }
    }



    //check if on ground
    if (this.is_on_ground()) {
      this.dy = 0;
      this.y = bottom;
    }
  }
  draw() {
    this.game_frame.fillStyle = this.color;

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
