import * as tf from '@tensorflow/tfjs';

SERVER_PATH = "localhost:3001/"
SAVE_ADDRESS_PATH = "api/eecs349_project/save"
LOAD_ADDRESS_PATH = "api/eecs349_project/load"
CHECK_LOAD = "api/eecs349_project/check_load"
CHECK_TRAIN_TIME = "api/eecs349_project/get_time"

HIDDEN_UNITS = 32;
ACTIONS = 32;
FRAME_SIZE = 32;
DISCOUNT_RATE = 0.9;
EXPLORATION_RATE = 0.03;
LEARNING_RATE = 0.05;

class DeepQNetwork {
        constructor(layers, frames, frame_skip){
            this.actions= ACTIONS;
            this.layers = layers;
            this.frames = frames;
            this.frame_skip = frame_skip;
            this.name = "Network_" + frames.toString() + "_" + frame_skip.toString() + "_" + layers.toString();
            this.training_time = 0
            this.optimizer = tf.train.sgd(LEARNING_RATE);
            if(this.is_loadable()){
                console.log("retrieving")
            }
            else {
                this.create_network();
            }
        }

        is_loadable(){
            return false;
        }

        create_network(){

            this.hidden_layers = new Array();
            this.inputs = tf.input({shape: this.frames * FRAME_SIZE});
            
            this.hidden_layers.push(this.inputs);
            for (var i = 0; i < this.layers; i++){
                var new_layer = tf.layers.elu({units: HIDDEN_UNITS}).apply(this.hidden_layers[i]);
                this.hidden_layers.push(new_layer);
            }
            this.q_out = tf.layers.dense({units: ACTIONS}).apply(this.hidden_layers[this.layers]);
            this.model = tf.model({
                inputs: this.inputs,
                outputs: this.q_out
            });

        }


        predict_q(state){
            var q =  this.model.predict(tf.tensor2d(state, [1, this.frames * FRAME_SIZE]));
            
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

        predict_action(state){
            var action =  this.predict_q(state).argMax(1).dataSync();
            
            return action[0];
        }


        save(){
            var query_params = "?name=" + this.name + "&time=" + this.training_time.toString();
            console.log(this.training_time);
            this.model.save(SERVER_PATH + SAVE_ADDRESS_PATH + query_params);
        }

        load(){
            console.log("loading");
        }
}


