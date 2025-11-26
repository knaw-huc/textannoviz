export const SearchInfoPage = () => {
  return (
    <div className="border-brand1Grey-100 -mx-10 -mb-10 flex -translate-y-16 border-b px-10 py-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex max-w-3xl flex-col gap-4 text-justify">
          <h1 className="mb-1 text-left">
            The Correspondence of Pieter Cornelisz Brederode (1602–1637)
          </h1>
          <p>
            Between 1602 and 1625, Pieter Cornelisz Brederode served the States
            General of the Dutch Republic as agent to the Protestant Princes,
            Estates and Cities of the Holy Roman Empire. The pressures of the
            Thirty Years’ War (1618–1648) forced Brederode’s relocation to
            Strassburg and later to Basel, from where he continued to serve the
            States General as envoy to the Swiss evangelical cantons until his
            death in 1637. His correspondence therefore contains valuable
            information on the Dutch Republic’s German and Swiss relations in
            decades of mounting international tensions and war (for fuller
            accounts of Brederode’s life and mission see{" "}
            <a
              href="https://emlo-portal.bodleian.ox.ac.uk/collections/?catalogue=pieter-cornelisz-brederode"
              rel="noreferrer"
              target="_blank"
            >
              here
            </a>{" "}
            or{" "}
            <a
              href="https://resources.huygens.knaw.nl/retroboeken/schutte/#page=204&accessor=toc&source=2&view=imagePane&size=833"
              rel="noreferrer"
              target="_blank"
            >
              here
            </a>
            ).
          </p>
          <p>
            This database provides access to the full correspondence between
            Brederode and the States General as it is preserved in the National
            Archive in The Hague. It contains images and transcriptions of
            letters by Brederode (702), minutes of letters by the States General
            to Brederode (44) and two letters to the States General written by
            Brederode’s nephew Cornelis. All the original letters are in Dutch;
            appendices do contain documents in other languages, but these are
            not searchable. For Brederode’s correspondences with other persons
            (such as John of Oldenbarnevelt, John VI of Nassau, and Justus
            Lipsius) please consult our{" "}
            <a
              href="https://emlo-portal.bodleian.ox.ac.uk/collections/?catalogue=pieter-cornelisz-brederode"
              rel="noreferrer"
              target="_blank"
            >
              EMLO catalogue
            </a>
            .
          </p>
          <p>
            The dates and places of origin of the letters have been carefully
            curated. Dates are given in the New (Gregorian) Style as it was used
            in Holland in the seventeenth century. When searching for dates or
            date ranges please use the format mm/dd/yyyy. Text is given in the
            original (variable) spelling. Transcriptions have been generated
            automatically with Transkribus and may still contain errors. When
            performing a full-text search, it is therefore advisable to use
            wildcards (“?”) or allow for variation (“~1”, “~2”). For example, a
            search for “bo?ck” will provide the results “boeck”, “bouck”, etc.
            Searching for “Phalts ~1” yields results within one character of the
            given spelling (here for example “Phalts”, “Palts”, “Phals”, and
            “Phaltz”); searching for “Phalts ~2 allows for two-character
            deviation, etc.
          </p>
          <p>
            This database is the result of Dr Helmer Helmers’ research project
            “Inventing Public Diplomacy in Early Modern Europe” (2019–2025),
            which was funded with an NWO VIDI grant (
            <a
              href="https://www.nwo.nl/en/projects/vividi195081"
              rel="noreferrer"
              target="_blank"
            >
              VI.Vidi.195.081
            </a>
            ) and conducted at the Humanities Cluster of the Royal Netherlands
            Academy of Arts and Sciences. Data have been curated by Helmer
            Helmers and Romée van Dommelen. The database was built by Bram
            Buitendijk and Maarten van Gompel of the Huygens Institute. Miranda
            Lewis (Oxford) facilitated linking the database to EMLO.
          </p>
          <p>
            When citing the letters in this database, please use the following
            form (using the relevant metadata of the specific letter):<br/>

            Nationaal Archief, 1.01.02, inv. 6016. Brederode to States
            General, 18 November 1602. In: Helmer Helmers, Romée van Dommele,
            Bram Buitendijk, Maarten van Gompel, Hayco de Jong and Sebastiaan van Daalen: <i>The Correspondence of Pieter Cornelisz Brederode (1602–1637)</i> (Amsterdam: Huygens Institute, 2025).
            URL:{" "}
            <a
              href="https://brederode.huygens.knaw.nl/"
              target="_blank"
              rel="noreferrer"
            >
              https://brederode.huygens.knaw.nl/
            </a>
              .
          </p>
        </div>
      </div>
    </div>
  );
};
