var GAME_WIDTH = 1000; //pixels
var GAME_HEIGHT = 500; //pixels
var GAME_RIGHT_BOUNDARY = GAME_WIDTH;
var GAME_LEFT_BOUNDARY = 0;


var ACCEL_GRAVITY = -3000; //pixels per second

var PLAYER_HEIGHT = 50; //pixels
var PLAYER_WIDTH = 50; //pixels

var GAME_BOTTOM_BOUNDARY = GAME_HEIGHT - PLAYER_HEIGHT;

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
var PLAYER_EYE_COLOR = "rgb(0,0,0)"
var PLAYER_ONE_START_X = GAME_WIDTH / 2 - 200;
var PLAYER_TWO_START_X = GAME_WIDTH / 2 + 200;
var PLAYER_START_Y = GAME_BOTTOM_BOUNDARY;

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


var HUMAN_KEY_LEFT2 = "KeyA";
var HUMAN_KEY_RIGHT2 = "KeyD";
var HUMAN_KEY_JUMP2 = "KeyW";
var HUMAN_KEY_SHOOT2 = "KeyC";
var HUMAN_KEY_SHIELD2 = "KeyS"

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


var GAME_OVER_FADE_RATE = 1;
var GAME_OVER_FADE_OFFSET = 2;
var GAME_OVER_FADE_MAX = 1;

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
    else if (this.input_type == "human2") {
      input_arr[PLAYER_INPUT_LEFT] = keys[HUMAN_KEY_LEFT2];
      input_arr[PLAYER_INPUT_RIGHT] = keys[HUMAN_KEY_RIGHT2];
      input_arr[PLAYER_INPUT_JUMP] = keys[HUMAN_KEY_JUMP2];
      input_arr[PLAYER_INPUT_SHIELD] = keys[HUMAN_KEY_SHIELD2];
      input_arr[PLAYER_INPUT_SHOOT] = keys[HUMAN_KEY_SHOOT2];
    }
    else {
      input_arr[PLAYER_INPUT_SHOOT] = false;
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
    this.visible = true;
    
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
    if (this.visible) { 
      this.game_frame.beginPath();
      this.game_frame.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
      this.game_frame.fillStyle = this.color;
      this.game_frame.fill();
      this.game_frame.lineWidth = 5;
      this.game_frame.strokeStyle = '#003300';
      this.game_frame.stroke();
    }
    
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
    this.game_frame.strokeStyle = '#000000';
    var y = INFO_BAR_SEP;
    var length = this.health / PLAYER_HP * INFO_BAR_WIDTH;
    this.game_frame.lineWidth = 1;
    this.game_frame.fillStyle = INFO_HEALTH_COLOR;
    this.game_frame.fillRect(this.info, y, length, INFO_BAR_HEIGHT);

    this.game_frame.fillStyle = INFO_OUTLINE_COLOR;
    this.game_frame.strokeRect(this.info, y, INFO_BAR_WIDTH, INFO_BAR_HEIGHT);
    
  }

  draw_energy() {
    this.game_frame.strokeStyle = '#000000';
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
    this.game_frame.strokeStyle = '#000000';
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
      if (this.health < 0){
        this.health = 0;
      }
    }

    for (var i in this.projectiles){
      this.projectiles[i].update();
    }

  }
  
  draw_equipped_shield(){
    this.game_frame.beginPath();
    this.game_frame.arc(this.x + this.width/2, this.y + this.height/2, this.width/Math.sqrt(2), 0, 2 * Math.PI, false);
    this.game_frame.fillStyle = "rgba(0,0,255,0.5)";
    this.game_frame.fill();
    this.game_frame.lineWidth = 3;
    this.game_frame.strokeStyle = '#0000ff';
    this.game_frame.stroke();
  }

  draw() {
    
    this.game_frame.fillStyle = this.color;
    this.game_frame.fillRect(this.x, this.y, this.width, this.height);
    

    this.game_frame.fillStyle = PLAYER_EYE_COLOR;
    this.game_frame.beginPath();
    if (this.player_direction > 0){
      this.game_frame.beginPath();
      this.game_frame.arc(this.x + 0.75 * this.width, this.y + 0.25 * this.height, this.width / 8.0, 0, 2 * Math.PI, false);
      this.game_frame.fill();
      this.game_frame.beginPath();
      this.game_frame.arc(this.x + 0.75 * this.width, this.y + 0.75 * this.height, this.width / 8.0, 0, 2 * Math.PI, false);
      this.game_frame.fill();
    }
    else {
      this.game_frame.beginPath();
      this.game_frame.arc(this.x + 0.25 * this.width, this.y + 0.25 * this.height, this.width / 8.0, 0, 2 * Math.PI, false);
      this.game_frame.fill();
      this.game_frame.beginPath();
      this.game_frame.arc(this.x + 0.25 * this.width, this.y + 0.75 * this.height, this.width / 8.0, 0, 2 * Math.PI, false);
      this.game_frame.fill();
    }
    
    this.game_frame.fill();
    this.draw_energy()
    this.draw_health();
    this.draw_shield();
    if (this.shield_equipped){
      this.draw_equipped_shield();
    }
    for (var i in this.projectiles){
      this.projectiles[i].draw();
    }
  }
}



class Game {
  constructor(p1, p2, game_length, game_canvas, frame_skip, reward_shift, frame_hold) {
    this.p1 = p1;
    this.p2 = p2;
    this.frame_skip = frame_skip;
    this.frame_val = 0;
    this.frame_hold = frame_hold;
    this.game_length = game_length;
    this.game_start = game_length;
    this.game_on = false;
    this.game_canvas = game_canvas;
    this.frame_rate = 30.0;
    this.game_ended = null;
    this.winner = null;
    this.p1_buffer = [];
    this.p2_buffer = [];
    
  }
  get_projectiles(player){
    var proj_1x = 0;
    var proj_2x = 0;
    var proj_1y = 0;
    var proj_2y = 0;
    var proj_1s = 0;
    var proj_2s = 0;
    var proj_1v = 0;
    var proj_2v = 0;
    if (player.projectiles.length == 0){
      proj_1x = player.x;
      proj_1y = player.y;
      proj_2x = player.x;
      proj_2y = player.y;
      proj_1v = player.player_direction * PROJECTILE_SPEED;
      proj_2v = player.player_direction * PROJECTILE_SPEED;
      proj_2s = PROJECTILE_SIZE_SMALL;
      if (player.energy>=PROJECTILE_REQ_LARGE){
        proj_1s = PROJECTILE_SIZE_LARGE;
        
      }
      else if (player.energy >= PROJECTILE_REQ_MEDIUM){
        proj_1s = PROJECTILE_SIZE_MEDIUM;
      }
      else{
        proj_1s = PROJECTILE_SIZE_SMALL;
      }

    }
    else if(player.projectiles.length == 1){
      
      proj_1x = player.projectiles[0].x;
      proj_1y = player.projectiles[0].y;
      proj_1v = player.projectiles[0].direction * PROJECTILE_SPEED
      proj_1s = player.projectiles[0].size;
      

      proj_2x = player.x;
      proj_2y = player.y;
      proj_2v = player.player_direction * PROJECTILE_SPEED;
      if (player.energy>=PROJECTILE_REQ_LARGE){
        proj_2s = PROJECTILE_SIZE_LARGE;
        
      }
      else if (player.energy >= PROJECTILE_REQ_MEDIUM){
        proj_2s = PROJECTILE_SIZE_MEDIUM;
      }
      else{
        proj_2s = PROJECTILE_SIZE_SMALL;
      }
    }
    else {
      proj_1x = player.projectiles[0].x;
      proj_1y = player.projectiles[0].y;
      proj_1v = player.projectiles[0].direction * PROJECTILE_SPEED
      proj_1s = player.projectiles[0].size;

      proj_2x = player.projectiles[1].x;
      proj_2y = player.projectiles[1].y;
      proj_2v = player.projectiles[1].direction * PROJECTILE_SPEED
      proj_2s = player.projectiles[1].size;

    }


    return [proj_1x, proj_1y, proj_1v, proj_1s, proj_2x, proj_2y, proj_2v, proj_2s];
  }
  state(p1, p2){
    
    var game_state1 = [
      p1.x, 
      p1.y, 
      p1.dx, 
      p1.dy, 
      p1.health, 
      p1.shield, 
      p1.energy, 
      p1.shield_equipped? 1 : 0];

    game_state1 = game_state1.concat(this.get_projectiles(p1));

    
    var game_state2 = [p2.x, 
      p2.y, 
      p2.dx, 
      p2.dy, 
      p2.health, 
      p2.shield, 
      p2.energy, 
      p2.shield_equipped? 1: 0];

    game_state2 = game_state2.concat(this.get_projectiles(p2));
    game_state1 = game_state1.concat(game_state2);

    return game_state1;

  }

  randomize(){
    this.p1.x = Math.random() * GAME_WIDTH - this.p1.width;
    this.p2.x = Math.random() * GAME_WIDTH - this.p2.width;
    this.p1.y = Math.random() * GAME_HEIGHT / 2 + GAME_HEIGHT / 2 + this.p1.height;
    this.p2.y = Math.random() * GAME_HEIGHT / 2 + GAME_HEIGHT / 2 + this.p2.height;

    this.p1.dx = Math.random() * MAX_PLAYER_SPEED * 2 - MAX_PLAYER_SPEED;
    this.p2.dx = Math.random() * MAX_PLAYER_SPEED * 2 - MAX_PLAYER_SPEED;



  }

  update(frame_time) {
    this.frame_val++;
    if (this.frame_val % this.frame_skip == 0){
      this.p1_buffer.push(this.state(this.p1, this.p2));
      this.p2_buffer.push(this.state(this.p2, this.p1));
    }
    if (this.game_on) {
      this.detect_collisions();
    }
    
    this.p1.update(frame_time);
    this.p2.update(frame_time);
    
    var result = this.check_winner();
    if (result != null && this.game_on){
      this.game_on = false;
      this.p1.input.input_type = "dead";
      this.p2.input.input_type = "dead";
      this.game_ended = new Date().getTime();
      if (result == this.p1) {
        this.winner = "Player 1";
      }
      else if (result == this.p2) {
        this.winner = "Player 2";
      }
      else {
        this.winner = "No one"
      }
      
    }
    
    if (frame_time > 0) {
      this.frame_rate = 0.9 * this.frame_rate + 0.1 / frame_time;
    }
  }


  handle_collision(player, projectile){
    projectile.visible = false;
    if (player.shield_equipped){
      
      player.shield -= projectile.damage;
      if (player.shield < 0) {
        player.health += player.health
        if (player.health < 0) {
          player.health = 0;
        }
        player.shield = 0;
      }
    }
    else {
      player.health -= projectile.damage;
      if (player.health < 0){
        player.health = 0;
      }
    }
  }

  detect_collisions() {
    for (var i in this.p1.projectiles) {
      if (this.is_colliding(this.p2, this.p1.projectiles[i])) {
          this.handle_collision(this.p2, this.p1.projectiles[i]);
      }
    }

    for (var i in this.p2.projectiles) {
      if (this.is_colliding(this.p1, this.p2.projectiles[i])) {
          this.handle_collision(this.p1, this.p2.projectiles[i]);
      }
    }
  }

  draw_time(){
    var t = new Date().getTime();
    t =  Math.floor(100 * (this.game_length + (this.game_start - t) / 1000)) / 100;
    if (t < 0){
      t = 0;
    }
    
    this.textAlign = "center";
    this.game_canvas.font = "30px Arial";
    this.game_canvas.fillStyle = "rgb(0,0,0)";
    this.game_canvas.fillText(t.toString(), GAME_WIDTH / 2, 50);
  }

  is_colliding(player, projectile) {
    if (!projectile.visible)
    {
      return false;
    }
    var x = player.x + player.width / 2;
    var y = player.y + player.height / 2;
    var r = Math.sqrt(player.width * player.height) / 2;
    var x2 = projectile.x;
    var  y2 = projectile.y;
    var r2 = projectile.size;

    return Math.sqrt(Math.pow((x2 - x), 2) + Math.pow((y2 - y), 2)) < r + r2;
  }

  check_winner(){
    var t = new Date().getTime();
    t = (t - this.game_start) / 1000;
    if(t > this.game_length) {
      if(this.p1.health > this.p2.health){
        return this.p1;
      }
      else if (this.p2.health > this.p1.health){
        return this.p2;
      }
      else {
        return "Draw"
      }
    }
    if (this.p1.health == 0){
      return this.p2;
    }
    if (this.p2.health == 0){
      return this.p1;
    }

    return null;
  }

  draw() {
    
    this.game_canvas.clearRect(0, 0, canvas.width, canvas.height);
    this.game_canvas.fillStyle = 'rgb(200,200,200)';
    this.game_canvas.fillRect(0, 0, canvas.width, canvas.height);
    this.p1.draw();
    this.p2.draw();
    this.game_canvas.font = "10px Arial";
    this.game_canvas.fillStyle = 'rgb(255,255,255)';
    this.game_canvas.fillText("FPS: " + Math.floor(this.frame_rate).toString(), 950, 20);

    this.draw_time();

    if (this.game_ended != null) {
      var dt = new Date().getTime();
      dt = (dt - this.game_ended) / 1000.0;
      
      var alpha = GAME_OVER_FADE_MAX  / (1 + Math.exp(-GAME_OVER_FADE_RATE*(dt - GAME_OVER_FADE_OFFSET))).toString();
      this.game_canvas.textAlign = "center";
      this.game_canvas.font = "45px Arial";
      this.game_canvas.fillStyle = 'rgba(0,0,0,' + alpha + ')';
      this.game_canvas.fillText(this.winner + " wins!", GAME_WIDTH / 2 , GAME_HEIGHT / 3);
      
    }
    
    
  }

  start(){
    this.p1_buffer = [];
    this.p2_buffer = [];
    for(var i = 0; i < this.frame_hold; i++){
      this.p1_buffer.push(this.state(this.p1, this.p2));
      this.p2_buffer.push(this.state(this.p2, this.p1));
    }
    this.frame_val = 0;
    this.game_on = true;
    this.game_start = new Date().getTime();
  }


  reset(){
    this.game_on = false;
    this.game_start = game_length;
    this.p1 = new Player(PLAYER_ONE_START_X, PLAYER_START_Y, this.game_canvas, this.p1.input, 50);
    this.p2 = new Player(PLAYER_TWO_START_X, PLAYER_START_Y, this.game_canvas, this.p2.input, 710);
  }
}

var p_input = new Input("human");
var p_input2 = new Input("human2");
var p1 = new Player(PLAYER_ONE_START_X, PLAYER_START_Y, c, p_input, 50);
var p2 = new Player(PLAYER_TWO_START_X, PLAYER_START_Y, c, p_input2, 710);
var game = new Game(p1, p2, 10, c, 1, 0, 4);
var t1 = new Date().getTime();
var t2 = new Date().getTime();
var dt = null;
game.randomize();
game.start();


function animate(timestamp) {
  requestAnimationFrame(animate);
  t2 = new Date().getTime();
  dt = (t2 - t1) / 1000.0;
  t1 = t2;
  
  
  game.update(dt);
  game.draw();
 
  
}
animate();
