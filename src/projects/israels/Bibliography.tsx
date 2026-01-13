import React from "react";
import { toast } from "../../utils/toast.ts";
import { handleAbort } from "../../utils/handleAbort";
import { getViteEnvVars } from "../../utils/viteEnvVars";
import { projectConfigSelector, useProjectStore } from "../../stores/project";

export const Bibliography = () => {
  const [content, setContent] = React.useState<string>();

  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;

  const { israelsBiblENUrl, israelsBiblNLUrl } = getViteEnvVars();

  React.useEffect(() => {
    const aborter = new AbortController();
    const url = interfaceLang === "en" ? israelsBiblENUrl : israelsBiblNLUrl;
    async function initBibl(aborter: AbortController) {
      const newContent = await fetchBibl(url, aborter.signal);
      if (!newContent) return;

      setContent(newContent);
    }

    initBibl(aborter).catch(handleAbort);

    return () => {
      aborter.abort();
    };
  }, [interfaceLang, israelsBiblENUrl, israelsBiblNLUrl]);

  React.useEffect(() => {
    if (!content) return;
    const biblId = window.location.hash.split("#")[1];
    if (!biblId) return;
    const element = document.getElementById(biblId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("bibl-highlight");
      const timeout = setTimeout(() => {
        element.classList.remove("bibl-highlight");
      }, 2000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [content]);

  return content ? (
    <main
      className="ml-auto mr-auto mt-0 max-w-[640px]"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  ) : null;
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
