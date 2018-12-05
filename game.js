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
    this.game_state = states.MAIN_MENU;
  }

  set_game_state(state) {
    this.game_state = state;
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
    this.p1.x = Math.random() * game_enum.GAME_WIDTH - this.p1.width;
    this.p2.x = Math.random() * game_enum.GAME_WIDTH - this.p2.width;
    this.p1.y = Math.random() * game_enum.GAME_HEIGHT / 2 + game_enum.GAME_HEIGHT / 2 + this.p1.height;
    this.p2.y = Math.random() * game_enum.GAME_HEIGHT / 2 + game_enum.GAME_HEIGHT / 2 + this.p2.height;

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
    this.game_canvas.fillText(t.toString(), game_enum.GAME_WIDTH / 2, 50);
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
    this.game_canvas.font = "10px Arial";
    this.game_canvas.fillStyle = 'rgb(255,255,255)';
    this.game_canvas.fillText("FPS: " + Math.floor(this.frame_rate).toString(), 950, 20);

    switch (this.game_state) {
      case states.MAIN_MENU:
        play_button.draw();
        settings_button.draw();
        break;
      case states.SETTINGS:
        // Draw titles
        this.game_canvas.font = '40px Arial';
        this.game_canvas.fillStyle = 'rgb(0,0,0)';
        this.game_canvas.textAlign="center";
        this.game_canvas.textBaseline = "middle";
        this.game_canvas.fillText('P1', P1_X_CENTER, settings_menu.TITLE_Y);
        this.game_canvas.fillText('P2', P2_X_CENTER, settings_menu.TITLE_Y);
        this.game_canvas.font = '18px Arial';
        this.game_canvas.fillText('Frames Per Input', P1_X_CENTER, settings_menu.title_positions.fpi.Y);
        this.game_canvas.fillText('Frames Per Input', P2_X_CENTER, settings_menu.title_positions.fpi.Y);
        this.game_canvas.fillText('Number of Layers', P1_X_CENTER, settings_menu.title_positions.layers.Y);
        this.game_canvas.fillText('Number of Layers', P2_X_CENTER, settings_menu.title_positions.layers.Y);
        this.game_canvas.fillText('Frame Skips', P1_X_CENTER, settings_menu.title_positions.frame_skips.Y);
        this.game_canvas.fillText('Frame Skips', P2_X_CENTER, settings_menu.title_positions.frame_skips.Y);
        this.game_canvas.fillText('Game Length', game_enum.GAME_WIDTH / 2, settings_menu.title_positions.game_length.Y);

        back_button.draw();
        p1_human_type_button.draw();
        p2_human_type_button.draw();
        p1_ai_type_button.draw();
        p2_ai_type_button.draw();

        p1_fpi1_button.draw();
        p1_fpi2_button.draw();
        p1_fpi3_button.draw();
        p1_fpi4_button.draw();
        p2_fpi1_button.draw();
        p2_fpi2_button.draw();
        p2_fpi3_button.draw();
        p2_fpi4_button.draw();

        p1_layers1_button.draw();
        p1_layers2_button.draw();
        p1_layers3_button.draw();
        p2_layers1_button.draw();
        p2_layers2_button.draw();
        p2_layers3_button.draw();

        p1_fskip1_button.draw();
        p1_fskip2_button.draw();
        p1_fskip3_button.draw();
        p1_fskip4_button.draw();
        p2_fskip1_button.draw();
        p2_fskip2_button.draw();
        p2_fskip3_button.draw();
        p2_fskip4_button.draw();

        game_length1_button.draw();
        game_length2_button.draw();
        game_length3_button.draw();
        break;
      case states.GAME_ON:
        this.p1.draw();
        this.p2.draw();

        this.draw_time();

        if (this.game_ended != null) {
          var dt = new Date().getTime();
          dt = (dt - this.game_ended) / 1000.0;

          var alpha = GAME_OVER_FADE_MAX  / (1 + Math.exp(-GAME_OVER_FADE_RATE*(dt - GAME_OVER_FADE_OFFSET))).toString();
          this.game_canvas.textAlign = "center";
          this.game_canvas.font = "45px Arial";
          this.game_canvas.fillStyle = 'rgba(0,0,0,' + alpha + ')';
          this.game_canvas.fillText(this.winner + " wins!", game_enum.GAME_WIDTH / 2 , game_enum.GAME_HEIGHT / 3);

        }
        break;
      case states.GAME_OVER:
        break;
      default:
        return;
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
