import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Header} from "./components/Header";
import Help from "./components/Help";
import {globaliseConfig} from "./projects/globalise/config/";
import {mondriaanConfig} from "./projects/mondriaan/config";
import {republicConfig} from "./projects/republic/config";
import {Search} from "./components/Search/Search";
import {Detail} from "./Detail";
import {ErrorPage} from "./ErrorPage";
import {ProjectConfig} from "./model/ProjectConfig";
import {useAnnotationStore} from "./stores/annotation";
import {useProjectStore} from "./stores/project";
import {getElasticIndices, sendSearchQuery} from "./utils/broccoli";

const {project, config} = createProjectConfig();
const router = await createRouter();

export default function App() {
  const setAnnotationTypesToInclude = useAnnotationStore(
      (state) => state.setAnnotationTypesToInclude,
  );
  const setProjectConfig = useProjectStore((state) => state.setProjectConfig);
  setAnnotationTypesToInclude(config.annotationTypesToInclude);
  setProjectConfig(config);

  return (
      <>
        <Header projectConfig={config}/>
        <RouterProvider router={router}/>
      </>
  );
}

async function createRouter() {
  const indices = await getElasticIndices(config);
  const searchResult = await sendSearchQuery({}, "Scan", 0, 0, config);
  const aggs = searchResult!.aggs;
  return createBrowserRouter([
        {
          path: "/",
          element: <Search
              project={project}
              projectConfig={config}
              indices={indices}
              facets={aggs}
              indexName={config.elasticIndexName ?? ""}
              searchFacetTitles={config.searchFacetTitles ?? {}}
          />,
          errorElement: <ErrorPage/>,
        },
        {
          path: "detail/:tier0/:tier1",
          element: <Detail project={project} config={config}/>,
          errorElement: <ErrorPage/>,
        },
        {
          path: "detail/:tier2",
          element: <Detail project={project} config={config}/>,
          errorElement: <ErrorPage/>,
        },
        {
          path: "help",
          element: <Help project={project} config={config}/>,
          errorElement: <ErrorPage/>,
        }
      ]
  );
}
function createProjectConfig() {
  const projectEnvVar = 'VITE_PROJECT';
  const project: string = import.meta.env[projectEnvVar];
  let config: ProjectConfig;

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
    default:
      throw new Error(`No project config defined for ${projectEnvVar}=${project}`)
  }
  return {project, config};
}
