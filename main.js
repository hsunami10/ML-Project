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

// Add mouse listeners
var mouse_position = { x: 0, y: 0 };
var mouse_move = function(e) {
  mouse_position.x = e.clientX;
  mouse_position.y = e.clientY;
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
var game = new Game(p1, p2, 10, c, 1, 0, 4);
var t1 = new Date().getTime();
var t2 = new Date().getTime();
var dt = null;

// Initialize buttons
// Main menu
var play_button = new Button(c, main_menu.BUTTON_X, 100, main_menu.BUTTON_WIDTH, main_menu.BUTTON_HEIGHT, 'Play', states.GAME_ON);
var settings_button = new Button(c, main_menu.BUTTON_X, 300, main_menu.BUTTON_WIDTH, main_menu.BUTTON_HEIGHT, 'Settings', states.SETTINGS);

// Settings
var back_button = new Button(c, settings_menu.back_button.X, settings_menu.back_button.Y, settings_menu.back_button.WIDTH, settings_menu.back_button.HEIGHT, 'Back', states.MAIN_MENU, null, '12px Arial');

// Player 1
var p1_human_type_button = new Button(c, 100, 100, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, 'Human', null, () => p1.type = player_type.HUMAN, '14px Arial', 'p1', settings_menu.button_types.HUMAN);
var p1_ai_type_button = new Button(c, 400, 100, settings_menu.type_button.WIDTH, settings_menu.type_button.HEIGHT, 'AI', null, () => p1.type = player_type.AI, '14px Arial', 'p1', settings_menu.button_types.AI);

game.start();

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
      p1_ai_type_button.handleMouseClick();
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
