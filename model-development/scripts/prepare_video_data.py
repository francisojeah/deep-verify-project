import os
import cv2
import numpy as np
from sklearn.model_selection import train_test_split

def load_video_data(data_dir, frame_count=30, frame_size=(224, 224)):
    videos = []
    labels = []
    for label_dir in os.listdir(data_dir):
        label = 1 if label_dir == 'fake' else 0
        for vid_file in os.listdir(os.path.join(data_dir, label_dir)):
            vid_path = os.path.join(data_dir, label_dir, vid_file)
            cap = cv2.VideoCapture(vid_path)
            frames = []
            while len(frames) < frame_count:
                ret, frame = cap.read()
                if not ret:
                    break
                frame = cv2.resize(frame, frame_size)
                frames.append(frame)
            if len(frames) == frame_count:
                videos.append(frames)
                labels.append(label)
    videos = np.array(videos)
    labels = np.array(labels)
    return train_test_split(videos, labels, test_size=0.2, random_state=42)

if __name__ == "__main__":
    data_dir = 'path_to_video_data'
    x_train, x_test, y_train, y_test = load_video_data(data_dir)
    np.save('../data/x_train_videos.npy', x_train)
    np.save('../data/x_test_videos.npy', x_test)
    np.save('../data/y_train_videos.npy', y_train)
    np.save('../data/y_test_videos.npy', y_test)
