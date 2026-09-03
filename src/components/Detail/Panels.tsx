import { Panel } from "./Panel";
import { usePanelLayout } from "./usePanelLayout.tsx";
import { useRevealEntityMatch } from "./useRevealEntityMatch.tsx";
import { useDetailViewStore } from "../../stores/detail-view/detail-view-store.ts";

export const Panels = () => {
  usePanelLayout();
  useRevealEntityMatch();
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
