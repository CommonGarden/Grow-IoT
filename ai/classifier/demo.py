#!/usr/bin/python

import sys, getopt

import tensorflow as tf
from model import Model
#import cv2
import matplotlib.image as mpimg

graph_path = 'pero-model.meta'
checkpoints_path = './'

def run_demo():
    with tf.Session() as sess:
        nn = Model()
        nn.init(graph_path, checkpoints_path, sess)
        #image = cv2.imread(image_path)
        while True:
            image_path = raw_input("Image path:")
            image = mpimg.imread(image_path)
            bad, good = nn.predict(image)[0]
            print 'Bad', str(bad*100), '%'
            print 'Good', str(good*100), '%'

def main(argv):
   inputfile = ''
   outputfile = ''
   # try:
   #    opts, args = getopt.getopt(argv,"hi:o:",["ifile=","ofile="])
   # except getopt.GetoptError:
   #    print 'test.py -i <inputfile>'
   #    sys.exit(2)
   # for opt, arg in opts:
   #    if opt in ("-i", "--ifile"):
   #       image_path = arg
   run_demo()

if __name__ == "__main__":
   main(sys.argv[1:])
