from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np

datagen = ImageDataGenerator(
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)

def augment_data(images, labels):
    augmented_images = []
    augmented_labels = []
    for img, label in zip(images, labels):
        img = np.expand_dims(img, axis=0)
        for aug_img in datagen.flow(img, batch_size=1):
            augmented_images.append(aug_img[0])
            augmented_labels.append(label)
            if len(augmented_images) >= len(images):
                return np.array(augmented_images), np.array(augmented_labels)
