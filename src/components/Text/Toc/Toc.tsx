import { useSyncHashWithHeader } from "./useSyncHashWithHeader.tsx";
import { useTextStore } from "../../../stores/text/text-store.ts";
import { MouseEvent } from "react";

type TocProps = {
  headers: TocHeader[];
};

export const Toc = ({ headers }: TocProps) => {
  useSyncHashWithHeader();

  if (!headers.length) {
    return null;
  }
  return (
    <nav aria-label="Table of contents">
      <ul className="toc-list">
        {headers.map((head) => (
          <TocItem key={head.id} {...head} />
        ))}
      </ul>
    </nav>
  );
};

export type TocHeader = {
  id: string;
  label: string;
  level: number;
};

const TocItem = ({ id, label, level }: TocHeader) => {
  const setActiveHeader = useTextStore((s) => s.setActiveHeader);
  const activeHeader = useTextStore((s) => s.activeHeader);
  const isActive = activeHeader === id;

  const marginLeft = `${level * 1.25}rem`;

  function handleClick(e: MouseEvent) {
    e.preventDefault();
    const idSelector = `#${CSS.escape(id)}`;
    const headerElements = document.querySelectorAll(idSelector);
    if (!headerElements.length) {
      console.warn(`No elements for ${idSelector}`);
      return;
    }
    headerElements.forEach((e) => e.scrollIntoView());
    setActiveHeader(id);
  }

  return (
    <li
      className={`toc-item${isActive ? " toc-item-active" : ""}`}
      style={{ marginLeft }}
    >
      <a href={`#${id}`} onClick={handleClick}>
        {label}
      </a>
    </li>
  );
};
