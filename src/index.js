import React from "react";
import { createRoot } from "react-dom/client"; // React 18's new rendering API
import App from "./App"; // Import your main App component
import "./index.css"; // Import any global styles (if applicable)
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./state/store";
import { BrowserRouter } from "react-router-dom";

const root = createRoot(document.getElementById("root")); // Get the root element from the HTML file
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
