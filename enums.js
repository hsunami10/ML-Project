const game_enum = {
  GAME_WIDTH: 1000, //pixels
  GAME_HEIGHT: 500, //pixels
  GAME_RIGHT_BOUNDARY: this.GAME_WIDTH,
  GAME_LEFT_BOUNDARY: 0
};

const states = {
  MAIN_MENU: 'main_menu',
  SETTINGS: 'settings',
  GAME_ON: 'game_on',
  TRAINING: 'training',
  GAME_OVER: 'game_over'
};

const main_menu = {
  BUTTON_WIDTH: 180,
  BUTTON_HEIGHT: 80,
  BUTTON_X: game_enum.GAME_WIDTH / 2 - 150 / 2
};

const settings_menu = {
  P1_CENTER: game_enum.GAME_WIDTH / 4,
  P2_CENTER: game_enum.GAME_WIDTH / 4 + game_enum.GAME_WIDTH / 2,
  TITLE_Y: 30,
  type_button: {
    WIDTH: 60,
    HEIGHT: 40
  },
  back_button: {
    WIDTH: 40,
    HEIGHT: 30,
    X: 10,
    Y: 10
  },
  button_types: {
    HUMAN: 'human',
    AI: 'ai',
    FPI1: 'fpi1',
    FPI2: 'fpi2',
    FPI3: 'fpi3',
    FPI4: 'fpi4',
    LAYERS1: 'layers2',
    LAYERS2: 'layers2',
    LAYERS3: 'layers3',
    F_SKIP1: 'fskip1',
    F_SKIP2: 'fskip2',
    F_SKIP3: 'fskip3',
    F_SKIP4: 'fskip4'
  }
};

const player_type = {
  HUMAN: settings_menu.button_types.HUMAN,
  AI: settings_menu.button_types.AI
};
