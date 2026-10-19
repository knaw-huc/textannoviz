import { PropsWithChildren } from "react";
import { useParams } from "react-router";
import { useRevealElement } from "../../../../components/Detail/useRevealElement.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../../stores/project";
import {
  getParagraphPanel,
  ParagraphReferenceTarget,
} from "./paragraphReference.ts";
import { toLetterDetailPath } from "./toLetterDetailPath.ts";

export function ParagraphReferenceLink(
  props: PropsWithChildren<{
    target: ParagraphReferenceTarget;
    className?: string;
  }>,
) {
  const { target, className, children } = props;
  const { letterId, paragraphId } = target;
  const revealElement = useRevealElement();
  const projectName = useProjectStore(projectConfigSelector).id;
  const { tier2 } = useParams();

  const isInOtherLetter = !!letterId && !tier2?.endsWith(`:${letterId}`);

  // Nothing is undone on unmount: revealing a panel can swap out the one
  // holding this link on a narrow screen, while the scroll should go on. The
  // highlight goes with the letter's text, or with the next reveal.
  function go() {
    if (isInOtherLetter) {
      // Scrolled to on load by useRevealHashTarget
      const path = toLetterDetailPath(letterId, projectName);
      window.open(`${path}#${paragraphId}`, "_blank");
    } else {
      revealElement(paragraphId, getParagraphPanel(paragraphId) ?? "text.orig");
    }
  }

  return (
    <span
      className={`closedNestedAnnotation cursor-pointer ${className ?? ""}`}
      role="link"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => {
        if (e.key === "Enter") go();
      }}
    >
      {children}
    </span>
  );
}
