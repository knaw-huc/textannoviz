import { useMiradorStore } from "../../stores/mirador";
import { projectConfigSelector, useProjectStore } from "../../stores/project";

export function Mirador() {
  const miradorStore = useMiradorStore((state) => state.miradorStore);
  const projectConfig = useProjectStore(projectConfigSelector);

  const id = setInterval(() => {
    if (miradorStore) {
      if (
        miradorStore.getState().viewers[projectConfig.id]?.x &&
        typeof miradorStore.getState().viewers[projectConfig.id].x === "number"
      ) {
        console.log("JAAAAA");
        clearInterval(id);
      }
    }
  }, 250);

  return (
    <div
      id="mirador"
      className="bg-brand1Grey-50 sticky top-0 hidden h-[calc(100vh-79px)] w-7/12 grow self-stretch overflow-auto lg:flex"
    ></div>
  );
}
