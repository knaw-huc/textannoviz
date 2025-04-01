import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";

import App from "./App";

const container = document.getElementById("container");

// "createRoot(container!) is recommended by React docs: https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html. See line: "const root = createRoot(container); // createRoot(container!) if you use TypeScript"".

const root = createRoot(container!);

root.render(
  <StrictMode>
    <ToastContainer />
    <App />
  </StrictMode>,
);
