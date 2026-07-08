import { GroupProps } from "../../../../components/Text/Annotated/core";
import { isNested } from "../../../../components/Text/Annotated/utils/isNested.ts";
import { DefaultGroup } from "../../../default/annotation/group/DefaultGroup.tsx";
import { isInternalReference } from "../ProjectAnnotationModel.ts";
import { InternalReferenceLink } from "./InternalReferenceLink.tsx";
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

  // Not an internal reference: let the default group handle external links
  // and the modal-opening behavior unchanged.
  return <DefaultGroup {...props} />;
}
