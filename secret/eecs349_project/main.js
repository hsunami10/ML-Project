var ACCEL_GRAVITY = -3000; //pixels per second

var PLAYER_HEIGHT = 50; //pixels
var PLAYER_WIDTH = 50; //pixels

var GAME_BOTTOM_BOUNDARY = game_enum.GAME_HEIGHT - PLAYER_HEIGHT;

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
var PLAYER_ONE_START_X = game_enum.GAME_WIDTH / 2 - 200;
var PLAYER_TWO_START_X = game_enum.GAME_WIDTH / 2 + 200;
var PLAYER_START_Y = GAME_BOTTOM_BOUNDARY;

//array locs for the input types
var PLAYER_INPUT_LEFT = 0;
var PLAYER_INPUT_RIGHT = 1;
var PLAYER_INPUT_JUMP = 2;
var PLAYER_INPUT_SHOOT = 3;
var PLAYER_INPUT_SHIELD = 4;

var HUMAN_KEY_LEFT = "KeyA";
var HUMAN_KEY_RIGHT = "KeyD";
var HUMAN_KEY_JUMP = "KeyW";
var HUMAN_KEY_SHOOT = "KeyC";
var HUMAN_KEY_SHIELD = "KeyS"


var HUMAN_KEY_LEFT2 = "KeyJ";
var HUMAN_KEY_RIGHT2 = "KeyL";
var HUMAN_KEY_JUMP2 = "KeyI";
var HUMAN_KEY_SHOOT2 = "KeyN";
var HUMAN_KEY_SHIELD2 = "KeyK"

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
  switch(e.keyCode){
    case 37: case 39: case 38:  case 40: // Arrow keys
    case 32: e.preventDefault(); break; // Space
    default: break; // do not block other keys
  }
}
var doc = document.documentElement;
var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
var top2 = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
console.log(left);
console.log(top2);
document.addEventListener('keydown', keylistener);
document.addEventListener('keyup', keylistener);
var rect = document.getElementById('canvas').getBoundingClientRect();
// Add mouse listeners
var mouse_position = { x: 0, y: 0 };
var mouse_move = function(e) {
  top2 = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
  left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
  mouse_position.x = e.clientX - rect.left + left;
  mouse_position.y = e.clientY - rect.top + top2;
  
}
var mouse_up = function(e) {
  mouse_move(e);
  onMouseDown();
}
document.addEventListener('mousemove', mouse_move);
document.addEventListener('mouseup', mouse_up);

var p_input = new Input("human", 1, 1, 1);
var p_input2 = new Input("human2", 1, 1, 1);
var p1 = new Player(PLAYER_ONE_START_X, PLAYER_START_Y, c, p_input, 50);
var p2 = new Player(PLAYER_TWO_START_X, PLAYER_START_Y, c, p_input2, 710);
var game = new Game(p1, p2, 30, c, 1, 0, 4);
var t1 = new Date().getTime();
var t2 = new Date().getTime();
var dt = null;

// Initialize buttons
// Main menu
var play_button = new Button(c, main_menu.BUTTON_X, 100, main_menu.BUTTON_WIDTH, main_menu.BUTTON_HEIGHT, 'Play', states.GAME_ON, () => game.start());
var settings_button = new Button(c, main_menu.BUTTON_X, 300, main_menu.BUTTON_WIDTH, main_menu.BUTTON_HEIGHT, 'Settings', states.SETTINGS);

// Settings
var back_button = new Button(c, settings_menu.back_button.X, settings_menu.back_button.Y, settings_menu.back_button.WIDTH, settings_menu.back_button.HEIGHT, 'Back', states.MAIN_MENU, null, '12px Arial');


// Player 1
var p1_human_type_button = new Button(c, 100, 100, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, 'Human', null, () => p1.type = player_type.HUMAN, '14px Arial', 'p1', settings_menu.button_types.HUMAN);
var p1_ai_type_button = new Button(c, 400, 100, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, 'AI', null, () => p1.type = player_type.AI, '14px Arial', 'p1', settings_menu.button_types.AI);



// Player type
var p1_human_type_button = new Button(c, settings_menu.button_positions.human.P1_X, settings_menu.button_positions.human.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, 'Human', null, () => p1.input.input_type = player_type.HUMAN, '14px Arial', 'p1', settings_menu.button_types.HUMAN);
var p2_human_type_button = new Button(c, settings_menu.button_positions.human.P2_X, settings_menu.button_positions.human.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, 'Human', null, () => p2.input.input_type = player_type.HUMAN2, '14px Arial', 'p2', settings_menu.button_types.HUMAN);
var p1_ai_type_button = new Button(c, settings_menu.button_positions.ai.P1_X, settings_menu.button_positions.ai.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, 'AI', null, () => p1.input.input_type = player_type.AI, '14px Arial', 'p1', settings_menu.button_types.AI);
var p2_ai_type_button = new Button(c, settings_menu.button_positions.ai.P2_X, settings_menu.button_positions.ai.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, 'AI', null, () => p2.input.input_type = player_type.AI, '14px Arial', 'p2', settings_menu.button_types.AI);

// Frames per input
var p1_fpi1_button = new Button(c, settings_menu.button_positions.fpi.P1_X1, settings_menu.button_positions.fpi.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '1', null, () => p1.input.update_frames(1), '14px Arial', 'p1', settings_menu.button_types.FPI1);
var p1_fpi2_button = new Button(c, settings_menu.button_positions.fpi.P1_X2, settings_menu.button_positions.fpi.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '2', null, () => p1.input.update_frames(2), '14px Arial', 'p1', settings_menu.button_types.FPI2);
var p1_fpi3_button = new Button(c, settings_menu.button_positions.fpi.P1_X3, settings_menu.button_positions.fpi.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '3', null, () => p1.input.update_frames(3), '14px Arial', 'p1', settings_menu.button_types.FPI3);
var p1_fpi4_button = new Button(c, settings_menu.button_positions.fpi.P1_X4, settings_menu.button_positions.fpi.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '4', null, () => p1.input.update_frames(4), '14px Arial', 'p1', settings_menu.button_types.FPI4);

var p2_fpi1_button = new Button(c, settings_menu.button_positions.fpi.P2_X1, settings_menu.button_positions.fpi.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '1', null, () => p2.input.update_frames(1), '14px Arial', 'p2', settings_menu.button_types.FPI1);
var p2_fpi2_button = new Button(c, settings_menu.button_positions.fpi.P2_X2, settings_menu.button_positions.fpi.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '2', null, () => p2.input.update_frames(2), '14px Arial', 'p2', settings_menu.button_types.FPI2);
var p2_fpi3_button = new Button(c, settings_menu.button_positions.fpi.P2_X3, settings_menu.button_positions.fpi.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '3', null, () => p2.input.update_frames(3), '14px Arial', 'p2', settings_menu.button_types.FPI3);
var p2_fpi4_button = new Button(c, settings_menu.button_positions.fpi.P2_X4, settings_menu.button_positions.fpi.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '4', null, () => p2.input.update_frames(4), '14px Arial', 'p2', settings_menu.button_types.FPI4);

var p1_layers1_button = new Button(c, settings_menu.button_positions.layers.P1_X1, settings_menu.button_positions.layers.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '1', null, () => p1.input.update_layers(1), '14px Arial', 'p1', settings_menu.button_types.LAYERS1);
var p1_layers2_button = new Button(c, settings_menu.button_positions.layers.P1_X2, settings_menu.button_positions.layers.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '2', null, () => p1.input.update_layers(2), '14px Arial', 'p1', settings_menu.button_types.LAYERS2);
var p1_layers3_button = new Button(c, settings_menu.button_positions.layers.P1_X3, settings_menu.button_positions.layers.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '3', null, () => p1.input.update_layers(3), '14px Arial', 'p1', settings_menu.button_types.LAYERS3);

var p2_layers1_button = new Button(c, settings_menu.button_positions.layers.P2_X1, settings_menu.button_positions.layers.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '1', null, () => p2.input.update_layers(1), '14px Arial', 'p2', settings_menu.button_types.LAYERS1);
var p2_layers2_button = new Button(c, settings_menu.button_positions.layers.P2_X2, settings_menu.button_positions.layers.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '2', null, () => p2.input.update_layers(2), '14px Arial', 'p2', settings_menu.button_types.LAYERS2);
var p2_layers3_button = new Button(c, settings_menu.button_positions.layers.P2_X3, settings_menu.button_positions.layers.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '3', null, () => p2.input.update_layers(3), '14px Arial', 'p2', settings_menu.button_types.LAYERS3);

// Frame skips
var p1_fskip1_button = new Button(c, settings_menu.button_positions.frame_skips.P1_X1, settings_menu.button_positions.frame_skips.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '1', null, () => p1.input.update_frames_skip(1), '14px Arial', 'p1', settings_menu.button_types.F_SKIP1);
var p1_fskip2_button = new Button(c, settings_menu.button_positions.frame_skips.P1_X2, settings_menu.button_positions.frame_skips.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '2', null, () => p1.input.update_frames_skip(2), '14px Arial', 'p1', settings_menu.button_types.F_SKIP2);
var p1_fskip3_button = new Button(c, settings_menu.button_positions.frame_skips.P1_X3, settings_menu.button_positions.frame_skips.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '3', null, () => p1.input.update_frames_skip(3), '14px Arial', 'p1', settings_menu.button_types.F_SKIP3);
var p1_fskip4_button = new Button(c, settings_menu.button_positions.frame_skips.P1_X4, settings_menu.button_positions.frame_skips.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '4', null, () => p1.input.update_frames_skip(4), '14px Arial', 'p1', settings_menu.button_types.F_SKIP4);

var p2_fskip1_button = new Button(c, settings_menu.button_positions.frame_skips.P2_X1, settings_menu.button_positions.frame_skips.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '1', null, () => p2.input.update_frames_skip(1), '14px Arial', 'p2', settings_menu.button_types.F_SKIP1);
var p2_fskip2_button = new Button(c, settings_menu.button_positions.frame_skips.P2_X2, settings_menu.button_positions.frame_skips.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '2', null, () => p2.input.update_frames_skip(2), '14px Arial', 'p2', settings_menu.button_types.F_SKIP2);
var p2_fskip3_button = new Button(c, settings_menu.button_positions.frame_skips.P2_X3, settings_menu.button_positions.frame_skips.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '3', null, () => p2.input.update_frames_skip(3), '14px Arial', 'p2', settings_menu.button_types.F_SKIP3);
var p2_fskip4_button = new Button(c, settings_menu.button_positions.frame_skips.P2_X4, settings_menu.button_positions.frame_skips.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '4', null, () => p2.input.update_frames_skip(4), '14px Arial', 'p2', settings_menu.button_types.F_SKIP4);

// Game length buttons
var game_length1_button = new Button(c, settings_menu.button_positions.game_length.X1, settings_menu.button_positions.game_length.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '15 sec', null, () => game.game_length = 15, '14px Arial', '', settings_menu.button_types.GAME_LEN1);
var game_length2_button = new Button(c, settings_menu.button_positions.game_length.X2, settings_menu.button_positions.game_length.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '30 sec', null, () => game.game_length = 30, '14px Arial', '', settings_menu.button_types.GAME_LEN2);
var game_length3_button = new Button(c, settings_menu.button_positions.game_length.X3, settings_menu.button_positions.game_length.Y, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, '45 sec', null, () => game.game_length = 45, '14px Arial', '', settings_menu.button_types.GAME_LEN3);


// Handle mouse clicks - handle navigation
function onMouseDown() {
  switch (game.game_state) {
    case states.MAIN_MENU:
      play_button.handleMouseClick();
      settings_button.handleMouseClick();
      break;
    case states.SETTINGS:
      back_button.handleMouseClick();
      p1_human_type_button.handleMouseClick();
      p2_human_type_button.handleMouseClick();
      p1_ai_type_button.handleMouseClick();
      p2_ai_type_button.handleMouseClick();

      p1_fpi1_button.handleMouseClick();
      p1_fpi2_button.handleMouseClick();
      p1_fpi3_button.handleMouseClick();
      p1_fpi4_button.handleMouseClick();
      p2_fpi1_button.handleMouseClick();
      p2_fpi2_button.handleMouseClick();
      p2_fpi3_button.handleMouseClick();
      p2_fpi4_button.handleMouseClick();

      p1_layers1_button.handleMouseClick();
      p1_layers2_button.handleMouseClick();
      p1_layers3_button.handleMouseClick();
      p2_layers1_button.handleMouseClick();
      p2_layers2_button.handleMouseClick();
      p2_layers3_button.handleMouseClick();

      p1_fskip1_button.handleMouseClick();
      p1_fskip2_button.handleMouseClick();
      p1_fskip3_button.handleMouseClick();
      p1_fskip4_button.handleMouseClick();
      p2_fskip1_button.handleMouseClick();
      p2_fskip2_button.handleMouseClick();
      p2_fskip3_button.handleMouseClick();
      p2_fskip4_button.handleMouseClick();

      game_length1_button.handleMouseClick();
      game_length2_button.handleMouseClick();
      game_length3_button.handleMouseClick();
      break;
    case states.GAME_ON:
      break;
    case states.GAME_OVER:
      break;
    default:
      return;
  }
}

function animate(timestamp) {
  requestAnimationFrame(animate);
  t2 = new Date().getTime();
  dt = (t2 - t1) / 1000.0;
  t1 = t2;

  game.update(dt);
  game.draw();
}
animate();
