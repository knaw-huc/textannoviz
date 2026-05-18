import { Tabs, TabList, Tab, TabPanel, type Key } from "react-aria-components";
import { ArtworkListContainer } from "../../kunstenaarsbrieven/artworks/ArtworkListContainer";
import { ArtworkCard } from "./ArtworkCard";
import { ArtworkData } from "./Artworks";
import React from "react";
import { Artwork } from "../../kunstenaarsbrieven/annotation/ProjectAnnotationModel";
import { ArtworkSearch } from "./ArtworkSearch";
// import { useLocation } from "react-router";
// import { getTabFromHash } from "./utils/getTabFromHash";

const tabStyling =
  "flex cursor-pointer items-end border-b-4 border-neutral-50 p-2 text-left text-sm font-normal text-neutral-600 outline-none hover:border-neutral-600 aria-selected:border-neutral-600 aria-selected:font-bold";

export function ArtworkTabs(props: { artworks: Partial<ArtworkData> }) {
  const [activeTab, setActiveTab] = React.useState<Key>("artworksAll");
  const [query, setQuery] = React.useState("");
  const [isGlobal, setIsGlobal] = React.useState(false);
  const deferredQuery = React.useDeferredValue(query);
  // const location = useLocation();

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

  // React.useEffect(() => {
  //   function updateTabFromHash() {
  //     const hash = location.hash.slice(1);
  //     const tab = getTabFromHash(hash);
  //     setActiveTab(tab);
  //   }

  //   updateTabFromHash();
  // }, [location.hash]);

  function handleQueryChange(newQuery: string) {
    setQuery(newQuery);
  }

  function handleIsGlobalChecked(newChecked: boolean) {
    setIsGlobal(newChecked);
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

      <ArtworkSearch
        query={query}
        isGlobal={isGlobal}
        handleQueryChange={handleQueryChange}
        handleIsGlobalChecked={handleIsGlobalChecked}
      />

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
          setActiveTab={setActiveTab}
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
          setActiveTab={setActiveTab}
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
          setActiveTab={setActiveTab}
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
          setActiveTab={setActiveTab}
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
          setActiveTab={setActiveTab}
        />
      </TabPanel>
    </Tabs>
  );
}
