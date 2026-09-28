import { GetLocationTexts } from "../../../components/Text/Annotated/utils/resolveEntityMatches";
import { KunstenaarsbrievenTextViews } from "../annotation/ProjectAnnotationModel";

/**
 * The texts the notes tab renders, in the order it renders them.
 *
 * Mirrors NotesPanel: the ogtNotes block first, then one text per footnote.
 * The resolver sends the reader to the first of these holding an entity
 * match, so a divergence would scroll past the note they see first — keep
 * the two in step.
 */
export const getNotesTexts: GetLocationTexts = (views, config) => {
  const { textNotes, ogtNotes } = views as KunstenaarsbrievenTextViews;

  // NotesPanel reads ogtNotes in English whatever the interface language,
  // and leaves the block out when its body is empty
  const ogtNotesText = ogtNotes?.en;
  const notes = textNotes?.[config.selectedLanguage];

  return [
    ...(ogtNotesText?.body ? [ogtNotesText] : []),
    // Deliberately unsorted: Object.values follows the same key order as
    // NotesPanel's Object.entries, so the two agree without either imposing
    // an order of its own
    ...Object.values(notes ?? {}),
  ];
};
