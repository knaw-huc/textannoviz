import { AnnoRepoAnnotation, TeiRsBody } from "../../model/AnnoRepoAnnotation";

type VanGoghArtworksTabProps = {
  annotations: AnnoRepoAnnotation[];
};

export const ArtworksTab = (props: VanGoghArtworksTabProps) => {
  const personAnnos = props.annotations.filter((anno) => {
    return (
      anno.body.type === "tei:Rs" &&
      (anno.body as TeiRsBody).metadata.type === "person"
    );
  });
  console.log(personAnnos);

  return <div>Persons</div>;
};
