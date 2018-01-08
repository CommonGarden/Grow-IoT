import tensorflow as tf
import numpy as np
import os,glob
import sys,argparse
from PIL import Image


class Model:

    graph = None    # Netwok graph
    sess = None     # Tensorflow session

    def init(self, grap_path, checkpoints_path, sess):
        '''Initialize network model'''
        # Save tensorflow session
        self.sess = sess
        # Load netwok graph from grap_path
        saver = tf.train.import_meta_graph(grap_path)
        self.graph = tf.get_default_graph()
        # Load the latest weights from checkpoints_path
        saver.restore(sess, tf.train.latest_checkpoint(checkpoints_path))


    def predict(self, image):
        '''Predict single image'''

        # Resize image to desired size and preprocessing done during training
        image_size = 128
        num_channels = 3
        images = []
        #image = cv2.resize(image, (image_size, image_size), cv2.INTER_LINEAR)
        pix = Image.fromarray(image, 'RGB')
        pix = pix.resize((image_size, image_size), Image.ANTIALIAS)
        image = np.array(pix)

        images.append(image)
        images = np.array(images, dtype=np.uint8)
        images = images.astype('float32')
        images = np.multiply(images, 1.0/255.0)

        # Reshape for network input [None image_size image_size num_channels]
        x_batch = images.reshape(1, image_size,image_size,num_channels)

        # y_pred is the tensor predicts (:0 is 0-th element of the bacth)
        y_pred = self.graph.get_tensor_by_name("y_pred:0")

        # Feed image to the input placeholder
        x= self.graph.get_tensor_by_name("x:0")
        y_true = self.graph.get_tensor_by_name("y_true:0")
        y_test_images = np.zeros((1, 2))


        # Calculate y_pred
        feed_dict_testing = {x: x_batch, y_true: y_test_images}
        result=self.sess.run(y_pred, feed_dict=feed_dict_testing)

        return result
