# 🕵️‍♂️ Deep-Verify Frontend

#### 📋 Table of Contents

- [📖 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 File Structure](#-file-structure)
- [⚙️ Setup and Installation](#️-setup-and-installation)
- [🚀 Usage](#-usage)
- [🌐 Environment Variables](#-environment-variables)
- [📚 Documentation](#-documentation)
- [📜 License](#-license)
- [🙏 Acknowledgements](#-acknowledgements)

---

## 📖 Project Overview

The frontend of Deep-Verify is a user-centric web application designed for deepfake detection. Utilizing modern web technologies, it offers an intuitive interface with features like server-side rendering, PWA capabilities, and robust state management.

## ✨ Features

- **Tailwind CSS and Flowbite:** For sleek, modern styling and ready-to-use UI components.
- **Server-Side Rendering (SSR):** Enhanced SEO and faster initial load times.
- **Progressive Web App (PWA):** Offline capabilities and installable on devices.
- **React Router v6:** Advanced routing capabilities.
- **Code Splitting & Lazy Loading:** Optimized performance by loading components on-demand.
- **Internationalization with react-i18next:** Support for multiple languages.
- **Localization:** Customization based on user locale.
- **Server Query via Redux RTK-Query:** Efficient data fetching and caching.
- **yup:** Schema validation for forms.
- **Sitemap:** Automatically generated for better SEO.
- **Redux:** State management.
- **redux-persist:** Persistent state across sessions.
- **react-helmet-async:** Manage meta tags for improved SEO.

## 🛠️ Tech Stack

- **Frontend Framework:** React
- **Build Tool:** Vite
- **Styling:** Tailwind CSS, Flowbite
- **State Management:** Redux, redux-persist
- **Routing:** React Router v6
- **Data Fetching:** Redux RTK-Query
- **Form Validation:** yup
- **Internationalization:** react-i18next
- **SEO:** react-helmet-async, sitemap
- **Environment Variables:** .env files for configuration

## 📁 File Structure

```
deep-verify/
├── web-apps/
│   ├── deep-verify-frontend/
│   │   ├── public/
│   │   │   ├── favicon.ico
│   │   │   ├── index.html
│   │   │   ├── manifest.json
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   │   └── images/
│   │   │   ├── components/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── ...
│   │   │   ├── pages/
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── About.tsx
│   │   │   │   ├── Detection.tsx
│   │   │   │   └── ...
│   │   │   ├── services/
│   │   │   │   ├── api.ts
│   │   │   │   ├── auth.ts
│   │   │   │   └── ...
│   │   │   ├── styles/
│   │   │   │   ├── tailwind.css
│   │   │   │   ├── global.css
│   │   │   │   └── ...
│   │   │   ├── utils/
│   │   │   │   ├── helpers.ts
│   │   │   │   ├── constants.ts
│   │   │   │   └── ...
│   │   │   ├── App.tsx
│   │   │   ├── index.tsx
│   │   │   └── vite-env.d.ts
│   │   ├── .env
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts

```

## ⚙️ Setup and Installation

1. **Navigate to the frontend directory:**

```
cd deep-verify/frontend
```

2. **Install dependencies:**

```
npm install
```

3. **Configure environment variables:**

Create a .env file in the root of the frontend project and add your Google Client ID:

```
VITE_REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

4. **Start the development server:**

```
npm run dev
```

5. **Build for production:**

```
npm run build
```

6. **Preview the production build:**

```
npm run serve
```

## 🚀 Usage

1. **Run the app in development mode:**

```
npm run dev
```

2. **Build and serve the production version:**

```
npm run build && npm run serve
```

## 🌐 Environment Variables

VITE_REACT_APP_GOOGLE_CLIENT_ID: Your Google Client ID for authentication.

## 📚 Documentation

- **Tailwind CSS:** [Documentation](https://tailwindcss.com/)
- **Flowbite:** [Documentation](https://flowbite-react.com/)
- **React Router v6:** [Documentation](https://reactrouter.com/en/main)
- **Redux RTK-Query:** [Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- **react-i18next:** [Documentation](https://react.i18next.com/)
- **react-helmet-async:** [Documentation](https://www.npmjs.com/package/react-helmet-async)
- **yup:** [Documentation](https://www.npmjs.com/package/yup)

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

We would like to thank the open-source community for providing the tools and libraries that made this project possible. Special thanks to our mentors and peers for their valuable feedback and support.
