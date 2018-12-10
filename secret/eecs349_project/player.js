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

    this.type = player_type.HUMAN;
    this.frames_per_input = 1;
    this.layers = 1;
    this.frame_skip = 1;
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
    this.input.evaluate();
    var input_arr = this.input.get();
    this.input.frame_buffer.add_action(this.input.map_values_to_action());
    
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
    
    if (this.x <= game_enum.GAME_LEFT_BOUNDARY) {
      this.x = 0;
      this.dx = 0;
    }

    if (this.x + this.width >= game_enum.GAME_RIGHT_BOUNDARY) {
      this.x = game_enum.GAME_RIGHT_BOUNDARY - this.width;
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
        var p = new Projectile(this.color, PROJECTILE_SIZE_LARGE, PROJECTILE_DMG_LARGE, this.x + this.width / 2.0, this.y + this.height / 2.0, this.player_direction, this.game_frame, Math.floor(this.input.frame_buffer.frame_count / this.input.frame_buffer.frame_skip))
        this.projectiles.push(p);
        this.energy -= PROJECTILE_REQ_LARGE;
      }
      else if (this.energy >= PROJECTILE_REQ_MEDIUM) {
        var p = new Projectile(this.color, PROJECTILE_SIZE_MEDIUM, PROJECTILE_DMG_MEDIUM, this.x + this.width / 2.0, this.y + this.height / 2.0, this.player_direction, this.game_frame, Math.floor(this.input.frame_buffer.frame_count / this.input.frame_buffer.frame_skip))
        this.projectiles.push(p);
        this.energy -= PROJECTILE_REQ_MEDIUM;
      }
      else if (this.energy >= PROJECTILE_REQ_SMALL) {
        var p = new Projectile(this.color, PROJECTILE_SIZE_SMALL, PROJECTILE_DMG_SMALL, this.x + this.width / 2.0, this.y + this.height / 2.0, this.player_direction, this.game_frame, Math.floor(this.input.frame_buffer.frame_count / this.input.frame_buffer.frame_skip))

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
