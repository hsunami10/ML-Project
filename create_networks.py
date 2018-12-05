import tensorflow as tf
import numpy as np

VARS_PER_FRAME = 32
ACTIONS = 32 ## or 2^5??
HIDDEN_UNITS = 16

def create_network(layers, frames, frame_use):
    name = "Network_" + str(layers) + "layers_" + str(frames) + "frames_skip" + str(frame_use)

    with tf.variable_scope(name):
        inputs_ = tf.placeholder(tf.float32, [None, frames * VARS_PER_FRAME], name="inputs")
        actions_ = tf.placeholder(tf.float32, [None, ACTIONS], name="actions_")


class DeepQNetwork:
    def __init__(self, layers, frames, frame_use):
        self.name = "Network_" + str(layers) + "layers_" + str(frames) + "frames_skip" + str(frame_use)
        self.layers = layers
        self.frames = frames
        self.frame_use = frame_use
        self.build()

    def build(self):
        self.inputs = tf.placeholder(tf.float32, [None, frames * VARS_PER_FRAME], name="inputs")
        self.actions = tf.placeholder(tf.float32, [None, ACTIONS], name="actions")

        self.hidden_layers = [self.inputs]

        for i in range(layers):
            self.hidden_layers.append(tf.layers.dense(inputs = self.hidden_layers[-1], units = HIDDEN_UNITS, activation = tf.nn.elu, name="fc" + str(i)))
        

        self.Q_out = tf.reduce_sum(tf.matmult(self.hidden_layers[-1], self.actions))

        self.Q_actual = tf.placeholder(shape=[1,ACTIONS],dtype=tf.float32)
        self.loss = tf.reduce_sum(tf.square(self.Q_actual - self.Q_out))