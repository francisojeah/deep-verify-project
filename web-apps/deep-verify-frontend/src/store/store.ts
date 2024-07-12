import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {  setupListeners } from "@reduxjs/toolkit/query";
import { appApi } from "./slices/appSlice";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import menuSlice from "./slices/menuSlice";
import userSlice from "./slices/userSlice";

export type RootState = {
  menu: any;
  user: any;
};

const rootReducer = combineReducers<any>({
  menu: menuSlice,
  user: userSlice,
  [appApi.reducerPath]: appApi.reducer,
});

const rootMiddleware = [appApi.middleware];

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(rootMiddleware),
});

setupListeners(store.dispatch);
