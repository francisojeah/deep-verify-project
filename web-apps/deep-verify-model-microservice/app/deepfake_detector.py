from typing import Tuple
import cv2
import numpy as np
from models.xception_model import build_xception_model
from models.efficientnet_model import build_efficientnet_model
from models.resnet3d_model import build_resnet3d_model
from models.cnn_lstm_model import build_cnn_lstm_model
from models.ensemble import predict_image, predict_video

# Load trained models for images
xception_model = build_xception_model()
xception_model.load_weights('../../model-development/models/xception_best.h5')
efficientnet_model = build_efficientnet_model()
efficientnet_model.load_weights('../../model-development/models/efficientnet_best.h5')

# Load trained models for videos
resnet3d_model = build_resnet3d_model()
resnet3d_model.load_weights('../../model-development/models/resnet3d_best.h5')
cnn_lstm_model = build_cnn_lstm_model()
cnn_lstm_model.load_weights('../../model-development/models/cnn_lstm_best.h5')

# Ensemble Models
image_models = [xception_model, efficientnet_model]
video_models = [resnet3d_model, cnn_lstm_model]

def detect_deepfake(file_path: str, input_type: str, file_name: str) -> Tuple[bool, float]:
    try:
        if input_type == 'image':
            return process_image(file_path)
        elif input_type == 'video':
            return process_video(file_path)
        else:
            raise ValueError("Unsupported input type")
    except Exception as e:
        raise ValueError(f"Error processing {input_type}: {str(e)}")

def process_image(file_path: str) -> Tuple[bool, float]:
    image = cv2.imread(file_path)
    if image is None:
        raise ValueError("Error reading image file")
    image = cv2.resize(image, (299, 299))  # Resize to model input size
    is_deepfake, confidence = predict_image(image_models, image)
    return is_deepfake, confidence

def process_video(file_path: str) -> Tuple[bool, float]:
    cap = cv2.VideoCapture(file_path)
    if not cap.isOpened():
        raise ValueError("Error reading video file")
    
    frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.resize(frame, (224, 224))  # Resize frames to model input size
        frames.append(frame)
    
    cap.release()
    if len(frames) == 0:
        raise ValueError("No frames extracted from video")

    frames = np.array(frames)
    is_deepfake, confidence = predict_video(video_models, frames)
    return is_deepfake, confidence
