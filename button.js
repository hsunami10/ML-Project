class Button {
  constructor(game_canvas, x, y, width, height, title = 'Button', navigate_click = null, click_callback = null, font = '40px Arial', player = null, button_type = null, color = 'rgb(0,0,0)', hover_color = 'rgb(100,100,100)') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.title = title;
    this.font = font;
    this.color = color;
    this.hover_color = hover_color;
    this.game_canvas = game_canvas;
    this.player = player;
    this.button_type = button_type; // Has to equal a settings_menu.button_type property

    this.left_x = this.x;
    this.right_x = this.x + this.width;
    this.top_y = this.y;
    this.bottom_y = this.y + this.height;

    this.navigate_click = navigate_click;
    this.click_callback = click_callback;
  }

  isHovering() { // Offset of 10
    return mouse_position.x - 10 >= this.left_x && mouse_position.x - 10 <= this.right_x && mouse_position.y - 10 >= this.top_y && mouse_position.y - 10 <= this.bottom_y;
  }

  handleMouseClick() {
    if (this.isHovering()) {
      if (this.navigate_click) {
        game.set_game_state(this.navigate_click);
      } else {
        this.click_callback();
      }
    }
  }

  handleBorders() {
    var showBorder = false;
    switch (this.button_type) {
      case settings_menu.button_types.HUMAN:
        if (this.player === 'p1') {
          if (p1.type === player_type.HUMAN) {
            showBorder = true;
          }
        } else {
          if (p2.type === player_type.HUMAN) {
            showBorder = true;
          }
        }
        break;
      case settings_menu.button_types.AI:
        if (this.player === 'p1') {
          if (p1.type === player_type.AI) {
            showBorder = true;
          }
        } else {
          if (p2.type === player_type.AI) {
            showBorder = true;
          }
        }
        break;
      case settings_menu.button_types.FPI1:
        if (this.player === 'p1') {
          if (p1.frames_per_input === 1) {
            showBorder = true;
          }
        } else {
          if (p2.frames_per_input === 1) {
            showBorder = true;
          }
        }
        break;
      case settings_menu.button_types.FPI2:
        if (this.player === 'p1') {
          if (p1.frames_per_input === 2) {
            showBorder = true;
          }
        } else {
          if (p2.frames_per_input === 2) {
            showBorder = true;
          }
        }
        break;
      case settings_menu.button_types.FPI3:
        if (this.player === 'p1') {
          if (p1.frames_per_input === 3) {
            showBorder = true;
          }
        } else {
          if (p2.frames_per_input === 3) {
            showBorder = true;
          }
        }
        break;
      case settings_menu.button_types.FPI4:
        if (this.player === 'p1') {
          if (p1.frames_per_input === 4) {
            showBorder = true;
          }
        } else {
          if (p2.frames_per_input === 4) {
            showBorder = true;
          }
        }
        break;
      case settings_menu.button_types.LAYERS1:
        if (this.player === 'p1') {
          if (p1.layers === 1) {
            showBorder = true;
          }
        } else {
          if (p2.layers === 1) {
            showBorder = true;
          }
        }
        break;
      case settings_menu.button_types.LAYERS2:
        if (this.player === 'p1') {
          if (p1.layers === 2) {
            showBorder = true;
          }
        } else {
          if (p2.layers === 2) {
            showBorder = true;
          }
        }
        break;
      case settings_menu.button_types.LAYERS3:
        if (this.player === 'p1') {
          if (p1.layers === 3) {
            showBorder = true;
          }
        } else {
          if (p2.layers === 3) {
            showBorder = true;
          }
        }
        break;
      case settings_menu.button_types.F_SKIP1:
        if (this.player === 'p1') {
          if (p1.frame_skip === 1) {
            showBorder = true;
          }
        } else {
          if (p2.frame_skip === 1) {
            showBorder = true;
          }
        }
        break;
      case settings_menu.button_types.F_SKIP2:
        if (this.player === 'p1') {
          if (p1.frame_skip === 2) {
            showBorder = true;
          }
        } else {
          if (p2.frame_skip === 2) {
            showBorder = true;
          }
        }
        break;
      case settings_menu.button_types.F_SKIP3:
        if (this.player === 'p1') {
          if (p1.frame_skip === 3) {
            showBorder = true;
          }
        } else {
          if (p2.frame_skip === 3) {
            showBorder = true;
          }
        }
        break;
      case settings_menu.button_types.F_SKIP4:
        if (this.player === 'p1') {
          if (p1.frame_skip === 4) {
            showBorder = true;
          }
        } else {
          if (p2.frame_skip === 4) {
            showBorder = true;
          }
        }
        break;
      default:
        break;
    }
    var oldLineWidth = this.game_canvas.lineWidth;
    if (showBorder) {
      this.game_canvas.lineWidth = 10;
      this.game_canvas.strokeStyle = 'rgb(75, 175, 80)';
      this.game_canvas.strokeRect(this.x, this.y, this.width, this.height);
    }
    this.game_canvas.lineWidth = oldLineWidth;
  }

  draw() {
    this.handleBorders();
    if (this.isHovering()) {
      this.game_canvas.fillStyle = this.hover_color;
      this.game_canvas.fillRect(this.x, this.y, this.width, this.height);
    } else {
      this.game_canvas.fillStyle = this.color;
      this.game_canvas.fillRect(this.x, this.y, this.width, this.height);
    }

    this.game_canvas.font = this.font;
    this.game_canvas.fillStyle = 'rgb(255,255,255)';
    this.game_canvas.textAlign="center";
    this.game_canvas.textBaseline = "middle";
    this.game_canvas.fillText(this.title, this.x + this.width / 2, this.y + this.height / 2);

    this.game_canvas.fill();
  }
}
