import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import { globaliseConfig } from "./components/Projects/globalise/config/";
import { republicConfig } from "./components/Projects/republic/config";
import { Detail } from "./Detail";
import { ErrorPage } from "./error-page";
import { Providers } from "./Providers";

const project: string = process.env.PROJECT;
const config = project === "globalise" ? globaliseConfig : republicConfig;

const router = createBrowserRouter(
  config.createRouter(
    <Home project={project} config={config} />,
    <Detail project={project} config={config} />,
    <ErrorPage />
  )
);

export default function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
