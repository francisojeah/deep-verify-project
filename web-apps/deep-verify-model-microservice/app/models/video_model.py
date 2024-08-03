import numpy as np

def predict_video(models, frames):
    predictions = []
    for model in models:
        frames = np.expand_dims(frames, axis=0)
        prediction = model.predict(frames)[0]
        predictions.append(prediction)
    
    avg_prediction = np.mean(predictions, axis=0)
    is_deepfake = avg_prediction > 0.5 
    confidence = float(avg_prediction)
    
    return is_deepfake, confidence
