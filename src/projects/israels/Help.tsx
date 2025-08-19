import { useProjectStore } from "../../stores/project";

export const Help = () => {
  const interfaceLang = useProjectStore((s) => s.interfaceLanguage);
  return (
    <div className="ml-auto mr-auto mt-0 max-w-[640px]">
      {interfaceLang === "nl" ? <DutchHelp /> : <EnglishHelp />}
    </div>
  );
};

export const EnglishHelp = () => {
  return (
    <div>
      <h1>
        Welcome to the collection of Isaac Israëls’s letters to Jo van
        Gogh-Bonger
      </h1>
      <p className="text-justify">
        This edition lets you explore 103 letters and introductory texts
        providing background to the letters and the edition. Each letter
        includes transcriptions, an English translation, facsimiles, editorial
        annotation, and contextual metadata. You can search, browse, and filter
        the materials to suit your research questions or curiosity.
      </p>
      <h2>Edition Content</h2>
      <p className="text-justify">
        The edition contains 103 letters and one “About this edition”-document,
        which includes an Introduction, Credits, Notes for the Reader, and
        Acknowledgements.
      </p>
      <h2>Navigating the Edition</h2>
      <p className="mb-4 text-justify">
        The edition&#39;s opening page contains a menu bar, a title page panel,
        a side panel with search and filtering options and an overview of the
        letters. Clicking a letter brings you to the Detailed Page view.
      </p>
      <p className="text-justify">
        In the interface, ⓘ icons provide short explanations about how to use
        the various elements.
      </p>
      <h2>Using Free Search and Facets</h2>
      <p className="mb-4 text-justify">
        You can explore the edition in two main ways: by a free text search and
        by facets that select documents based on metadata.
      </p>
      <p className="mb-4 text-justify">
        The search interface has the following properties:
      </p>
      <ul className="list-disc text-justify">
        <li className="ml-8">
          You can filter your search to target only the original text, the
          translation, or the notes, of both the letters and the introduction.
        </li>
        <li className="ml-8">
          You can choose to display a smaller or larger snippet of text
          surrounding the search hit. This helps determine the relevance of a
          result before opening the full page.
        </li>
        <li className="ml-8">
          You can browse your search history to revisit earlier queries.
        </li>
      </ul>
      <h3>Free Search</h3>
      <p className="mb-4 text-justify">
        Type one or more keywords into the search bar to find matching content.
        This returns results from:
      </p>
      <ul className="list-disc text-justify">
        <li className="ml-8">the main text</li>
        <li className="ml-8">the English translation</li>
        <li className="ml-8">the editorial notes</li>
      </ul>
      <h3>Filter with Facets</h3>
      <p className="mb-4 text-justify">
        Use the facets to narrow results by category. You can combine multiple
        facets at once. The ⓘ info buttons next to each facet provide extra
        guidance.
      </p>
      <p className="mb-4 text-justify">Available facets:</p>
      <ul className="mb-4 list-disc text-justify">
        <li className="ml-8">Document Type</li>
        <li className="ml-8">Period</li>
        <li className="ml-8">Persons</li>
        <li className="ml-8">Location</li>
        <li className="ml-8">Artworks</li>
        <li className="ml-8">Document</li>
      </ul>
      <p className="text-justify">
        You can toggle facet values on and off by clicking the checkbox next to
        each value. Selecting multiple values selects all documents where one or
        both of the selected values occur. You can choose to sort facet values
        alphabetically (A–Z or Z–A), or by frequency (the number of documents
        that results from a query for that value).
      </p>
      <h3>Advanced Search Help: Keywords, Operators, and Wildcards</h3>
      <p className="mb-4 text-justify">
        The edition supports both simple and complex searches using keywords,
        Boolean operators, and wildcards.
      </p>
      <h4 className="mb-4">Basic Keyword Search</h4>
      <p className="mb-4 text-justify">
        Type any word to find its matches. Search queries are not
        case-sensitive, meaning it does not matter whether you type uppercase or
        lowercase letters. Hyphens are treated like spaces by the search engine.
      </p>
      <p className="text-justify">
        For example: <i>Vincent</i> finds all references to Vincent
      </p>
      <h4 className="mb-4 mt-4">Multiple Keywords</h4>
      <p className="text-justify">
        Entering multiple words (e.g.: exhibition sketches) will return results
        containing either or both terms.
      </p>
      <h4 className="mb-4 mt-4">Boolean Operators</h4>
      <p className="mb-4 text-justify">
        Use AND, OR, and NOT (in uppercase) to refine results:
      </p>
      <ul className="mb-4 list-disc text-justify">
        <li className="ml-8">
          <i>art AND gallery</i>: returns letters that mention both terms
        </li>
        <li className="ml-8">
          <i>painting OR drawing</i>: returns letters with either word
        </li>
        <li className="ml-8">
          <i>Hague NOT Amsterdam</i>: references to The Hague that exclude
          Amsterdam
        </li>
      </ul>
      <h4 className="mb-4 mt-4">Wildcards</h4>
      <p className="mb-4 text-justify">Use:</p>
      <ul className="mb-4 list-disc text-justify">
        <li className="ml-8">
          * to substitute multiple characters: <i>paint*</i> matches paint,
          painter, paintings
        </li>
        <li className="ml-8">
          ? for a single character: <i>?atch</i> matches catch, watch
        </li>
      </ul>
      <h4 className="mb-4 mt-4">Exact Phrases</h4>
      <p className="text-justify">
        Use double quotes to search for exact expressions:{" "}
        <i>&quot;dear Jo&quot;</i>, <i>&quot;Van Gogh Museum&quot;</i>
      </p>
      <h4 className="mb-4 mt-4">Fuzzy Matching</h4>
      <p className="text-justify">
        Add a tilde ~ and a number to allow spelling variations:{" "}
        <i>Israëls~1</i> will match Israels
      </p>
      <h4 className="mb-4 mt-4">Combining Searches</h4>
      <p className="mb-4 text-justify">
        You can group queries using parentheses:
      </p>
      <ul className="mb-4 list-disc text-justify">
        <li className="ml-8">(art OR artist) AND Paris</li>
        <li className="ml-8">(paint* OR draw*) NOT oil</li>
      </ul>
      <h2>Sorting the document list</h2>
      <p className="mb-4 text-justify">
        You can sort the document list in the following ways:
      </p>
      <ol className="mb-4 list-decimal text-justify">
        <li className="ml-8">
          By letter number (ascending or descending): Each letter is numbered,
          and this option allows you to browse them in numerical order.
        </li>
        <li className="ml-8">By date (ascending or descending)</li>
        <li className="ml-8">
          By relevance: Based on how closely a document matches your search
          query. Relevance is calculated by factors like keyword frequency and
          match location.
        </li>
      </ol>
      <h2>Viewing Documents</h2>
      <p className="mb-4 text-justify">The detailed page view shows:</p>
      <ul className="mb-4 list-disc text-justify">
        <li className="ml-8">The document title</li>
        <li className="ml-8">A zoomable facsimile</li>
        <li className="ml-8">The original text</li>
        <li className="ml-8">An English translation</li>
        <li className="ml-8">
          Metadata, such as a letter ID, shelfmark, and contextual information
        </li>
        <li className="ml-8">Notes</li>
        <li className="ml-8">
          A panel displaying the artworks referenced in the text
        </li>
      </ul>
      <p className="mb-4 text-justify">
        You can control which elements are visible (text, translation,
        facsimile, metadata) using the View Options menu in the bottom right.
        Toggled-off items turn reddish brown.
      </p>
      <p className="mb-4 text-justify">Facsimiles can be:</p>
      <ul className="mb-4 list-disc text-justify">
        <li className="ml-8">Zoomed in or out (+, –)</li>
        <li className="ml-8">Reset with the reset zoom icon</li>
        <li className="ml-8">
          Browsed using the left/right arrows (if multiple facsimile pages are
          available for a letter)
        </li>
      </ul>
      <p className="text-justify">
        You can activate a facsimile by clicking the corresponding “Show
        facsimile” button in the transcription.
      </p>
      <h3>Persons and Artworks</h3>
      <p className="mb-4 text-justify">
        Names of persons and titles of artworks mentioned in the text are marked
        with yellow and purple icons, respectively. Click the icon to:
      </p>
      <ul className="mb-4 list-disc text-justify">
        <li className="ml-8">
          View detailed information about the person or artwork
        </li>
        <li className="ml-8">
          Search for other references to them across the collection
        </li>
      </ul>
      <h2>Interface Language and Menus</h2>
      <ul className="list-disc text-justify">
        <li className="ml-8">
          Use the language toggle in the top-right corner to switch between
          Dutch and English. This switch applies to both the user interface
          (menus, buttons, labels) and the content of the edition.
        </li>
        <li className="ml-8">The top-right menu provides access to:</li>
      </ul>
      <ol className="mb-4 list-decimal text-justify">
        <li className="ml-16">
          The introductory texts of the edition (“About this edition”)
        </li>
        <li className="ml-16">
          Lists of all Persons, Artworks, and the Bibliography
        </li>
      </ol>
      <h2>Navigating Between Documents</h2>
      <p className="mb-4 text-justify">
        Use the Next and Previous buttons at the left bottom of the page to move
        between documents in the current set of search results, according to
        your selected sort order.
      </p>
      <p className="text-justify">
        For example, if your search returns specific letters, e.g., letters 11,
        34 and 37, you will navigate directly from letter 11 to 34, and then to
        37, skipping letters that don’t match your query.
      </p>
      <h2>Accessibility and Limitations</h2>
      <p className="text-justify">
        The current version of the site is not optimized for mobile devices. On
        tablets, the layout may appear correctly, but some functions do not work
        as intended.
      </p>
      <h2>Contact</h2>
      <p className="text-justify">
        For comments about the content of this site, or if there are problems
        consulting it, please email{" "}
        <a href="mailto:research@vangoghmuseum.nl">research@vangoghmuseum.nl</a>
        .
      </p>
    </div>
  );
};

export const DutchHelp = () => {
  return (
    <div>
      <h2>Welkom bij de brieven van Isaac Israëls aan Jo van Gogh-Bonger</h2>
    </div>
  );
};
