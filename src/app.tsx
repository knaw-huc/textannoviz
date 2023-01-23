import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
//import { Detail } from "./Detail"
import { Projects } from "./components/Projects/index";
import { ErrorPage } from "./error-page";
import { Providers } from "./Providers";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "detail/volumes/:volumeNum/openings/:openingNum",
    element: <Projects />,
    errorElement: <ErrorPage />,
  },
  {
    path: "detail/resolutions/:resolutionId",
    element: <Projects />,
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
