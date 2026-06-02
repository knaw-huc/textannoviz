import { Tabs, TabList, Tab, TabPanel } from "react-aria-components";
import { ArtworkListContainer } from "../../kunstenaarsbrieven/artworks/ArtworkListContainer";
import { ArtworkCard } from "./ArtworkCard";
import { ArtworkData } from "./Artworks";
import React from "react";
import { Artwork } from "../../kunstenaarsbrieven/annotation/ProjectAnnotationModel";
import { ArtworkSearch } from "./ArtworkSearch";
import { useNavigate, useSearchParams } from "react-router";
import { useLocation } from "react-router";
import { getTabFromHash } from "./utils/getTabFromHash";
import { isNavigationHash } from "./utils/isNavigationHash";
import { TAB_IDS, TabId } from "./utils/hashConfig";

const tabStyling =
  "flex cursor-pointer items-end border-b-4 border-neutral-50 p-2 text-left text-sm font-normal text-neutral-600 outline-none hover:border-neutral-600 aria-selected:border-neutral-600 aria-selected:font-bold";

export function ArtworkTabs(props: { artworks: Partial<ArtworkData> }) {
  const [query, setQuery] = React.useState("");
  const [isGlobal, setIsGlobal] = React.useState(false);
  const deferredQuery = React.useDeferredValue(query);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const globalPool = React.useMemo(() => {
    return Object.values(props.artworks).flat();
  }, [props.artworks]);

  const {
    illustrated = [],
    sketches = [],
    "non-illustrated": nonIllustrated = [],
  } = props.artworks;

  React.useEffect(() => {
    const hashId = location.hash.slice(1);
    if (!hashId) return;

    const tabFromHash = getTabFromHash(hashId);
    if (tabFromHash) {
      const currentTab = searchParams.get("tab");
      if (currentTab !== tabFromHash) {
        const isNavHash = isNavigationHash(hashId);

        // Only preserve hash if it's an artwork ID, not a navigation hash
        const hashToPreserve = isNavHash ? "" : location.hash;

        navigate(`?tab=${tabFromHash}${hashToPreserve}`, { replace: true });
      }
    }
  }, [location.hash, navigate, searchParams]);

  function getDataSource(tabItems: Artwork[]) {
    return isGlobal && query.trim() ? globalPool : tabItems;
  }

  function handleQueryChange(newQuery: string) {
    setQuery(newQuery);
  }

  function handleIsGlobalChecked(newChecked: boolean) {
    setIsGlobal(newChecked);
  }

  function handleTabChange(id: TabId) {
    const currentTab = searchParams.get("tab") ?? TAB_IDS.artworksAll;
    if (!currentTab) return;

    const isSameTab = id === currentTab;

    if (isSameTab && location.hash) {
      return;
    }

    navigate(`?tab=${id}`, { replace: true });
  }

  return (
    <Tabs
      className="flex w-full flex-col gap-4"
      selectedKey={searchParams.get("tab") || "artworksAll"}
      onSelectionChange={(key) => handleTabChange(key as TabId)}
    >
      <TabList className="sticky top-0 z-20 flex w-full gap-4 border-b border-neutral-600 bg-white px-6 pt-6">
        <Tab id={TAB_IDS.artworksAll} className={tabStyling}>
          All artworks
        </Tab>
        <Tab id={TAB_IDS.artworksVG} className={tabStyling}>
          Artworks by Vincent van Gogh
        </Tab>
        <Tab id={TAB_IDS.artworksOthers} className={tabStyling}>
          Artworks by other artists
        </Tab>
        <Tab id={TAB_IDS.nonIllustrated} className={tabStyling}>
          Artworks (non-illustrated)
        </Tab>
        <Tab id={TAB_IDS.sketches} className={tabStyling}>
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
        id={TAB_IDS.artworksAll}
        className="grid gap-6 px-8 pb-8"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}
      >
        <ArtworkListContainer
          items={getDataSource(illustrated)}
          CardComponent={ArtworkCard}
          query={deferredQuery}
          isGlobal={isGlobal}
          setActiveTab={handleTabChange}
        />
      </TabPanel>
      <TabPanel
        id={TAB_IDS.artworksVG}
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
          setActiveTab={handleTabChange}
        />
      </TabPanel>
      <TabPanel
        id={TAB_IDS.artworksOthers}
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
          setActiveTab={handleTabChange}
        />
      </TabPanel>
      <TabPanel
        id={TAB_IDS.nonIllustrated}
        className="grid gap-6 px-8 pb-8"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}
      >
        <ArtworkListContainer
          items={getDataSource(nonIllustrated)}
          CardComponent={ArtworkCard}
          query={deferredQuery}
          isGlobal={isGlobal}
          setActiveTab={handleTabChange}
        />
      </TabPanel>
      <TabPanel
        id={TAB_IDS.sketches}
        className="grid gap-6 px-8 pb-8"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}
      >
        <ArtworkListContainer
          items={getDataSource(sketches)}
          CardComponent={ArtworkCard}
          query={deferredQuery}
          isGlobal={isGlobal}
          setActiveTab={handleTabChange}
        />
      </TabPanel>
    </Tabs>
  );
}
