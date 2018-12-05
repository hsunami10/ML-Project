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
    if (this.x > game_enum.GAME_RIGHT_BOUNDARY) {
      return false;
    }

    if (this.x < game_enum.GAME_LEFT_BOUNDARY) {
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
