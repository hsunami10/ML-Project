class Input {

  constructor(input_type, layers, frames, frame_skip) {
    this.input_type = input_type;
    this.values = new Array(5);
    for (var i = 0; i < 5; i++){
      this.values[i] = 0;
    }
    this.network = DeepQNetwork(layers, frames, frame_skip);

  }

  update_layers(layers){
    this.network = DeepQNetwork(layers, this.network.frames, this.network.frame_skip);
  }

  update_frames(frames){
    this.network = DeepQNetwork(this.network.layers, frames, this.network.frame_skip);
  }

  update_frames(frame_skip){
    this.network = DeepQNetwork(this.network.layers, this.network.frames, frame_skip);
  }

  map_action_to_values(action){
    for (var i = 4; i >=0; i--){
      if (action >= Math.pow(2, i)){
        action = action - Math.pow(2, i);
        this.values[4 - i] = true;
      }
      else {
        this.values[4 - i] = false;
      }
    }
  }

  map_values_to_action(){
    var action = 0;
    for (var i = 4; i >= 0; i--){
      if(this.values[4 - i]){
        action += Math.pow(2, i);
      }
    }
    return action;
  }

  evaluate(state) {

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
    else if (this.input_type == "ai"){
      this.map_action_to_values(this.network.predict_action(state))
    }

  }

  get(){
    return this.values();
  }
}
