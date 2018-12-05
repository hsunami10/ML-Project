const game_enum = {
  GAME_WIDTH: 1000, //pixels
  GAME_HEIGHT: 500, //pixels
  GAME_RIGHT_BOUNDARY: 1000,
  GAME_LEFT_BOUNDARY: 0
};

const states = {
  MAIN_MENU: 'main_menu',
  SETTINGS: 'settings',
  GAME_ON: 'game_on',
  GAME_OVER: 'game_over'
};

const main_menu = {
  BUTTON_WIDTH: 180,
  BUTTON_HEIGHT: 80,
  BUTTON_X: game_enum.GAME_WIDTH / 2 - 150 / 2
};

const P1_X_CENTER = game_enum.GAME_WIDTH / 4;
const P2_X_CENTER = game_enum.GAME_WIDTH / 2 + game_enum.GAME_WIDTH / 4;
const settings_menu = {
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
    LAYERS1: 'layers1',
    LAYERS2: 'layers2',
    LAYERS3: 'layers3',
    F_SKIP1: 'fskip1',
    F_SKIP2: 'fskip2',
    F_SKIP3: 'fskip3',
    F_SKIP4: 'fskip4',
    GAME_LEN1: 'game_length1',
    GAME_LEN2: 'game_length2',
    GAME_LEN3: 'game_length3'
  },
  button_positions: {
    human: {
      P1_X: P1_X_CENTER - 100,
      P2_X: P2_X_CENTER - 100,
      Y: 60
    },
    ai: {
      P1_X: P1_X_CENTER + 40,
      P2_X: P2_X_CENTER + 40,
      Y: 60
    },
    fpi: {
      P1_X1: P1_X_CENTER - 210,
      P1_X2: P1_X_CENTER - 90,
      P1_X3: P1_X_CENTER + 30,
      P1_X4: P1_X_CENTER + 150,

      P2_X1: P2_X_CENTER - 210,
      P2_X2: P2_X_CENTER - 90,
      P2_X3: P2_X_CENTER + 30,
      P2_X4: P2_X_CENTER + 150,
      Y: 140
    },
    layers: {
      P1_X1: P1_X_CENTER - 150,
      P1_X2: P1_X_CENTER - 30,
      P1_X3: P1_X_CENTER + 90,

      P2_X1: P2_X_CENTER - 150,
      P2_X2: P2_X_CENTER - 30,
      P2_X3: P2_X_CENTER + 90,
      Y: 220
    },
    frame_skips: {
      P1_X1: P1_X_CENTER - 210,
      P1_X2: P1_X_CENTER - 90,
      P1_X3: P1_X_CENTER + 30,
      P1_X4: P1_X_CENTER + 150,

      P2_X1: P2_X_CENTER - 210,
      P2_X2: P2_X_CENTER - 90,
      P2_X3: P2_X_CENTER + 30,
      P2_X4: P2_X_CENTER + 150,
      Y: 300
    },
    game_length: {
      X1: game_enum.GAME_WIDTH / 2 - 140,
      X2: game_enum.GAME_WIDTH / 2 - 30,
      X3: game_enum.GAME_WIDTH / 2 + 80,
      Y: 420
    }
  },
  title_positions: {
    fpi: {
      Y: 120
    },
    layers: {
      Y: 200
    },
    frame_skips: {
      Y: 280
    },
    game_length: {
      Y: 380
    }
  }
};

const player_type = {
  HUMAN: settings_menu.button_types.HUMAN,
  AI: settings_menu.button_types.AI
};
