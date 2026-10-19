import { GroupProps } from "../../../../components/Text/Annotated/core";
import { isNested } from "../../../../components/Text/Annotated/utils/isNested.ts";
import { DefaultGroup } from "../../../default/annotation/group/DefaultGroup.tsx";
import {
  isBibleReferenceBody,
  isBibliographyReference,
  isInternalReference,
  isLetterReference,
  isReference,
} from "../ProjectAnnotationModel.ts";
import { BibleReferenceLink } from "./BibleReferenceLink.tsx";
import { BibliographyLink } from "./BibliographyLink.tsx";
import { InternalReferenceLink } from "./InternalReferenceLink.tsx";
import { LetterLink } from "./LetterLink.tsx";
import { ParagraphReferenceLink } from "./ParagraphReferenceLink.tsx";
import { isInternalReferenceUrl } from "./toInternalReferenceTarget.ts";
import { parseParagraphReference } from "./paragraphReference.ts";

// An internal reference points at a numbered header inside a document, e.g.
// "introVI.xml#intro.VI.5.3.1", "#intro.II.4.1" or "overview.xml#overview.4",
// or at a whole document, e.g. "introIV.xml". Letter references also point at
// whole documents ("let001.xml"), so those are excluded explicitly, as are
// paragraph references ("let093.xml#p.orig.21"), whose anchor looks the same.

export function KunstenaarsbrievenGroup(props: GroupProps) {
  const { group, children } = props;

  const internalReference = group.segments
    .flatMap((s) => s.annotations)
    .filter(isNested)
    .map((a) => a.body)
    .find(
      (body): boolean =>
        isInternalReference(body) &&
        isInternalReferenceUrl(body.url) &&
        !parseParagraphReference(body.url) &&
        !isLetterReference(body) &&
        !isBibliographyReference(body),
    );

  if (internalReference && isInternalReference(internalReference)) {
    return (
      <InternalReferenceLink url={internalReference.url}>
        {children}
      </InternalReferenceLink>
    );
  }

  // Before letter references: one to a paragraph in another letter is one too
  const paragraphTarget = group.segments
    .flatMap((s) => s.annotations)
    .filter(isNested)
    .map((a) => a.body)
    .map((body) =>
      isReference(body) ? parseParagraphReference(body.url) : null,
    )
    .find((target) => !!target);

  if (paragraphTarget) {
    return (
      <ParagraphReferenceLink target={paragraphTarget}>
        {children}
      </ParagraphReferenceLink>
    );
  }

  const bibliographyRef = group.segments
    .flatMap((s) => s.annotations)
    .filter(isNested)
    .map((a) => a.body)
    .find((body) => isBibliographyReference(body));

  if (bibliographyRef && isBibliographyReference(bibliographyRef)) {
    return (
      <BibliographyLink url={bibliographyRef.url}>{children}</BibliographyLink>
    );
  }

  const letterRef = group.segments
    .flatMap((s) => s.annotations)
    .filter(isNested)
    .map((a) => a.body)
    .find((body) => isLetterReference(body));

  if (letterRef && isLetterReference(letterRef)) {
    return <LetterLink url={letterRef.url}>{children}</LetterLink>;
  }

  const bibleRef = group.segments
    .flatMap((s) => s.annotations)
    .filter(isNested)
    .map((a) => a.body)
    .find((body) => isBibleReferenceBody(body));

  if (bibleRef && isBibleReferenceBody(bibleRef)) {
    return (
      <BibleReferenceLink cRef={bibleRef["tei:cRef"]}>
        {children}
      </BibleReferenceLink>
    );
  }

  // Not an internal, bibliography or letter reference: let the default group handle
  // external links and the modal-opening behavior unchanged.
  return <DefaultGroup {...props} />;
}
