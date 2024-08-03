import numpy as np
from tensorflow.keras.callbacks import ReduceLROnPlateau, EarlyStopping, ModelCheckpoint

def train_model(model, x_train, y_train, x_val, y_val, model_name):
    checkpoint = ModelCheckpoint(f'{model_name}_best.h5', monitor='val_loss', save_best_only=True, mode='min')
    reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=5, min_lr=0.001)
    early_stopping = EarlyStopping(monitor='val_loss', patience=10)
    
    model.fit(x_train, y_train, validation_data=(x_val, y_val), epochs=50, batch_size=32,
              callbacks=[checkpoint, reduce_lr, early_stopping])
