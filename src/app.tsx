import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import { globaliseConfig } from "./components/Projects/globalise/config/";
import { mondriaanConfig } from "./components/Projects/mondriaan/config";
import { republicConfig } from "./components/Projects/republic/config";
import { Search } from "./components/Search/Search";
import { Detail } from "./Detail";
import { ErrorPage } from "./error-page";
import { ProjectConfig } from "./model/ProjectConfig";
import { useAnnotationStore } from "./stores/annotation";

const project: string = import.meta.env.VITE_PROJECT;
let config!: ProjectConfig;

switch (project) {
  case "republic":
    config = republicConfig;
    break;
  case "globalise":
    config = globaliseConfig;
    break;
  case "mondriaan":
    config = mondriaanConfig;
    break;
}

const router = createBrowserRouter(
  config.createRouter(
    <Home project={project} config={config} />,
    <Detail project={project} config={config} />,
    <Search project={project} projectConfig={config} />,
    <ErrorPage />
  )
);

export default function App() {
  const setAnnotationTypesToInclude = useAnnotationStore(
    (state) => state.setAnnotationTypesToInclude
  );

  setAnnotationTypesToInclude(config.annotationTypesToInclude);
  return <RouterProvider router={router} />;
}
