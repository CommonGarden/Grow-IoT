# opal
A plant disease classifier

## Requirements
- [TensorFlow](https://www.tensorflow.org/install/)

### Installation (Mac)

1. Install pip and virtualenv
``` sh
sudo easy_install pip
pip install --upgrade virtualenv 
```

2. Create a virtualenv environment 
``` sh
virtualenv --system-site-packages tensorflow
```

3. Activate the virtualenv environment
``` sh
source ~/tensorflow/bin/activate 
```

4. Ensure pip ≥8.1 is installed
``` sh
easy_install -U pip
```

5. Install TensorFlow
``` sh
pip install --upgrade tensorflow 
```

## Demo

Make sure that the virtual environment is activated
``` sh
source ~/tensorflow/bin/activate 
```

Run the following command
``` sh
python demo.py -i targetImage
```
where *targetImage* is the path to a grape leaf image to be classified. 
For instance
``` sh
python demo.py -i ./data/test/1.jpg
Bad 99.9998688698 %
Good 0.000135660138767 %
```
The tool returns the probabilty for the leaf to be affected by peronospora disease.
In this case, 99.9998% of being sick (Bad) and 0.0001% of beging healthy (Good).

