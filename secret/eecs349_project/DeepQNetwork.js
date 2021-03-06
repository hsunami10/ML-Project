SERVER_PATH = "http://run-dez-vous.com/"
SAVE_ADDRESS_PATH = "api/eecs349_project/save"
LOAD_MODEL_PATH = "api/eecs349_project/load_model"
LOAD_WEIGHTS_PATH = "api/eecs349_project/load_weights"
CHECK_LOAD = "api/eecs349_project/check_load"
CHECK_TRAIN_TIME = "api/eecs349_project/get_time"

HIDDEN_UNITS = 32;
ACTIONS = 32;
FRAME_SIZE = 32;
DISCOUNT_RATE = 0.95;
EXPLORATION_RATE = 0.015;
LEARNING_RATE = 0.0005;

class DeepQNetwork {
  constructor(layers, frames, frame_skip) {
    this.actions = ACTIONS;
    this.layers = layers;
    this.frames = frames;
    this.frame_skip = frame_skip;
    this.name = "Network_" + frames.toString() + "_" + frame_skip.toString() + "_" + layers.toString();
    this.training_time = 0
    this.optimizer = tf.train.adam(LEARNING_RATE);
    this.is_loading = false;
    this.create_network();

    this.is_loadable()
      .then(response => {
        if (response.data) {
          this.load();
          
          
        }
      })
      .catch(error => {
        console.error(error);
        console.trace(error);
        alert(error);
        throw error;
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
        units: HIDDEN_UNITS,
      }).apply(this.hidden_layers[i]);
      this.hidden_layers.push(new_layer);
    }
    this.q_out = tf.layers.dense({
      units: ACTIONS,
      
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
    
    
    var actual_q = q_guess.clone().dataSync();
    
    var q_prime = this.predict_q(e.state2);
    
    var q_prime_data = q_prime.dataSync();
    
    var maxQPrime = Math.max.apply(null, q_prime_data);
    
    var new_reward = 10* e.reward + DISCOUNT_RATE * maxQPrime;
    
    
    actual_q[e.action] = new_reward;
    
    var q_actual = tf.tensor1d(actual_q);
    
    

    this.optimizer.minimize(() => {
      const p = this.predict_q(e.state);
      
      var loss = p.sub(q_actual).square().mean();
      
      
      return loss;
    })

  }

  predict_action(state) {
    
    var p = this.predict_q(state);
    
    var action = this.predict_q(state).argMax(1).dataSync()
    
    if (Math.random() < EXPLORATION_RATE) {
      action = Math.floor(Math.random() * 32)
    }
    return action;
    // var action = this.predict_q(state).argMax(1).dataSync();
    // return action[0];
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
    axios.all([this.getModel(), this.getWeights()])
      .then(axios.spread((modelResponse, weightsResponse) => {
        
        tf.loadModel(tf.io.browserFiles([
          this.blobToFile(modelResponse.data, `model.json`),
          this.blobToFile(weightsResponse.data, `model.weights.bin`)
        ]))
          .then(model => {
            
            this.model = model;
            this.get_training_time();
            
          })
          .catch(error => {
            console.error(error);
            console.trace(error);
            //alert(error);
            throw error;
          });
      }))
      .catch(error => {
        console.error(error);
        console.trace(error);
        //alert(error);
        throw error;
      });

    this.is_loading = false;
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
        console.trace(error);
        alert(error);
        throw error;
      });
  }

  training_time_string() {
    if (this.is_loading){
      return "Loading..."
    }
    var seconds = Math.floor(this.training_time / 1000);
    var minutes = Math.floor(seconds / 60)
    seconds = seconds % 60;
    var hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    var days = Math.floor(hours / 24);
    hours = hours % 24;

    return days.toString() + "d " + hours.toString() + "h " + minutes.toString() + "m " + seconds.toString() + "s";
  }

  toString(){
    return this.name + ": " + this.training_time_string();
  }
}
