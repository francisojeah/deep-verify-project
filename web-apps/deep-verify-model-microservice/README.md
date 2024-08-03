# 🛠️ DeepVerify Microservice

## 📋 Table of Contents

- [📖 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚙️ Setup and Installation](#-setup-and-installation)
- [🚀 Usage](#-usage)
- [📚 Documentation](#-documentation)
- [🔧 API Endpoints](#-api-endpoints)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)
- [🙏 Acknowledgements](#-acknowledgements)

## 📖 Project Overview

DeepVerify's microservice is dedicated to the advanced detection of deepfakes in political media. Utilizing FastAPI, this microservice offers high-performance, asynchronous capabilities to integrate and deploy sophisticated detection algorithms for images and videos.

## ✨ Features

- **Advanced Detection Algorithms**: Integrates state-of-the-art models for image and video analysis.
- **FastAPI Framework**: Efficient and asynchronous web framework for optimal performance.
- **Dockerized Deployment**: Simplified deployment and scaling with Docker.
- **Modular Design**: Structured codebase for scalability and maintainability.
- **Comprehensive API Endpoints**: Tailored endpoints for deepfake detection in images and videos.
- **Robust Logging**: Centralized logging for monitoring, debugging, and performance analysis.

## 🛠️ Tech Stack

- **Web Framework**: FastAPI
- **Containerization**: Docker
- **Language**: Python
- **Logging**: Custom logging utilities
- **Model Frameworks**: TensorFlow, PyTorch

## ⚙️ Setup and Installation

1. **Navigate to the microservice directory:**

   ```bash
   cd deep-verify/web-apps/deep-verify-model-microservice
   ```

2. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Build the Docker image:**

   ```bash
   docker build -t deep-verify-microservice .
   ```

4. **Run the Docker container:**

   ```bash
   docker run -d --name deep-verify-microservice -p 8000:8000 deep-verify-microservice
   ```

## 🚀 Usage

1. **Run the app in development mode:**

   ```bash
   uvicorn app.main:app --reload
   ```

2. **Build the Docker image:**

   ```bash
   docker build -t deep-verify-microservice .
   ```

3. **Run the Docker container:**

   ```bash
   docker run -d --name deep-verify-microservice -p 8000:8000 deep-verify-microservice
   ```

## 📚 Documentation

- FastAPI: <https://fastapi.tiangolo.com/>
- Docker: <https://docs.docker.com/>
- Uvicorn: <https://www.uvicorn.org/>
- TensorFlow: <https://www.tensorflow.org/>
- PyTorch: <https://pytorch.org/>

## 🔧 API Endpoints

- **POST /api/v1/detect/image**
  - **Description**: Endpoint for detecting deepfakes in images.
  - **Request Body**: `{"image": "base64_encoded_image"}`
  - **Response**: `{"isDeepfake": true/false, "confidence": float}`

- **POST /api/v1/detect/video**
  - **Description**: Endpoint for detecting deepfakes in videos.
  - **Request Body**: `{"video": "base64_encoded_video"}`
  - **Response**: `{"isDeepfake": true/false, "confidence": float}`

## 📜 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🙏 Acknowledgements

Special thanks to all contributors and supporters who made this project possible, including the development team and advisors.
