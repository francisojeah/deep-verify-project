# 🛠️ Deep-Verify Microservice

## 📋 Table of 

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

The microservice of Deep-Verify is responsible for handling the deepfake detection algorithms. Built with FastAPI, it offers a high-performance, asynchronous framework for running detection services and integrating them into the main application.

## ✨ Features

- **FastAPI Framework**: High-performance, asynchronous web framework.
- **Dockerized Deployment**: Easy to deploy using Docker.
- **Modular Design**: Organized codebase for easy extension and maintenance.
- **API Endpoints**: Dedicated endpoints for deepfake detection.
- **Logging**: Centralized logging mechanism for monitoring and debugging.

## 🛠️ Tech Stack

- **Web Framework**: FastAPI
- **Containerization**: Docker
- **Language**: Python
- **Logging**: Custom logging utilities


## ⚙️ Setup and Installation

1. **Navigate to the microservice directory:**

```
cd deep-verify/web-apps/deep-verify-model-microservice
```

2. **Install dependencies:**

```
pip install -r requirements.txt
```

3. **Build the Docker image:**

```
docker build -t deep-verify-microservice .
```

4. **Run the Docker container:**

```
docker run -d --name deep-verify-microservice -p 8000:8000
```

## 🚀 Usage

1. **Run the app in development mode:**

```
uvicorn app.main:app --reload
```

2. **Build the Docker image:**

```
docker build -t deep-verify-microservice .
```

3. **Run the Docker container:**

```
docker run -d --name deep-verify-microservice -p 8000:8000
```

## 📚 Documentation

- FastAPI: <https://fastapi.tiangolo.com/>
- Docker: <https://docs.docker.com/>
- Uvicorn: <https://www.uvicorn.org/>

## 🔧 API Endpoints

- POST /api/v1/detect
    - Endpoint for detecting deepfakes.
    - Request Body: {"audio": "base64_encoded_audio"}
    - Response: {"result": "fake"}


## 📜 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🙏 Acknowledgements

Special thanks to all the contributors who made this project possible.
