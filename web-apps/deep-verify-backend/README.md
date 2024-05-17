# 🕵️‍♂️ Deep-Verify Backend

#### 📋 Table of Contents

- [📖 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 File Structure](#-file-structure)
- [⚙️ Setup and Installation](#%EF%B8%8F-setup-and-installation)
- [🚀 Usage](#-usage)
- [🔄 API Versioning](#-api-versioning)
- [📚 OpenAPI (Swagger) Implementation](#-openapi-swagger-implementation)
- [🌐 Environment Variables](#-environment-variables)
- [📚 Documentation](#-documentation)
- [📜 License](#-license)
- [🙏 Acknowledgements](#-acknowledgements)

---

## 📖 Project Overview

The backend of Deep-Verify is a powerful and scalable API built with NestJS, designed to handle deepfake detection requests, user authentication, and more. It includes API versioning, MongoDB integration, and OpenAPI (Swagger) documentation for easy API consumption.

## ✨ Features

- **NestJS Framework**: Robust and scalable backend architecture.
- **API Gateway**: Centralized API gateway for managing requests.
- **MongoDB**: Efficient and scalable database for storing application data.
- **API Versioning**: Support for multiple API versions.
- **OpenAPI (Swagger)**: Automatically generated API documentation.
- **Modular Structure**: Organized codebase for maintainability and scalability.

## 🛠️ Tech Stack

- **Backend Framework**: NestJS
- **Database**: MongoDB
- **API Documentation**: OpenAPI (Swagger)
- **Versioning**: API versioning for backward compatibility
- **Containerization**: Docker for consistent development and production environments

## 📁 File Structure

```
deep-verify/
├── web-apps/
│ ├── deep-verify-backend/
│ │ ├── src/
│ │ │ ├── modules/
│ │ │ │ ├── auth/
│ │ │ │ │ ├── auth.controller.ts
│ │ │ │ │ ├── auth.module.ts
│ │ │ │ │ ├── auth.service.ts
│ │ │ │ ├── users/
│ │ │ │ │ ├── user.controller.ts
│ │ │ │ │ ├── user.module.ts
│ │ │ │ │ ├── user.service.ts
│ │ │ │ ├── detection/
│ │ │ │ │ ├── detection.controller.ts
│ │ │ │ │ ├── detection.module.ts
│ │ │ │ │ ├── detection.service.ts
│ │ │ ├── main.ts
│ │ │ ├── app.module.ts
│ │ ├── test/
│ │ │ ├── auth.e2e-spec.ts
│ │ │ ├── user.e2e-spec.ts
│ │ ├── package.json
│ │ ├── nest-cli.json
│ │ ├── tsconfig.json
│ │ ├── tsconfig.build.json
│ │ └── webpack.config.js
```

## ⚙️ Setup and Installation

1. **Navigate to the backend directory:**

```
cd deep-verify/web-apps/deep-verify-backend
```

2. **Install dependencies:**

```
npm install
```

3. **Configure environment variables:**

Create a .env file in the root of the backend project and add your MongoDB URI and other necessary environment variables:

```
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
```

4. **Start the development server:**

```
npm run start:dev
```

5. **Build for production:**

```
npm run build
```

6. **Start the production server:**

```
npm run start:prod
```

## 🚀 Usage

1. **Run the app in development mode:**

```
npm run start:dev
```

2. **Build the app for production:**

```
npm run build
```

3. Serve the production build:

```
npm run start:prod
```

## 🔄 API Versioning

The backend supports API versioning to ensure backward compatibility. API versions are prefixed in the route paths, such as /api/v1/detection.

## 📚 OpenAPI (Swagger) Implementation

The backend uses Swagger for API documentation. Once the server is running, you can access the documentation at <http://localhost:3000/api>.

## 🌐 Environment Variables

Create a .env file in the root directory of your project and add the following environment variables:

```
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
```

## 📚 Documentation

- NestJS: <https://docs.nestjs.com/>
- MongoDB: <https://docs.mongodb.com/>
- Swagger: <https://swagger.io/docs/>
- Docker: <https://docs.docker.com/>

## 📜 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🙏 Acknowledgements

Special thanks to all the contributors who made this project possible.
