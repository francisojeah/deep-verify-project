
# 🕵️‍♂️ DeepVerify: DeepFake Detection in Political Media

## 📖 Overview

DeepVerify is a deepfake detection system designed to identify manipulated images and videos, specifically focusing on political media. This project utilizes advanced machine learning techniques to detect deepfakes and enhance the integrity of political content.

## 📜 Table of Contents

1. [📘 Introduction](#-introduction)
2. [✨ Features](#-features)
3. [💻 Tech Stack](#-tech-stack)
4. [📊 Dataset](#-dataset)
5. [⚙️ Installation](#-installation)
6. [🚀 Usage](#-usage)
7. [🧠 Model Development](#-model-development)
8. [🏭 Production Workflow](#-production-workflow)
9. [🤝 Contributing](#-contributing)
10. [📄 License](#-license)
11. [🙏 Acknowledgements](#-acknowledgements)


## 📘 Introduction

With the rise of deepfake technology, the spread of manipulated political media has become a significant concern. DeepVerify aims to provide a robust solution to detect such content, leveraging state-of-the-art machine learning models.

## ✨ Features

- **🖼️ Image and Video Detection**: Supports deepfake detection for both images and videos.
- **🧠 Ensemble Learning**: Combines predictions from multiple models to enhance accuracy.
- **💻 User-friendly Interface**: Developed with React, TypeScript, and Tailwind CSS.
- **📄 API Documentation**: Comprehensive API documentation using Swagger for integration and usage.

## 💻 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, NestJS
- **Machine Learning Models**: XceptionNet, EfficientNet-B4, 3D ResNet, CNN-LSTM
- **Database**: MongoDB
- **Package Management**: npm
- **Monorepo Management**: Turbo

## 📊 Dataset

The project utilizes the [FaceForensics++](https://github.com/ondyari/FaceForensics) dataset for training and evaluation, which includes a comprehensive set of images and videos with manipulated and real content.

## ⚙️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/francisojeah/deep-verify-project.git
   cd deep-verify
   ```

2. **Frontend setup:**
   ```bash
   cd web-apps/frontend
   npm install
   ```

3. **Backend setup:**
   ```bash
   cd web-apps/backend
   npm install
   ```

4. **Microservice setup:**
   ```bash
   cd web-apps/microservice
   docker build -t deepverify-microservice .
   ```

5. **Database setup:**
   Create a MongoDB instance and configure your `.env` file in the backend folder with the necessary database details.

   Example `.env` file:
   ```bash
   APP_NAME=DeepVerify
   APP_DESCRIPTION=DeepFake Detection in Political Media
   APP_SERVER_LISTEN_PORT=3000
   APP_SERVER_LISTEN_IP=0.0.0.0
   API_VERSION=v1
   GLOBAL_PREFIX=backend
   SERVER_URL=http://localhost:3000
   CLIENT_URL=http://localhost:5173
   JWT_SECRET=your_jwt_secret
   JWT_TIME=3600
   EMAIL_HOST=smtp.example.com
   EMAIL_USER=your_email@example.com
   EMAIL_PASSWORD=your_email_password
   EMAIL_FROM=no-reply@example.com
   SALT_ROUNDS=10
   DB_URI=mongodb://localhost:27017/deepverify
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_SECRET=your_google_secret
   ```

6. **Model setup:**
   ```bash
   cd models
   python training/train.py
   ```

## 🚀 Usage

1. **Start the frontend:**
   ```bash
   cd web-apps/frontend
   npm run dev
   ```

2. **Start the backend:**
   ```bash
   cd web-apps/backend
   npm run start:dev
   ```

3. **Start the microservice:**
   ```bash
   docker run -p 8000:8000 deepverify-microservice
   ```


## 🧠 Model Development

### Data Preprocessing

Run the preprocessing script to prepare the data:
```bash
cd models/data
python preprocess.py
```

### Training the Model

Train the model using the training script:
```bash
cd models/training
python train.py
```

### Evaluating the Model

Evaluate the model's performance:
```bash
cd models/evaluation
python evaluate.py
```

## 🏭 Production Workflow

1. **Data Preprocessing**: Cleaning and preparing the FaceForensics++ dataset.
2. **Model Training**: Training the selected models on the dataset.
3. **Model Evaluation**: Assessing model performance and fine-tuning.
4. **Deployment**: Deploying the backend and model microservices.
5. **Integration**: Integrating the models with the frontend application.

## 🤝 Contributing

Contributions are welcome! If you have suggestions, bug reports, or improvements, please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## 🙏 Acknowledgements

- The FaceForensics++ team for providing the dataset.
- Open source contributors and the developer community.
