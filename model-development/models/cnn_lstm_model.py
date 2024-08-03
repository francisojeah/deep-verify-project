import tensorflow as tf
from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, TimeDistributed, LSTM, Dense, Flatten, Dropout, BatchNormalization
from tensorflow.keras.models import Model

def build_cnn_lstm_model(input_shape=(30, 224, 224, 3)):
    input_layer = Input(shape=input_shape)
    x = TimeDistributed(Conv2D(32, (3, 3), activation='relu'))(input_layer)
    x = TimeDistributed(MaxPooling2D((2, 2)))(x)
    x = TimeDistributed(BatchNormalization())(x)
    x = TimeDistributed(Conv2D(64, (3, 3), activation='relu'))(x)
    x = TimeDistributed(MaxPooling2D((2, 2)))(x)
    x = TimeDistributed(BatchNormalization())(x)
    x = TimeDistributed(Flatten())(x)
    x = LSTM(128, return_sequences=False)(x)
    x = Dropout(0.5)(x)
    output_layer = Dense(1, activation='sigmoid')(x)
    model = Model(inputs=input_layer, outputs=output_layer)
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return model
