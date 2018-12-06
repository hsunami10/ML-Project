SERVER_PATH = "http://localhost:3001/"
SAVE_ADDRESS_PATH = "api/eecs349_project/save"
LOAD_MODEL_PATH = "api/eecs349_project/load_model"
LOAD_WEIGHTS_PATH = "api/eecs349_project/load_weights"
CHECK_LOAD = "api/eecs349_project/check_load"
CHECK_TRAIN_TIME = "api/eecs349_project/get_time"

HIDDEN_UNITS = 32;
ACTIONS = 32;
FRAME_SIZE = 32;
DISCOUNT_RATE = 0.9;
EXPLORATION_RATE = 0.03;
LEARNING_RATE = 0.05;

class DeepQNetwork {
  constructor(layers, frames, frame_skip) {
    this.actions = ACTIONS;
    this.layers = layers;
    this.frames = frames;
    this.frame_skip = frame_skip;
    this.name = "Network_" + frames.toString() + "_" + frame_skip.toString() + "_" + layers.toString();
    this.training_time = 0
    this.optimizer = tf.train.sgd(LEARNING_RATE);
    this.is_loading = false;
    this.create_network();

    this.is_loadable()
      .then(response => {
        if (response.data) {
          this.load();
          this.create_network();
        }
      })
      .catch(error => {
        console.error(error);
        alert(error);
      })
  }

  create_network() {

    this.hidden_layers = new Array();
    this.inputs = tf.input({
      shape: this.frames * FRAME_SIZE
    });

    this.hidden_layers.push(this.inputs);
    for (var i = 0; i < this.layers; i++) {
      var new_layer = tf.layers.elu({
        units: HIDDEN_UNITS
      }).apply(this.hidden_layers[i]);
      this.hidden_layers.push(new_layer);
    }
    this.q_out = tf.layers.dense({
      units: ACTIONS
    }).apply(this.hidden_layers[this.layers]);
    this.model = tf.model({
      inputs: this.inputs,
      outputs: this.q_out
    });

  }


  predict_q(state) {
    var q = this.model.predict(tf.tensor2d(state, [1, this.frames * FRAME_SIZE]));
    return q;
  }


  train_one(e) {
    var q_guess = this.predict_q(e.state);
    var actual_q = q_guess.dataSync();
    var maxQPrime = tf.max(this.predict_q(e.state2));
    var new_reward = e.reward + DISCOUNT_RATE * maxQPrime;
    actual_q[e.action] = new_reward;
    var q_actual = tf.tensor1d(actual_q);

    this.optimizer.minimize(() => {
      const p = this.predict_q(e.state);
      return p.sub(q_actual).square().mean();
    })

  }

  predict_action(state) {
    var action = this.predict_q(state).argMax(1).dataSync();

    return action[0];
  }


  save() {
    this.model.save(`${SERVER_PATH + SAVE_ADDRESS_PATH}?name=${this.name}&time=${this.training_time}`);
  }

  getModel() {
    return axios.get(`${SERVER_PATH + LOAD_MODEL_PATH}?name=${this.name}`, { responseType: 'blob' });
  }
  getWeights() {
    return axios.get(`${SERVER_PATH + LOAD_WEIGHTS_PATH}?name=${this.name}`, { responseType: 'blob' });
  }

  // Convert Blob to File object
  blobToFile(theBlob, fileName) {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }

  // NOTE: Old and new models have the same weights?
  load() {
    this.is_loading = true;
    console.log('initial model: ', this.model);
    axios.all([this.getModel(), this.getWeights()])
      .then(axios.spread((modelResponse, weightsResponse) => {
        this.is_loading = false;
        tf.loadModel(tf.io.browserFiles([
          this.blobToFile(modelResponse.data, `model.json`),
          this.blobToFile(weightsResponse.data, `model.weights.bin`)
        ]))
          .then(model => {
            this.model = model;
            console.log('new model: ', this.model);
            this.get_training_time();
          })
          .catch(error => {
            console.error(error);
            alert(error);
          });
      }))
      .catch(error => {
        console.error(error);
        alert(error);
      });
  }

  is_loadable() {
    return axios.get(`${SERVER_PATH + CHECK_LOAD}?name=${this.name}`);
  }

  get_training_time() {
    axios.get(`${SERVER_PATH + CHECK_TRAIN_TIME}?name=${this.name}`)
      .then(response => {
        this.training_time = parseInt(response.data, 10);
      })
      .catch(error => {
        console.error(error);
        alert(error);
      });
  }
}
