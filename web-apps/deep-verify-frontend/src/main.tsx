import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// @ts-ignore
// hydrateRoot(document, <React.StrictMode><Suspense loading={<PageLoader />}><BrowserRouter><App assetMap={window.assetMap} /></BrowserRouter></Suspense></React.StrictMode>);
