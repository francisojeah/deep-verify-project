import numpy as np
from models.resnet3d_model import build_resnet3d_model
from models.cnn_lstm_model import build_cnn_lstm_model
from models.train_model import train_model

# Load Data
x_train = np.load('../data/x_train_videos.npy')
x_test = np.load('../data/x_test_videos.npy')
y_train = np.load('../data/y_train_videos.npy')
y_test = np.load('../data/y_test_videos.npy')

# Train ResNet3D Model
resnet3d_model = build_resnet3d_model()
train_model(resnet3d_model, x_train, y_train, x_test, y_test, 'resnet3d')

# Train CNN-LSTM Model
cnn_lstm_model = build_cnn_lstm_model()
train_model(cnn_lstm_model, x_train, y_train, x_test, y_test, 'cnn_lstm')
