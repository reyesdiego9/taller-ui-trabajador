import React from "react";
import App from "./App";
import "./index.css";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import client from "../server/client";
import { Provider } from "react-redux";
import store from "../store/store";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Provider>
);
