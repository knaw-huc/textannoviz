import { Panel } from "./Panel";
import { usePanelLayout } from "./usePanelLayout.tsx";
import { useDetailViewStore } from "../../stores/detail-view/detail-view-store.ts";

export const Panels = () => {
  usePanelLayout();
  const activePanels = useDetailViewStore((state) => state.activePanels);
  return (
    <>
      {activePanels.map((panel) => (
        <Panel
          key={panel.name}
          panelToRender={panel.panel}
          panelName={panel.name}
        />
      ))}
    </>
  );
};
