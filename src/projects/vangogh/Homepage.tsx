import { Link } from "react-aria-components";
import logoHuygens from "../../assets/logo-huygens.png";
import logoVGM from "../../assets/logo-vgm.png";
import {
  projectConfigSelector,
  useProjectStore,
  useTranslateProject,
} from "../../stores/project";
import React from "react";
import { handleAbort } from "../../utils/handleAbort";
import { fetchText } from "../../utils/fetchText";

const homeImages = Object.values(
  import.meta.glob("../../assets/vanGogh-home-images/*.jpg", {
    eager: true,
    import: "default",
  }),
) as string[];

function pickTwoRandomImages(images: string[]): [string, string] {
  const firstIndex = Math.floor(Math.random() * images.length);
  let secondIndex = Math.floor(Math.random() * (images.length - 1));
  if (secondIndex >= firstIndex) secondIndex += 1;
  return [images[firstIndex], images[secondIndex]];
}

function randomTiltDeg(direction: "left" | "right"): number {
  const min = 2;
  const max = 8;
  const amount = min + Math.random() * (max - min);
  return direction === "right" ? amount : -amount;
}

function splitAfterNthParagraph(html: string, n: number): [string, string] {
  const re = /<\/p>/gi;
  let match: RegExpExecArray | null;
  let count = 0;
  while ((match = re.exec(html)) !== null) {
    count += 1;
    if (count === n) {
      const idx = match.index + match[0].length;
      return [html.slice(0, idx), html.slice(idx)];
    }
  }
  return [html, ""];
}

function splitLastParagraph(html: string): [string, string] {
  const re = /<p\b[\s\S]*?<\/p>/gi;
  let last: RegExpExecArray | null = null;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    last = match;
  }
  if (!last) return [html, ""];
  return [
    html.slice(0, last.index) + html.slice(last.index + last[0].length),
    last[0],
  ];
}

export const Homepage = () => {
  const translateProject = useTranslateProject();
  const [content, setContent] = React.useState<string>();
  const [imagePair] = React.useState(() => pickTwoRandomImages(homeImages));
  const [rotations] = React.useState(() => [
    randomTiltDeg("left"),
    randomTiltDeg("right"),
  ]);
  const homeUrl = useProjectStore(projectConfigSelector).homeUrl;
  const [contentWithoutCopyright, copyrightHtml] = content
    ? splitLastParagraph(content)
    : ["", ""];
  const paragraphCount = contentWithoutCopyright
    ? (contentWithoutCopyright.match(/<p[\s>]/gi) ?? []).length
    : 0;
  const [contentBeforeButton, contentAfterButton] = contentWithoutCopyright
    ? splitAfterNthParagraph(contentWithoutCopyright, 2)
    : ["", ""];

  React.useEffect(() => {
    const aborter = new AbortController();
    async function initHome(aborter: AbortController) {
      const newContent = await fetchText(homeUrl, aborter.signal);
      if (!newContent) return;

      setContent(newContent);
    }

    initHome(aborter).catch(handleAbort);

    return () => {
      aborter.abort();
    };
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="mx-auto mb-6 mt-6 flex w-full max-w-[1400px] flex-1 flex-col rounded-sm bg-[#2F72CB] p-8 text-white md:mt-10 xl:mb-10">
        <div className="mx-auto grid w-full max-w-4xl flex-1 grid-cols-1 content-center md:grid-cols-[29%_8%_63%] [&_.about]:contents [&_a]:text-white [&_a]:underline [&_h1]:col-span-full [&_h1]:mt-0 [&_h1]:leading-tight md:[&_h1]:leading-normal [&_h2]:col-span-full [&_h2]:mt-0 [&_h2]:leading-tight md:[&_h2]:leading-normal [&_p]:col-start-1 [&_p]:mb-4 md:[&_p]:col-start-3">
          {content && (
            <div
              className="contents"
              dangerouslySetInnerHTML={{ __html: contentBeforeButton }}
            />
          )}

          {content && paragraphCount >= 2 && (
            <Link
              className="col-start-1 mb-4 justify-self-start rounded-full bg-[#DBD3B3] px-4 py-2 !text-black !no-underline outline-none hover:!underline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2F72CB] md:col-start-3"
              href="/search"
            >
              {translateProject("SCROLL_TO_LETTERS")}{" "}
            </Link>
          )}

          {contentAfterButton && (
            <div
              className="contents"
              dangerouslySetInnerHTML={{ __html: contentAfterButton }}
            />
          )}

          {paragraphCount > 0 && (
            <div
              className="relative col-start-1 mx-auto mb-8 w-full max-w-96 self-start max-md:![grid-row:auto] md:mb-0 md:max-w-none"
              style={{
                gridRow: `3 / span ${
                  paragraphCount + (paragraphCount >= 2 ? 1 : 0)
                }`,
              }}
              aria-hidden="true"
            >
              <img
                src={imagePair[0]}
                alt=""
                className="block w-[60%] max-w-72 md:w-[70%] md:max-w-none"
                style={{ transform: `rotate(${rotations[0]}deg)` }}
              />
              <img
                src={imagePair[1]}
                alt=""
                className="absolute right-0 top-[40px] w-[60%] max-w-72 shadow-[0_10px_24px_rgba(0,0,0,0.4)] md:top-[100px] md:w-[70%] md:max-w-none"
                style={{ transform: `rotate(${rotations[1]}deg)` }}
              />
            </div>
          )}

          <div className="col-span-full grid grid-cols-1 items-end gap-4 md:grid-cols-[29%_8%_63%] md:gap-0">
            <div className="flex max-w-3xl items-end gap-8">
              <img src={logoVGM} className="h-20" alt="Van Gogh Museum" />
              <img src={logoHuygens} className="h-14" alt="Huygens Institute" />
            </div>
            {copyrightHtml && (
              <div
                className="text-sm md:col-start-3 [&_p]:mb-0"
                dangerouslySetInnerHTML={{ __html: copyrightHtml }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
