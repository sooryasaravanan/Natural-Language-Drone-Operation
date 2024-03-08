import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import authReducer from "./state";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE, } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";

const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

class Doc extends React.Component {
  componentDidMount() {
    document.title = "C-UAS"
  }

  render() {
    return (
      <React.StrictMode>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistStore(store)}>
            <App className="scrollhost" />
          </PersistGate>
        </Provider>
      </React.StrictMode>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Doc />
);
