var GAME_WIDTH = 1000; //pixels
var GAME_HEIGHT = 500; //pixels
var GAME_RIGHT_BOUNDARY = 1000;
var GAME_LEFT_BOUNDARY = 0;
var GAME_BOTTOM_BOUNDARY = 0;

var ACCEL_GRAVITY = -3000; //pixels per second

var PLAYER_HEIGHT = 50; //pixels
var PLAYER_WIDTH = 50; //pixels
var PLAYER_FRICTION = 0.990; //fraction out of 1
var MAX_PLAYER_SPEED = 400; //pixels per second
var PLAYER_HORIZ_ACCEL = 1600; //pixels per second^2
var PLAYER_HP = 200; //points
var PLAYER_MAX_ENERGY = 100; //points
var PLAYER_MAX_SHIELD = 100; //points
var PLAYER_START_ENERGY = 30; //points
var PLAYER_START_SHIELD = 30; //points
var PLAYER_SHIELD_REFRESH_RATE = 50; //points per second
var PLAYER_SHIELD_USE_RATE = 150;
var PLAYER_ENERGY_REFRESH_RATE = 30; //points per second
var PLAYER_JUMP_SPEED = 1200; //pixels per second

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
var PROJECTILE_REQ_SMALL = 30;
var PROJECTILE_REQ_MEDIUM = 60;
var PROJECTILE_REQ_LARGE = 90;

var INFO_BAR_WIDTH = 200;
var INFO_BAR_HEIGHT = 20;
var INFO_BAR_SEP = 10;
var INFO_HEALTH_COLOR = 'rgb(0, 255, 0)';
var INFO_ENERGY_COLOR = 'rgb(255, 0, 0)';
var INFO_SHIELD_COLOR = 'rgb(0, 0, 255)';
var INFO_OUTLINE_COLOR = 'rgb(0, 0, 0)';

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
    for (var i = 0; i < 5; i++) {
      input_arr[i] = false;
    }
    if (this.input_type == "human") {
      
      input_arr[PLAYER_INPUT_LEFT] = keys[HUMAN_KEY_LEFT];
      input_arr[PLAYER_INPUT_RIGHT] = keys[HUMAN_KEY_RIGHT];
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

class Projectile {
  constructor(color, size, damage, x, y, direction, game_frame) {
    this.color = color;
    this.size = size;
    this.direction = direction;
    this.damage = damage;
    this.game_frame = game_frame;
    this.x = x;
    this.y = y;
    
  }

  in_screen(){
    if (this.x > GAME_RIGHT_BOUNDARY) {
      return false;
    }

    if (this.x < GAME_LEFT_BOUNDARY) {
      return false;
    }

    return true;
  }


  update(time_step){
    this.x = this.x + PROJECTILE_SPEED * this.direction;
    
  }

  draw(){
    this.game_frame.beginPath();
    this.game_frame.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
    this.game_frame.fillStyle = this.color;
    this.game_frame.fill();
    this.game_frame.lineWidth = 5;
    this.game_frame.strokeStyle = '#003300';
    this.game_frame.stroke();
  }
  
}

class Player {
  constructor(start_x, start_y, game_frame, player_input, info_x) {
    this.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    this.width = PLAYER_WIDTH;
    this.height = PLAYER_HEIGHT;
    this.info = info_x
    this.x = start_x
    this.y = start_y;
    this.dx = 0;
    this.dy = 0;
    this.health = PLAYER_HP;
    this.shield = PLAYER_START_SHIELD;
    this.energy = PLAYER_START_ENERGY;
    this.player_direction = 1;
    this.projectiles = new Array();
    this.game_frame = game_frame;
    this.input = player_input;
    this.shield_equipped = false;
  }

  is_on_ground() {
    if (this.y >= bottom) {
      return true;
    }

    return false;
  }

  draw_health() {
    var y = INFO_BAR_SEP;
    var length = this.health / PLAYER_HP * INFO_BAR_WIDTH;
    this.game_frame.lineWidth = 1;
    this.game_frame.fillStyle = INFO_HEALTH_COLOR;
    this.game_frame.fillRect(this.info, y, length, INFO_BAR_HEIGHT);

    this.game_frame.fillStyle = INFO_OUTLINE_COLOR;
    this.game_frame.strokeRect(this.info, y, INFO_BAR_WIDTH, INFO_BAR_HEIGHT);
    
  }

  draw_energy() {
    this.game_frame.lineWidth = 1;
    var y = 2 * INFO_BAR_SEP + INFO_BAR_HEIGHT;
    var length = this.energy / PLAYER_MAX_ENERGY * INFO_BAR_WIDTH;
    this.game_frame.fillStyle = INFO_ENERGY_COLOR;
    this.game_frame.fillRect(this.info, y, length, INFO_BAR_HEIGHT);

    this.game_frame.fillStyle = INFO_OUTLINE_COLOR;
    this.game_frame.strokeRect(this.info, y, INFO_BAR_WIDTH, INFO_BAR_HEIGHT);

    var x = this.info + INFO_BAR_WIDTH * PROJECTILE_REQ_SMALL / PLAYER_MAX_ENERGY;
    this.game_frame.strokeRect(x, y, 0, INFO_BAR_HEIGHT);

    x = this.info + INFO_BAR_WIDTH * PROJECTILE_REQ_MEDIUM / PLAYER_MAX_ENERGY;
    this.game_frame.strokeRect(x, y, 0, INFO_BAR_HEIGHT);

    x = this.info + INFO_BAR_WIDTH * PROJECTILE_REQ_LARGE / PLAYER_MAX_ENERGY;
    this.game_frame.strokeRect(x, y, 0, INFO_BAR_HEIGHT);
    
  }

  draw_shield() {
    var y = INFO_BAR_SEP * 3 + 2 * INFO_BAR_HEIGHT;
    this.game_frame.lineWidth = 1;
    var length = this.shield / PLAYER_MAX_SHIELD * INFO_BAR_WIDTH;
    this.game_frame.fillStyle = INFO_SHIELD_COLOR;
    this.game_frame.fillRect(this.info, y, length, INFO_BAR_HEIGHT);
    
    this.game_frame.fillStyle = INFO_OUTLINE_COLOR;
    this.game_frame.strokeRect(this.info, y, INFO_BAR_WIDTH, INFO_BAR_HEIGHT);
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

    this.dx = this.dx * PLAYER_FRICTION;
    this.x += this.dx * frame_time;

    if (this.x <= GAME_LEFT_BOUNDARY) {
      this.x = 0;
      this.dx = 0;
    }

    if (this.x + this.width >= GAME_RIGHT_BOUNDARY) {
      this.x = GAME_RIGHT_BOUNDARY - this.width;
      this.dx = 0;
    }
    

    //VERTICAL MOVEMENT
    if (input_arr[PLAYER_INPUT_JUMP]) {
      if (this.is_on_ground()) {
        this.dy = -1 * PLAYER_JUMP_SPEED;
      }
    }

    this.dy = this.dy - ACCEL_GRAVITY * frame_time;
    this.y += this.dy * frame_time;

    //check if on ground
    if (this.is_on_ground()) {
      
      this.dy = 0;
      this.y = bottom;
    }

    //PROJECTILE
    for (var i = 0; i < this.projectiles.length; i++){
      if (this.projectiles[i].in_screen() == false) {
        this.projectiles.splice(i, 1);
        i--;
      }
    }

    if (input_arr[PLAYER_INPUT_SHOOT]){
      if (this.energy >= PROJECTILE_REQ_LARGE){
        var p = new Projectile(this.color, PROJECTILE_SIZE_LARGE, PROJECTILE_DMG_LARGE, this.x + this.width / 2.0, this.y + this.height / 2.0, this.player_direction, this.game_frame)
        this.projectiles.push(p);
        this.energy -= PROJECTILE_REQ_LARGE;
      }
      else if (this.energy >= PROJECTILE_REQ_MEDIUM) {
        var p = new Projectile(this.color, PROJECTILE_SIZE_MEDIUM, PROJECTILE_DMG_MEDIUM, this.x + this.width / 2.0, this.y + this.height / 2.0, this.player_direction, this.game_frame)
        this.projectiles.push(p);
        this.energy -= PROJECTILE_REQ_MEDIUM;
      }
      else if (this.energy >= PROJECTILE_REQ_SMALL) {
        var p = new Projectile(this.color, PROJECTILE_SIZE_SMALL, PROJECTILE_DMG_SMALL, this.x + this.width / 2.0, this.y + this.height / 2.0, this.player_direction, this.game_frame)
        
        this.projectiles.push(p);
        this.energy -= PROJECTILE_REQ_SMALL;
      }
    }
    
    this.energy += frame_time * PLAYER_ENERGY_REFRESH_RATE;
    if (this.energy > PLAYER_MAX_ENERGY) {
      this.energy = PLAYER_MAX_ENERGY;
    }

    //SHIELD
    if (input_arr[PLAYER_INPUT_SHIELD]){
      this.shield_equipped = true;
    }
    else {
      this.shield_equipped = false;
    }

    if (this.shield_equipped) {
      this.shield -= PLAYER_SHIELD_USE_RATE * frame_time;
    }

    this.shield += PLAYER_SHIELD_REFRESH_RATE * frame_time;

    if (this.shield > PLAYER_MAX_SHIELD) {
      this.shield = PLAYER_MAX_SHIELD;
    }
    
    if (this.shield < 0) {
      this.health += this.shield;
      this.shield = 0;
    }

  }
  
  draw() {
    this.game_frame.fillStyle = this.color;
    this.game_frame.fillRect(this.x, this.y, this.width, this.height);
    this.draw_energy()
    this.draw_health();
    this.draw_shield();
  }
}



var p_input = new Input("human");
var p1 = new Player(canvas.width / 2 - dims / 2, bottom, c, p_input, 50);
var t1 = new Date().getTime();
var t2 = new Date().getTime();
var dt = null;


function animate(timestamp) {
  requestAnimationFrame(animate);
  t2 = new Date().getTime();
  dt = (t2 - t1) / 1000.0;
  t1 = t2;
  
  console.log(1.0/dt);
  p1.update(dt);
  for (var i in p1.projectiles){
    p1.projectiles[i].update();
  }
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = 'rgb(200,200,200)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  p1.draw();
  for (var i in p1.projectiles){
    p1.projectiles[i].draw();
  }
  
}
animate();
