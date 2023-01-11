import React from "react";
import ReactDOM from "react-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./app";
import "./index.css";

document.addEventListener("DOMContentLoaded", function () {
  ReactDOM.render(
    <React.StrictMode>
      <ToastContainer />
      <App />
    </React.StrictMode>,
    document.getElementById("container")
  );
});
