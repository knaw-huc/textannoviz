import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Header } from "./components/Header";
import Help from "./components/Help";
import { globaliseConfig } from "./components/Projects/globalise/config/";
import { mondriaanConfig } from "./components/Projects/mondriaan/config";
import { republicConfig } from "./components/Projects/republic/config";
import { Search } from "./components/Search/Search";
import { Detail } from "./Detail";
import { ErrorPage } from "./ErrorPage";
import { ProjectConfig } from "./model/ProjectConfig";
import { useAnnotationStore } from "./stores/annotation";
import { useProjectStore } from "./stores/project";
import { getElasticIndices, sendSearchQuery } from "./utils/broccoli";

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

const indices = await getElasticIndices(config);
const searchResult = await sendSearchQuery({}, "Scan", 0, 0, config);
const aggs = searchResult!.aggs;

const router = createBrowserRouter(
  config.createRouter(
    <Help project={project} config={config} />,
    <Detail project={project} config={config} />,
    <Search
      project={project}
      projectConfig={config}
      indices={indices}
      facets={aggs}
      indexName={config.elasticIndexName ?? ""}
      searchFacetTitles={config.searchFacetTitles ?? {}}
    />,
    <ErrorPage />,
  ),
);

export default function App() {
  const setAnnotationTypesToInclude = useAnnotationStore(
    (state) => state.setAnnotationTypesToInclude,
  );
  const setProjectConfig = useProjectStore((state) => state.setProjectConfig);

  setAnnotationTypesToInclude(config.annotationTypesToInclude);
  setProjectConfig(config);
  return (
    <>
      <Header projectConfig={config} />
      <RouterProvider router={router} />
    </>
  );
}
