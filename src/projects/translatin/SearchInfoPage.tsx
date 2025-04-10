export const SearchInfoPage = () => {
  return (
    <div className="border-brand1Grey-100 -mx-10 mb-20 border-b px-10 pb-8">
      <p className="mb-4 mt-4 block font-bold" style={{ maxWidth: "50em" }}>
        Welcome to the TransLatin Neo-Latin Drama Database
      </p>
      <p className="mb-4 mt-4 block" style={{ maxWidth: "50em" }}>
        In this application, you will find metadata and transcriptions of
        approximately 90 Neo-Latin plays from the Netherlands and other European
        countries, dating from the 16th and 17th centuries.
      </p>
      <p className="mb-4 mt-4 block" style={{ maxWidth: "50em" }}>
        Most of the transcriptions were created with the help of Transkribus and
        subsequently checked. These machine-readable texts are not intended to
        replace the original editions, which are readily available via the cited
        URLs. Instead, they aim to make the plays more accessible in detail and
        to provide access to the material they contain.
      </p>
      <p className="mb-4 mt-4 block" style={{ maxWidth: "50em" }}>
        Additionally, the texts serve as raw material that can be corrected and
        further processed for teaching and research purposes as needed.
        Producing high-quality, fully edited texts would exceed the financial
        scope of our project.
      </p>
      <p className="mb-4 mt-4 block" style={{ maxWidth: "50em" }}>
        In the database, you can browse by author, play title, genre, year of
        first publication, year of publication, place of publication, and
        printer/publisher. You can also search for individual words or word
        combinations or names.
      </p>
      <p className="mb-4 mt-4 block" style={{ maxWidth: "50em" }}>
        For more information about the TransLatin project, please visit:{" "}
        <a href="https://translatin.nl" target="_blank" rel="noreferrer">
          https://translatin.nl
        </a>
      </p>
      <p className="mb-4 mt-4 block" style={{ maxWidth: "50em" }}>
        The machine-readable texts in TransLatin are available under the
        Creative Commons Attribution / Share Alike license.
      </p>
      <p className="mb-4 mt-4 block" style={{ maxWidth: "50em" }}>
        Please cite this resource using the full reference, including the URL.
        For example: Gnapheus, Acolastus (1529),
        https://edition.translatin.huygens.knaw.nl
      </p>
    </div>
  );
};
