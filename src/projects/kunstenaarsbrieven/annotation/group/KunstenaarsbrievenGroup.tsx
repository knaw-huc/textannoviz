import { GroupProps } from "../../../../components/Text/Annotated/core";
import { isNested } from "../../../../components/Text/Annotated/utils/isNested.ts";
import { DefaultGroup } from "../../../default/annotation/group/DefaultGroup.tsx";
import {
  isBibliographyReference,
  isInternalReference,
  isLetterReference,
} from "../ProjectAnnotationModel.ts";
import { BibliographyLink } from "./BibliographyLink.tsx";
import { InternalReferenceLink } from "./InternalReferenceLink.tsx";
import { LetterLink } from "./LetterLink.tsx";
import { INTERNAL_ANCHOR } from "./toInternalReferenceTarget.ts";

// An internal reference points at a numbered header inside a document, e.g.
// "introVI.xml#intro.VI.5.3.1", "#intro.II.4.1" or "overview.xml#overview.4".
// The numeric-header anchor (INTERNAL_ANCHOR) is what distinguishes it from
// bibliography refs and external links.

export function KunstenaarsbrievenGroup(props: GroupProps) {
  const { group, children } = props;

  const internalReference = group.segments
    .flatMap((s) => s.annotations)
    .filter(isNested)
    .map((a) => a.body)
    .find(
      (body) => isInternalReference(body) && INTERNAL_ANCHOR.test(body.url),
    );

  if (internalReference && isInternalReference(internalReference)) {
    return (
      <InternalReferenceLink url={internalReference.url}>
        {children}
      </InternalReferenceLink>
    );
  }

  const biblRef = group.segments
    .flatMap((s) => s.annotations)
    .filter(isNested)
    .map((a) => a.body)
    .find((body) => isBibliographyReference(body));

  if (biblRef && isBibliographyReference(biblRef)) {
    return <BibliographyLink url={biblRef.url}>{children}</BibliographyLink>;
  }

  const letterRef = group.segments
    .flatMap((s) => s.annotations)
    .filter(isNested)
    .map((a) => a.body)
    .find((body) => isLetterReference(body));

  if (letterRef && isLetterReference(letterRef)) {
    return <LetterLink url={letterRef.url}>{children}</LetterLink>;
  }

  // Not an internal, bibliography or letter reference: let the default group handle
  // external links and the modal-opening behavior unchanged.
  return <DefaultGroup {...props} />;
}
