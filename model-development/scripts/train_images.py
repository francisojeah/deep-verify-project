import numpy as np
from models.xception_model.py import build_xception_model
from models.efficientnet_model.py import build_efficientnet_model
from models.train_model import train_model
from utils.data_augmentation import augment_data

# Load Data
x_train = np.load('data/x_train.npy')
x_test = np.load('data/x_test.npy')
y_train = np.load('data/y_train.npy')
y_test = np.load('data/y_test.npy')

# Augment Data
x_train_aug, y_train_aug = augment_data(x_train, y_train)

# Train Xception Model
xception_model = build_xception_model()
train_model(xception_model, x_train_aug, y_train_aug, x_test, y_test, 'xception')

# Train EfficientNet Model
efficientnet_model = build_efficientnet_model()
train_model(efficientnet_model, x_train_aug, y_train_aug, x_test, y_test, 'efficientnet')
