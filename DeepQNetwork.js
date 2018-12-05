SAVE_ADDRESS = "http://run-dez-vous.com/secret/eecs349_project/save"
LOAD_ADDRESS = "http://run-dez-vous.com/secret/eecs349_project/load"
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
                var new_layer = tf.layers.elu({units: HIDDEN_UNITS}).apply(this.hidden_layers[-1]);
                this.hidden_layers.push(new_layer);
            }
            this.q_out = tf.layers.dense({units: ACTIONS}).apply(this.hidden_layers[-1]);
            this.model = tf.model({
                inputs: this.inputs,
                outputs: this.q_out
            });

            


        }


        predict_q(state){
            return this.model.predict(tf.tensor1d(state))
        }
        
        loss(q_guess, q_actual){
            return q_guess.sub(q_actual).square().mean();
        }

        train_one(state, action, reward, state2) {
            var q_guess = this.predict_q(state);
            var actual_q = q_guess.values();
            var maxQPrime = tf.max(this.predict_q(state2));
            var new_reward = reward + DISCOUNT_RATE * maxQPrime;
            actual_q[action] = new_reward;
            var q_actual = tf.tensor1d(actual_q);

            this.optimizer.minimize(() => {
                return this.loss(q_guess, q_actual);
            })

        }

        predict_action(state){
            return tf.argMax(this.predict_q(state));
        }


        save(){
            console.log("saving");
        }

        load(){
            console.log("loading");
        }
}


