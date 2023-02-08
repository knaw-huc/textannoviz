import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import { republicConfig } from "./components/Projects/republic/config";
import { Detail } from "./Detail";
import { ErrorPage } from "./error-page";
import { Providers } from "./Providers";

const project = "republic";
const config = republicConfig

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "detail/volumes/:volumeNum/openings/:openingNum",
    element: <Detail project={project} config={config} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "detail/resolutions/:resolutionId",
    element: <Detail project={project} config={config} />,
    errorElement: <ErrorPage />,
  },
]);

export default function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
