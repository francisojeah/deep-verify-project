import { Suspense, createContext, lazy, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "flowbite";
import PageLoader from "./components/PageLoader";
import React from "react";
import { persistStore } from "redux-persist";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { DEV_MODE } from "./global/frontend.settings";
import { AppContextType } from "./global/contexts";
import { useTranslation } from "react-i18next";
import { HelmetProvider } from "react-helmet-async";
import { GoogleOAuthProvider } from "@react-oauth/google";
const { VITE_REACT_APP_GOOGLE_CLIENT_ID } = import.meta.env;

type Props = {
  assetMap?: {
    "styles.css": string;
    "main.js": string;
    manifest?: string;
    "vite-plugin-pwa:register-sw"?: string;
    "additional-styles": string[];
    "additional-jss": string[];
    initialContentMap: {
      title: string;
      description?: string;
      "hello-message"?: string;
    };
    baseUrl: string;
    initialI18nStore?: {}; //to be used with the middleware
    initialLanguage?: string;
    clientFirstAcceptLanguage?: string;
  };
};

//create a context to be used to pass app props down the component hierarcy, as the need arises.
export const AppContext = createContext<AppContextType>(null);

const App: React.FC<Props> = ({ assetMap }) => {
  const { i18n } = useTranslation();

  const changeI18nLanguageToClientPreferred = async () => {
    if (i18n.language != assetMap?.clientFirstAcceptLanguage)
      await i18n.changeLanguage(assetMap?.clientFirstAcceptLanguage);
  };
  useEffect(() => {
    //check if assetMap sent in production mode; if not, redirect to a proper ssr endpoint.

    if (!DEV_MODE) {
      //attempt to change language here to locale
      changeI18nLanguageToClientPreferred();
      if (!assetMap) {
        window.location.href = "/"; //simulate a mouse click
      }
    }
  });

  const appBody = () => {
    //can be used at DEV time and PROD time

    //Default settings on dev mode
    let baseUrl = "/";
    let title = "Hello World";

    if (assetMap) {
      //prod mode. Sent by ssr endpoint.
      baseUrl = assetMap.baseUrl;
      title = assetMap.initialContentMap.title!;
    }
    console.log(title);
    console.log(baseUrl);
    //console.log(`assetMap in AppWithNavDemo = ${JSON.stringify(assetMap)}`)

    let persister = persistStore(store);

    return (
      <AppContext.Provider value={{ baseUrl }}>
        <GoogleOAuthProvider clientId={VITE_REACT_APP_GOOGLE_CLIENT_ID}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persister}>
              <HelmetProvider>
                <Router>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          {React.createElement(
                            lazy(() => import("../src/pages/Home/LandingPage"))
                          )}
                        </Suspense>
                      }
                    />
                    <Route
                      path="/home"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          {React.createElement(
                            lazy(() => import("../src/pages/Home/HomePage"))
                          )}
                        </Suspense>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          {React.createElement(
                            lazy(() => import("../src/pages/User/UserDashboard"))
                          )}
                        </Suspense>
                      }
                    />
                    <Route
                      path="/game"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          {React.createElement(
                            lazy(() => import("../src/pages/GeneralPages/Game"))
                          )}
                        </Suspense>
                      }
                    />
                    <Route
                      path="/detection/:id"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          {React.createElement(
                            lazy(() => import("../src/pages/User/DetectionDetailsPage"))
                          )}
                        </Suspense>
                      }
                    />
                    <Route
                      path="/history"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          {React.createElement(
                            lazy(() => import("../src/pages/User/DetectionHistoryPage"))
                          )}
                        </Suspense>
                      }
                    />
                    <Route
                      path="/signup"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          {React.createElement(
                            lazy(() => import("../src/pages/Auth/SignUp"))
                          )}
                        </Suspense>
                      }
                    /><Route
                    path="/login"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        {React.createElement(
                          lazy(() => import("../src/pages/Auth/Login"))
                        )}
                      </Suspense>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        {React.createElement(
                          lazy(() => import("../src/pages/Auth/ForgotPassword"))
                        )}
                      </Suspense>
                    }
                  />
                  <Route
                    path="/reset-password"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        {React.createElement(
                          lazy(() => import("../src/pages/Auth/ResetPassword"))
                        )}
                      </Suspense>
                    }
                  />
                  <Route
                      path="/about"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          {React.createElement(
                            lazy(() => import("../src/pages/GeneralPages/About"))
                          )}
                        </Suspense>
                      }
                    />
                     <Route
                      path="/contact"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          {React.createElement(
                            lazy(() => import("../src/pages/GeneralPages/ContactPage"))
                          )}
                        </Suspense>
                      }
                    />
                    <Route
                      path="*"
                      element={
                        <Suspense fallback={<PageLoader />}>
                          {React.createElement(
                            lazy(() => import("../src/pages/Errors/NotFound"))
                          )}
                        </Suspense>
                      }
                    />
                  </Routes>
                </Router>
              </HelmetProvider>
            </PersistGate>
          </Provider>
        </GoogleOAuthProvider>
      </AppContext.Provider>
    );
  };

  //Prepare extra css if any
  const additionStyles = () => {
    if (assetMap) {
      let _additionStyles = assetMap["additional-styles"].map(
        (additionalStyle) => {
          return <link rel="stylesheet" href={additionalStyle} />;
        }
      );
      return _additionStyles;
    }
  };

  //Prepare extra Jss if any
  const additionalJss = () => {
    if (assetMap) {
      let _additionalJss = assetMap["additional-jss"].map((additionalJs) => {
        return <script src={additionalJs} />;
      });
      return _additionalJss;
    }
  };

  //compose conditional output
  const output = () => {
    if (assetMap) {
      //send whole document if ssr
      return (
        <html>
          <head>
            <link rel="stylesheet" href={assetMap["styles.css"]} />
            {/* additional Styles if any */}
            {additionStyles()}

            {assetMap["manifest"] && (
              <link rel="manifest" href={assetMap["manifest"]}></link>
            )}
            {assetMap["vite-plugin-pwa:register-sw"] && (
              <script
                id="vite-plugin-pwa:register-sw"
                src="/registerSW.js"
              ></script>
            )}
            {assetMap.initialContentMap && (
              <title>{assetMap.initialContentMap["title"]}</title>
            )}
          </head>
          {appBody()}
          {/* additional Jss if any*/}
          {additionalJss()}
        </html>
      );
    } else {
      return (
        <>
          {appBody()}
          {/* //only the body in dev mode. CSS should be available at
          dev mode with createRoot */}
        </>
      );
    }
  };
  return <>{output()}</>;
};

export default App;
