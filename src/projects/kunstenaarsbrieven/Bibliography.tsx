import React from "react";
import { toast } from "../../utils/toast.ts";
import { handleAbort } from "../../utils/handleAbort";
import { getUrlHash } from "../../utils/url/UrlHashUtils.ts";

type BibliographyProps = {
  getUrl: (lang?: string) => string;
  interfaceLang?: string;
};

export const Bibliography = (props: BibliographyProps) => {
  const [content, setContent] = React.useState<string>();

  React.useEffect(() => {
    const aborter = new AbortController();
    const url = props.getUrl(props.interfaceLang);
    async function initBibl(aborter: AbortController) {
      const newContent = await fetchBibl(url, aborter.signal);
      if (!newContent) return;

      setContent(newContent);
    }

    initBibl(aborter).catch(handleAbort);

    return () => {
      aborter.abort();
    };
  }, [props.getUrl, props.interfaceLang]);

  React.useEffect(() => {
    if (!content) return;
    const biblId = getUrlHash();
    if (!biblId) return;
    const element = document.getElementById(biblId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("bibl-highlight");
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
