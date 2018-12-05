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
