import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import { globaliseConfig } from "./components/Projects/globalise/config/";
import { republicConfig } from "./components/Projects/republic/config";
import { Search } from "./components/Search/Search";
import { Detail } from "./Detail";
import { ErrorPage } from "./error-page";

const project: string = import.meta.env.VITE_PROJECT;
const config = project === "globalise" ? globaliseConfig : republicConfig;

const router = createBrowserRouter(
  config.createRouter(
    <Home project={project} config={config} />,
    <Detail project={project} config={config} />,
    <Search project={project} projectConfig={config} />,
    <ErrorPage />
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
