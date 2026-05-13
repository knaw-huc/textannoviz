import { Tabs, TabList, Tab, TabPanel, type Key } from "react-aria-components";
import { ArtworkListContainer } from "../../kunstenaarsbrieven/artworks/ArtworkListContainer";
import { ArtworkCard } from "./ArtworkCard";
import { ArtworkData } from "./Artworks";
import React from "react";
import { Artwork } from "../../kunstenaarsbrieven/annotation/ProjectAnnotationModel";
import { useLocation } from "react-router";
import { getTabFromHash } from "./utils/getTabFromHash";

const tabStyling =
  "flex cursor-pointer items-end border-b-4 border-neutral-50 p-2 text-left text-sm font-normal text-neutral-600 outline-none hover:border-neutral-600 aria-selected:border-neutral-600 aria-selected:font-bold";

export function ArtworkTabs(props: { artworks: Partial<ArtworkData> }) {
  const [activeTab, setActiveTab] = React.useState<Key>("artworksAll");
  const [query, setQuery] = React.useState("");
  const [isGlobal, setIsGlobal] = React.useState(false);
  const deferredQuery = React.useDeferredValue(query);
  const location = useLocation();

  const globalPool = React.useMemo(() => {
    return Object.values(props.artworks).flat();
  }, [props.artworks]);

  const {
    illustrated = [],
    sketches = [],
    "non-illustrated": nonIllustrated = [],
  } = props.artworks;

  function getDataSource(tabItems: Artwork[]) {
    return isGlobal && query.trim() ? globalPool : tabItems;
  }

  React.useEffect(() => {
    function updateTabFromHash() {
      const hash = location.hash.slice(1);
      const tab = getTabFromHash(hash);
      setActiveTab(tab);
    }

    updateTabFromHash();
  }, [location.hash]);

  function handleGlobalSearchCheckbox(
    event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) {
    setIsGlobal(event.target.checked);
    if (event.target.checked) {
      setActiveTab("artworksAll");
    }
  }

  return (
    <Tabs
      className="flex w-full flex-col gap-4"
      selectedKey={activeTab}
      onSelectionChange={(key) => setActiveTab(key)}
    >
      <TabList className="sticky top-0 z-20 flex w-full gap-4 border-b border-neutral-600 bg-white px-6 pt-6">
        <Tab id="artworksAll" className={tabStyling}>
          All artworks
        </Tab>
        <Tab id="artworksVG" className={tabStyling}>
          Artworks by Vincent van Gogh
        </Tab>
        <Tab id="artworksOthers" className={tabStyling}>
          Artworks by other artists
        </Tab>
        <Tab id="nonIllustrated" className={tabStyling}>
          Artworks (non-illustrated)
        </Tab>
        <Tab id="sketches" className={tabStyling}>
          Sketches
        </Tab>
      </TabList>
      <div className="sticky top-16 z-10 mb-8 space-y-4 rounded-xl bg-neutral-100 p-6 shadow-inner">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder={
              isGlobal
                ? "Search all sections..."
                : "Search within current section..."
            }
            className="flex-grow rounded-lg border-neutral-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <label className="flex cursor-pointer items-center gap-2 font-medium">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 accent-blue-600"
              checked={isGlobal}
              onChange={(event) => handleGlobalSearchCheckbox(event)}
            />
            Global Search
          </label>
        </div>
      </div>
      {query.trim() && (
        <div className="mb-4 ml-8 text-xs font-semibold uppercase tracking-wider text-blue-500">
          {isGlobal
            ? `Showing results from all sections matching '${query}'`
            : `Showing results from current section matching '${query}'`}
        </div>
      )}
      <TabPanel
        id="artworksAll"
        className="grid gap-6 px-8 pb-8"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}
      >
        <ArtworkListContainer
          items={getDataSource(illustrated)}
          CardComponent={ArtworkCard}
          query={deferredQuery}
          isGlobal={isGlobal}
        />
      </TabPanel>
      <TabPanel
        id="artworksVG"
        className="grid gap-6 px-8 pb-8"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}
      >
        <ArtworkListContainer
          items={getDataSource(illustrated)}
          filter={(item) =>
            item.relation?.some((r) => r.ref === "bio.xml#vg_2000") ?? false
          }
          CardComponent={ArtworkCard}
          query={deferredQuery}
          isGlobal={isGlobal}
        />
      </TabPanel>
      <TabPanel
        id="artworksOthers"
        className="grid gap-6 px-8 pb-8"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}
      >
        <ArtworkListContainer
          items={getDataSource(illustrated)}
          filter={(item) =>
            item.relation?.some((r) => r.ref !== "bio.xml#vg_2000") ?? false
          }
          CardComponent={ArtworkCard}
          query={deferredQuery}
          isGlobal={isGlobal}
        />
      </TabPanel>
      <TabPanel
        id="nonIllustrated"
        className="grid gap-6 px-8 pb-8"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}
      >
        <ArtworkListContainer
          items={getDataSource(nonIllustrated)}
          CardComponent={ArtworkCard}
          query={deferredQuery}
          isGlobal={isGlobal}
        />
      </TabPanel>
      <TabPanel
        id="sketches"
        className="grid gap-6 px-8 pb-8"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}
      >
        <ArtworkListContainer
          items={getDataSource(sketches)}
          CardComponent={ArtworkCard}
          query={deferredQuery}
          isGlobal={isGlobal}
        />
      </TabPanel>
    </Tabs>
  );
}
