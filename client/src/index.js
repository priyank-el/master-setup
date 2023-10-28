import React from "react";
import ReactDOM from "react-dom/client";
//import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import {ToastContainer} from 'react-toastify' 
import "react-toastify/dist/ReactToastify.css"
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./reducers";
import { loadState, saveState } from "./localStorage";
import ContextProvider from "./providers/ContextProvider";
const persistedState = loadState();
const store = createStore(rootReducer, persistedState);

store.subscribe(() => {
  saveState(store);
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ContextProvider>
    <Provider store={store}>
    <App />
    <ToastContainer />
  </Provider>
  </ContextProvider>
  
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
