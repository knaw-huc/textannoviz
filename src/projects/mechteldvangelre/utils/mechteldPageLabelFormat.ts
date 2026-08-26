import { PageBody } from "../../../model/AnnoRepoAnnotation";

export function mechteldPageLabelFormat(pageBody: PageBody) {
  const f = pageBody["tei:f"];

  let label: string;

  // The corpus is single-folio.
  switch (f) {
    case "s1r":
      label = "1 recto";
      break;
    case "1v":
      label = "1 verso";
      break;
    default:
      label = f ?? "Geen folionummer in data";
  }

  return label;
}
