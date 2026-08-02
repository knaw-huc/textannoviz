import React from "react";
import { toast } from "../../../utils/toast.ts";
import { handleAbort } from "../../../utils/handleAbort";
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import { TAB_IDS, TabId } from "./utils/hashConfig.ts";
import { parseContent } from "./parseContent.ts";
import { getTabFromHash } from "./utils/getTabFromHash.ts";
import { isNavigationHash } from "./utils/isNavigationHash.ts";

const tabStyling =
  "flex cursor-pointer items-end border-b-4 border-neutral-50 p-2 text-left text-sm font-normal text-neutral-600 outline-none hover:border-neutral-600 aria-selected:border-neutral-600 aria-selected:font-bold";

export const Bibliography = () => {
  const [content, setContent] = React.useState<string>("");
  const biblUrl = useProjectStore(projectConfigSelector).biblUrl.en;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { intro, editors, vangogh } = React.useMemo(
    () => parseContent(content),
    [content],
  );

  React.useEffect(() => {
    const aborter = new AbortController();
    async function initBibl(aborter: AbortController) {
      if (!biblUrl) return;
      const newContent = await fetchBibl(biblUrl, aborter.signal);
      if (!newContent) return;

      setContent(newContent);
    }

    initBibl(aborter).catch(handleAbort);

    return () => {
      aborter.abort();
    };
  }, []);

  React.useEffect(() => {
    const hashId = location.hash.slice(1);
    if (!hashId) return;

    const tabFromHash = getTabFromHash(hashId);
    if (tabFromHash) {
      const currentTab = searchParams.get("tab");
      if (currentTab !== tabFromHash) {
        const isNavHash = isNavigationHash(hashId);

        const hashToPreserve = isNavHash ? "" : location.hash;

        navigate(`?tab=${tabFromHash}${hashToPreserve}`, { replace: true });
      }
    }
  }, [location.hash, navigate, searchParams]);

  React.useEffect(() => {
    if (!content) return;
    const biblId = location.hash.slice(1);
    if (!biblId) return;
    const element = document.getElementById(biblId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("bibl-highlight");
    }
  }, [content, location.hash]);

  function handleTabChange(id: TabId) {
    const currentTab = searchParams.get("tab") ?? TAB_IDS.vangogh;
    if (!currentTab) return;

    const isSameTab = id === currentTab;

    if (isSameTab && location.hash) {
      return;
    }

    navigate(`?tab=${id}`, { replace: true });
  }

  if (!content) return null;

  return (
    <main className="ml-auto mr-auto mt-0 max-w-[800px]">
      <div dangerouslySetInnerHTML={{ __html: intro }} />
      <Tabs
        className="flex w-full flex-col gap-4"
        selectedKey={searchParams.get("tab") || TAB_IDS.vangogh}
        onSelectionChange={(key) => handleTabChange(key as TabId)}
      >
        <TabList className="sticky top-0 z-20 flex w-full gap-4 border-b border-neutral-600 bg-white px-6 pt-6">
          <Tab id={TAB_IDS.vangogh} className={tabStyling}>
            Works read by Van Gogh
          </Tab>
          <Tab id={TAB_IDS.editors} className={tabStyling}>
            Bibliography
          </Tab>
        </TabList>
        <TabPanel id={TAB_IDS.vangogh}>
          <div dangerouslySetInnerHTML={{ __html: vangogh }} />
        </TabPanel>
        <TabPanel id={TAB_IDS.editors}>
          <div dangerouslySetInnerHTML={{ __html: editors }} />
        </TabPanel>
      </Tabs>
    </main>
  );
};

async function fetchBibl(
  url: string,
  signal: AbortSignal,
): Promise<string | null> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }

  return await response.text();
}
