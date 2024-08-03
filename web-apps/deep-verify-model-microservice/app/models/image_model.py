import numpy as np

def predict_image(models, image):
    predictions = []
    for model in models:
        img = np.expand_dims(image, axis=0)
        prediction = model.predict(img)[0]
        predictions.append(prediction)
    
    avg_prediction = np.mean(predictions, axis=0)
    is_deepfake = avg_prediction > 0.5 
    confidence = float(avg_prediction)
    
    return is_deepfake, confidence