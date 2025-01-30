export const SearchInfoPage = () => {
  return (
    <div className="border-brand1Grey-100 -mx-10 mb-20 border-b px-10 pb-8">
      <p className="mb-4 mt-4 block font-bold" style={{ maxWidth: "50em" }}>
        Welcome to the{" "}
        <span className="italic">
          Correspondence of Christofforo Suriano (1616–1623)
        </span>{" "}
        project, based at the Huygens Institute, edited by Dr Nina Lamal.
      </p>
      <p className="mb-4 mt-4 block" style={{ maxWidth: "50em" }}>
        In this application, you can find the digital facsimiles alongside the
        transcriptions of the 725 letters written by the Venetian diplomat
        Christofforo Suriano from The Hague to the Venetian Doge and Senate
        between 1616 and 1623.
      </p>
      <p className="mb-4 mt-4 block" style={{ maxWidth: "50em" }}>
        For an overview of all the letters, with the English summaries, just
        scroll towards the end of this short introduction on how to use this
        application.
      </p>
      <p className="mb-4 mt-4 block" style={{ maxWidth: "50em" }}>
        The letters are written in Italian. For a full text search, you will get
        the most complete results using Italian words and terms. You are also
        able to use English words or terms in the full text search, but then you
        will only search in the English summaries accompanying each letter.
      </p>
      <p className="mb-4 mt-4 block" style={{ maxWidth: "50em" }}>
        The aim of summaries is to provide an overview of the most important
        topics and themes covered by Suriano. In these summaries, you also get
        information about the various enclosed documents sent with the letters.
      </p>
      <p className="mb-4 mt-4 block" style={{ maxWidth: "50em" }}>
        The individuals mentioned in his letters have been identified as much as
        possible, and for each person we have been able to identify, a brief
        biography is provided. We are improving the search function for names of
        individuals. This is an ongoing and collaborative endeavour:
        improvements will be added in increments.
      </p>
      <p className="mb-4 mt-4 block" style={{ maxWidth: "50em" }}>
        For more information please consult:{" "}
        <a
          href="https://suriano.huygens.knaw.nl/about/"
          target="_blank"
          rel="noreferrer"
        >
          https://suriano.huygens.knaw.nl/about/
        </a>
      </p>
      <p className="mb-4 mt-4 block" style={{ maxWidth: "50em" }}>
        Please cite this resource using the full archival reference and the
        edition. The full archival reference can be found in the metadata field
        under shelfmark.
      </p>
      <p className="mb-4 mt-4 block" style={{ maxWidth: "50em" }}>
        For example: Archivio di Stato di Venezia (ASVe), Senato, Dispacci,
        Signori Stati, Filza 2, fol 133r-136v, 139r-v; Nina Lamal (ed.),
        Correspondence of Christofforo Suriano (1616-1623),
        https://edition.suriano.huygens.knaw.nl. Last accessed [Date].
      </p>
    </div>
  );
};
