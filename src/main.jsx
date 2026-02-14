import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
// src/main.jsx
import '@fontsource/poppins/400.css'  // default weight
import '@fontsource/poppins/600.css'  // bold weight
import '@fontsource/poppins/800.css'  // extra bold

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
