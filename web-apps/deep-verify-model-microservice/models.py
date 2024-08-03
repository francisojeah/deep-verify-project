import yaml
import torch
import cv2
import numpy as np
from detectors import DETECTOR

def load_model(config_path, weights_path, device):
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    
    model_class = DETECTOR[config['model_name']]
    model = model_class(config).to(device)
    
    ckpt = torch.load(weights_path, map_location=device)
    model.load_state_dict(ckpt, strict=True)
    model.eval()
    
    return model

def process_image(model, image_bytes, device):
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    image = cv2.resize(image, (299, 299))
    image = torch.from_numpy(image).permute(2, 0, 1).unsqueeze(0).float() / 255.0
    image = image.to(device)
    
    with torch.no_grad():
        data_dict = {'image': image}
        pred_dict = model(data_dict, inference=True)
        pred = pred_dict['prob']
    
    return pred.item()

def process_video(model, video_bytes, device):
    temp_file = 'temp_video.mp4'
    with open(temp_file, 'wb') as f:
        f.write(video_bytes)
    
    frames = []
    cap = cv2.VideoCapture(temp_file)
    
    for _ in range(16):  # I3D expects 16 frames
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame = cv2.resize(frame, (224, 224))
        frames.append(frame)
    
    cap.release()
    
    if len(frames) < 16:
        frames += [frames[-1]] * (16 - len(frames))
    
    video_tensor = torch.tensor(np.array(frames)).permute(3, 0, 1, 2).unsqueeze(0).float() / 255.0
    video_tensor = video_tensor.to(device)
    
    with torch.no_grad():
        data_dict = {'image': video_tensor}
        pred_dict = model(data_dict, inference=True)
        pred = pred_dict['prob']
    
    import os
    os.remove(temp_file)
    
    return pred.item()