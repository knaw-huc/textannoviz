import { ArtworksTab } from "./ArtworksTab";
import { MetadataTab } from "./MetadataTab";
import { MiradorTab } from "./MiradorTab";
import { NotesTab } from "./NotesTab";
import { TextComponentTab } from "./TextComponentTab";
import { WebAnnoTab } from "./WebAnnoTab";

export const TabRecipes = {
  facsTab: {
    title: "Facsimile",
    content: <MiradorTab />,
  },
  textTab: {
    title: "Text",
    content: <TextComponentTab viewToRender="self" />,
  },
  metadataTab: {
    title: "Metadata",
    content: <MetadataTab />,
  },
  webAnnoTab: {
    title: "Web annotations",
    content: <WebAnnoTab />,
  },
  notesTab: {
    title: "Notes",
    content: <NotesTab />,
  },
  artworksTab: {
    title: "Artworks",
    content: <ArtworksTab />,
  },
};
