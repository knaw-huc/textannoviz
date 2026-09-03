import { PageBody } from "../../../model/AnnoRepoAnnotation";

export function kunstenaarsbrievenPageLabelFormat(pageBody: PageBody) {
  /**
   * The page no. need to be build up by combining the values of the f and the n attributes of the pb element.
   * In letter 001a for example, there is <pb f="1v" n="3" xml:id="pb-orig-1v-3" facs="#zone-pb-1v-3"/> which should result in the page number 1v:3.
   * See: https://github.com/knaw-huc/textannoviz/issues/564#issuecomment-4243854922
   */
  const n = pageBody.n;
  const f = pageBody["tei:f"];
  const label = f ? `${f}:${n}` : n;

  return label;
}
