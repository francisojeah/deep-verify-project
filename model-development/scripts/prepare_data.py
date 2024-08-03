import os
import cv2
import numpy as np
from sklearn.model_selection import train_test_split

def load_image_data(data_dir, img_size=(299, 299)):
    images = []
    labels = []
    for label_dir in os.listdir(data_dir):
        label = 1 if label_dir == 'fake' else 0
        for img_file in os.listdir(os.path.join(data_dir, label_dir)):
            img_path = os.path.join(data_dir, label_dir, img_file)
            img = cv2.imread(img_path)
            img = cv2.resize(img, img_size)
            images.append(img)
            labels.append(label)
    images = np.array(images)
    labels = np.array(labels)
    return train_test_split(images, labels, test_size=0.2, random_state=42)

if __name__ == "__main__":
    data_dir = 'path_to_image_data'
    x_train, x_test, y_train, y_test = load_image_data(data_dir)
    np.save('data/x_train.npy', x_train)
    np.save('data/x_test.npy', x_test)
    np.save('data/y_train.npy', y_train)
    np.save('data/y_test.npy', y_test)
