import picamera

camera = picamera.PiCamera()

def capture(file_name='img.jpg'):
    camera.capture(file_name)

def capture_sequence(base_name='img'):
    '''Capture a sequence of images'''
    i = 0

    while True:
        file_name = base_name + '_' + str(i) + '.jpg'
        key = raw_input("Press Enter to take picture:")
        capture(file_name=file_name)
        print('Image ' + file_name + ' taken')
        i += 1
