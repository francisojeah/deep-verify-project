import tensorflow as tf
from tensorflow.keras.layers import Input, Dense, Conv3D, MaxPooling3D, Flatten, Dropout, BatchNormalization
from tensorflow.keras.models import Model

def build_resnet3d_model(input_shape=(30, 224, 224, 3)):
    input_layer = Input(shape=input_shape)
    x = Conv3D(64, kernel_size=(3, 3, 3), activation='relu')(input_layer)
    x = MaxPooling3D(pool_size=(2, 2, 2))(x)
    x = BatchNormalization()(x)
    x = Conv3D(128, kernel_size=(3, 3, 3), activation='relu')(x)
    x = MaxPooling3D(pool_size=(2, 2, 2))(x)
    x = BatchNormalization()(x)
    x = Flatten()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.5)(x)
    output_layer = Dense(1, activation='sigmoid')(x)
    model = Model(inputs=input_layer, outputs=output_layer)
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return model
