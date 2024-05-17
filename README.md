# 🕵️‍♂️ Deep-Verify: A Comprehensive DeepFake Detection Platform

#### 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [File Structure](#-file-structure)
- [Setup and Installation](#️-setup-and-installation)
- [Usage](#-usage)
- [Model Development](#-model-development)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

## 📖 Project Overview

Deep-Verify is a state-of-the-art platform designed to detect deepfake media, encompassing images, videos, and audio files. Leveraging advanced machine learning algorithms, Deep-Verify ensures accurate and reliable detection of deepfakes. The platform is built with a modern tech stack including a frontend using React and Vite, a backend powered by NestJS, and a microservice for model inference implemented with FastAPI. Additionally, the platform includes an educational game to help users learn how to identify deepfakes.

## ✨ Features

- **User Authentication:** Secure login and registration system.
- **DeepFake Detection:** Analyze images, videos, and audio files for deepfake content.
- **Real or Fake Game:** An interactive game to help users learn to identify deepfakes.
- **API Support:** Public API for integrating deepfake detection into other applications.
- **Responsive Design:** Accessible on both desktop and mobile devices.
- **Extensive Documentation:** Clear and detailed documentation for users and developers.
- **Robust Data Handling:** Efficient handling and processing of large datasets.

## 🛠️ Tech Stack

- **Frontend:** Vite, React, TypeScript
- **Backend:** NestJS, TypeScript
 **Microservice:** FastAPI, Python
- **Model Training:** TensorFlow, PyTorch
- **Database:** MongoDB
- **Containerization:** Docker
- **Version Control:** Git
- **CI/CD:** GitHub Actions

## 📁 File Structure

```
deep-verify/
├── web-apps/
│   ├── deep-verify-frontend/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── styles/
│   │   │   ├── utils/
│   │   │   ├── App.tsx
│   │   │   ├── index.tsx
│   │   │   └── vite-env.d.ts
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   ├── deep-verify-backend/
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── users/
│   │   │   │   ├── detection/
│   │   │   │   │   ├── detection.controller.ts
│   │   │   │   │   ├── detection.module.ts
│   │   │   │   │   ├── detection.service.ts
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   ├── test/
│   │   ├── package.json
│   │   ├── nest-cli.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.build.json
│   │   └── webpack.config.js
│   ├── microservice/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── endpoints/
│   │   │   │   │   └── detect.py
│   │   │   │   ├── __init__.py
│   │   │   ├── core/
│   │   │   │   ├── config.py
│   │   │   │   ├── security.py
│   │   │   │   ├── __init__.py
│   │   │   ├── models/
│   │   │   │   ├── deepfake_model.py
│   │   │   │   ├── __init__.py
│   │   │   ├── services/
│   │   │   │   ├── deepfake_service.py
│   │   │   │   ├── __init__.py
│   │   │   ├── utils/
│   │   │   │   ├── logger.py
│   │   │   │   ├── __init__.py
│   │   │   ├── main.py
│   │   │   └── __init__.py
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── README.md
├── models/
│   ├── data/
│   │   ├── raw/
│   │   ├── processed/
│   │   ├── preprocess.py
│   │   ├── dataset_statistics.py
│   ├── training/
│   │   ├── train.py
│   │   ├── config.py
│   │   ├── utils.py
│   │   ├── custom_layers/
│   │   │   ├── attention.py
│   │   │   ├── __init__.py
│   ├── evaluation/
│   │   ├── evaluate.py
│   │   ├── metrics.py
│   │   ├── visualization/
│   │   │   ├── roc_curve.py
│   │   │   ├── confusion_matrix.py
│   │   │   ├── __init__.py
│   ├── serving/
│   │   ├── serve.py
│   │   ├── config.py
│   │   ├── api_schema.py
│   ├── saved_models/
│   │   └── deepfake_model/
│   ├── experiments/
│   │   ├── experiment_1.py
│   │   ├── experiment_2.py
│   ├── notebooks/
│   │   ├── data_exploration.ipynb
│   │   ├── model_prototyping.ipynb
│   ├── logs/
│   │   ├── training.log
│   │   ├── evaluation.log
├── turbo.json
├── package.json
├── tsconfig.json
└── README.md
```

## ⚙️ Setup and Installation

### Prerequisites

- Node.js
- Python 3.x
- Docker
- MongoDB

### Installation Steps

1. **Clone the repository:**

```
git clone https://github.com/francisojeah/deep-verify-project.git
cd deep-verify
```

2. **Frontend setup:**

```
cd web-apps/frontend
npm install
npm run dev
```

3. **Backend setup:**

```
cd web-apps/backend
npm install
npm run start:dev
```

4. **Microservice setup:**

```
cd web-apps/microservice
pip install -r requirements.txt
uvicorn app.main:app --reload
```

5. **Database setup:**

```
docker-compose up -d
```

6. **Model setup:**

```
cd models
python training/train.py
```

## 🚀 Usage

### Running the Application

1. **Start the frontend:**

```
cd apps/frontend
npm run dev
```

2. **Start the backend:**

```
cd apps/backend
npm run start:dev
```

3. **Start the microservice:**

```
cd apps/microservice
uvicorn app.main:app --reload
```

### API Documentation

Access the API documentation at http://localhost:8000/docs for the FastAPI microservice.

## 🧠 Model Development

### Data Preprocessing

Run the preprocessing script to prepare the data:

```
cd models/data
python preprocess.py
```

### Training the Model

Train the model using the training script:

```
cd models/training
python train.py
```

### Evaluating the Model

Evaluate the model's performance:
```
cd models/evaluation
python evaluate.py
```

### Serving the Model

Serve the trained model with FastAPI:

```
cd models/serving
uvicorn serve:app --reload
```

## 📜 API Documentation

Detailed API documentation can be accessed at <http://localhost:8000/docs> once the microservice is running.

## 🤝 Contributing

Contributions are welcome! Please follow these steps to contribute:

### Fork the repository

1. **Create your feature branch:**

```
git checkout -b feature/YourFeature
```

2. **Commit your changes:**

```
git commit -m 'Add your feature'
```

3. **Push to the branch:**

```
git push origin feature/YourFeature
```

4. **Open a pull request**

## 📜 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🙏 Acknowledgements

We would like to thank the open-source community for providing the tools and libraries that made this project possible. Special thanks to our mentors and peers for their valuable feedback and support.
