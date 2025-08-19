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
        Entering multiple words (e.g.: <i>exhibition sketches</i>) will return
        results containing either or both terms.
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
      <h1>Welkom bij de brieven van Isaac Israëls aan Jo van Gogh-Bonger</h1>
      <p className="text-justify">
        In deze uitgave kunt u 103 brieven bekijken, en daarnaast inleidende
        teksten met achtergrondinformatie over de brieven en de uitgave. Elke
        brief bevat een transcriptie, een Engelse vertaling, facsimile&#39;s,
        redactionele aantekeningen en contextuele metadata. U kunt de materialen
        doorzoeken, bladeren en filteren op basis van uw onderzoeksvragen of
        nieuwsgierigheid.
      </p>
      <h2>Inhoud van de uitgave</h2>
      <p className="text-justify">
        De editie bevat 103 brieven en een document ‘Over deze editie’, met een
        inleiding, colofon, verantwoording en dankbetuigingen.
      </p>
      <h2>Navigeren door de editie</h2>
      <p className="mb-4 text-justify">
        De openingspagina van de editie bevat een menubalk, een titelpagina, een
        zijpaneel met zoek- en filteropties en een overzicht van de brieven. Als
        u op een brief klikt, gaat u naar de detailpagina.
      </p>
      <p className="text-justify">
        In de interface geven ⓘ-pictogrammen korte uitleg over het gebruik van
        de verschillende onderdelen.
      </p>
      <h2>Vrij zoeken en facetten gebruiken</h2>
      <p className="mb-4 text-justify">
        U kunt de editie op twee manieren verkennen: door middel van zoeken op
        vrije tekst en door middel van facets die documenten selecteren op basis
        van metagegevens.
      </p>
      <p className="mb-4 text-justify">
        De zoekinterface heeft de volgende eigenschappen:
      </p>
      <ul className="list-disc text-justify">
        <li className="ml-8">
          U kunt uw zoekopdracht filteren om alleen de originele tekst, de
          vertaling of de opmerkingen van zowel de brieven als de inleiding te
          selecteren.
        </li>
        <li className="ml-8">
          U kunt ervoor kiezen om een kleiner of groter fragment van de tekst
          rondom de zoekresultaten weer te geven. Zo kunt u de relevantie van
          een resultaat bepalen voordat u de volledige pagina opent.
        </li>
        <li className="ml-8">
          U kunt uw zoekgeschiedenis bekijken om eerdere zoekopdrachten opnieuw
          te bekijken.
        </li>
      </ul>
      <h3>Vrije zoekopdracht</h3>
      <p className="mb-4 text-justify">
        Typ een of meer trefwoorden in de zoekbalk om de bijbehorende inhoud te
        vinden. Dit levert resultaten op uit:
      </p>
      <ul className="list-disc text-justify">
        <li className="ml-8">de hoofdtekst</li>
        <li className="ml-8">de Engelse vertaling</li>
        <li className="ml-8">de redactionele opmerkingen</li>
      </ul>
      <h3>Filteren met facetten</h3>
      <p className="mb-4 text-justify">
        Gebruik de facetten om de resultaten op categorie te verfijnen. U kunt
        meerdere facetten tegelijk gebruiken. De ⓘ-informatieknoppen naast elke
        facet bieden extra hulp.
      </p>
      <p className="mb-4 text-justify">Beschikbare facetten:</p>
      <ul className="mb-4 list-disc text-justify">
        <li className="ml-8">Documenttype</li>
        <li className="ml-8">Periode</li>
        <li className="ml-8">Personen</li>
        <li className="ml-8">Locatie</li>
        <li className="ml-8">Kunstwerken</li>
        <li className="ml-8">Document</li>
      </ul>
      <p className="text-justify">
        U kunt facetwaarden in- en uitschakelen door het selectievakje naast
        elke waarde aan te vinken. Als u meerdere waarden selecteert, worden
        alle documenten geselecteerd waarin een of beide geselecteerde waarden
        voorkomen. U kunt facetwaarden alfabetisch (A–Z of Z–A) of op frequentie
        (het aantal documenten dat uit een zoekopdracht voor die waarde
        resulteert) sorteren.
      </p>
      <h3>
        Hulp bij geavanceerd zoeken: trefwoorden, operatoren en jokertekens
      </h3>
      <p className="mb-4 text-justify">
        De editie ondersteunt zowel eenvoudige als complexe zoekopdrachten met
        behulp van trefwoorden, Booleaanse operatoren en jokertekens.
      </p>
      <h4 className="mb-4">Basiszoekopdracht op trefwoord</h4>
      <p className="mb-4 text-justify">
        Typ een woord om overeenkomsten te vinden. Zoekopdrachten zijn niet
        hoofdlettergevoelig. Koppeltekens worden door de zoekmachine als spaties
        behandeld.
      </p>
      <p className="text-justify">
        Bijvoorbeeld: <i>Vincent</i> vindt alle verwijzingen naar Vincent
      </p>
      <h4 className="mb-4 mt-4">Meerdere trefwoorden</h4>
      <p className="text-justify">
        Als u meerdere woorden invoert (bijvoorbeeld:{" "}
        <i>tentoonstelling schetsen</i>), worden resultaten weergegeven die een
        van beide of beide termen bevatten.
      </p>
      <h4 className="mb-4 mt-4">Booleaanse operatoren</h4>
      <p className="mb-4 text-justify">
        Gebruik AND, OR en NOT (in hoofdletters) om de resultaten te verfijnen:
      </p>
      <ul className="mb-4 list-disc text-justify">
        <li className="ml-8">
          <i>kunst AND galerie</i>: geeft brieven weer die beide termen bevatten
        </li>
        <li className="ml-8">
          <i>schilderij OR tekening</i>: geeft brieven weer die een van beide
          woorden bevatten
        </li>
        <li className="ml-8">
          <i>Den Haag NOT Amsterdam</i>: verwijzingen naar Den Haag, met
          uitsluiting van Amsterdam
        </li>
      </ul>
      <h4 className="mb-4 mt-4">Jokertekens</h4>
      <p className="mb-4 text-justify">Gebruik:</p>
      <ul className="mb-4 list-disc text-justify">
        <li className="ml-8">
          * om meerdere tekens te vervangen: <i>paint*</i> komt overeen met
          paint, painter, paintings
        </li>
        <li className="ml-8">
          ? voor een enkel teken: <i>?atch</i> komt overeen met catch, watch
        </li>
      </ul>
      <h4 className="mb-4 mt-4">Exacte zinnen</h4>
      <p className="text-justify">
        Gebruik dubbele aanhalingstekens om naar exacte uitdrukkingen te zoeken:
        <i>&quot;beste Jo&quot;</i>, <i>&quot;Van Gogh Museum&quot;</i>
      </p>
      <h4 className="mb-4 mt-4">Fuzzy matching</h4>
      <p className="text-justify">
        Voeg een tilde ~ en een getal toe om spellingsvariaties toe te staan:{" "}
        <i>Israëls~1</i> komt overeen met Israels
      </p>
      <h4 className="mb-4 mt-4">Zoekopdrachten combineren</h4>
      <p className="mb-4 text-justify">
        U kunt zoekopdrachten groeperen met behulp van haakjes:
      </p>
      <ul className="mb-4 list-disc text-justify">
        <li className="ml-8">(kunst OR kunstenaar) AND Parijs</li>
        <li className="ml-8">(paint* OR draw*) NOT oil</li>
      </ul>
      <h2>De documentenlijst sorteren</h2>
      <p className="mb-4 text-justify">
        U kunt de documentenlijst op de volgende manieren sorteren:
      </p>
      <ol className="mb-4 list-decimal text-justify">
        <li className="ml-8">
          Op briefnummer (oplopend of aflopend): de brieven zijn genummerd en
          met deze optie kunt u ze in numerieke volgorde bekijken.
        </li>
        <li className="ml-8">Op datum (oplopend of aflopend)</li>
        <li className="ml-8">
          Op relevantie: op basis van hoe goed een document overeenkomt met uw
          zoekopdracht. De relevantie wordt berekend aan de hand van factoren
          zoals de frequentie van trefwoorden en de locatie van overeenkomsten.
        </li>
      </ol>
      <h2>Documenten bekijken</h2>
      <p className="mb-4 text-justify">
        De gedetailleerde paginaweergave toont:
      </p>
      <ul className="mb-4 list-disc text-justify">
        <li className="ml-8">De titel van het document</li>
        <li className="ml-8">Een zoombaar facsimile</li>
        <li className="ml-8">De originele tekst</li>
        <li className="ml-8">Een Engelse vertaling</li>
        <li className="ml-8">
          Metadata, zoals een brief-ID, signatuur en contextuele informatie
        </li>
        <li className="ml-8">Notities</li>
        <li className="ml-8">
          Een paneel met de kunstwerken waarnaar in de tekst wordt verwezen
        </li>
      </ul>
      <p className="mb-4 text-justify">
        U kunt met het menu View rechtsonder bepalen welke elementen zichtbaar
        zijn (tekst, vertaling, facsimile, metagegevens). Uitgeschakelde items
        worden roodbruin.
      </p>
      <p className="mb-4 text-justify">U kunt facsimile&#39;s:</p>
      <ul className="mb-4 list-disc text-justify">
        <li className="ml-8">in- of uitzomen (+, –)</li>
        <li className="ml-8">
          resetten met het pictogram voor het resetten van de zoom
        </li>
        <li className="ml-8">
          doorbladeren met de pijltjes links/rechts (als er meerdere
          facsimilepagina&#39;s beschikbaar zijn voor een brief)
        </li>
      </ul>
      <p className="text-justify">
        U kunt een facsimile activeren door op de knop ‘Show facsimile’ in de
        transcriptie te klikken.
      </p>
      <h3>Personen en kunstwerken</h3>
      <p className="mb-4 text-justify">
        Namen van personen en titels van kunstwerken die in de tekst worden
        genoemd, zijn gemarkeerd met respectievelijk gele en paarse
        pictogrammen. Klik op het pictogram om:
      </p>
      <ul className="mb-4 list-disc text-justify">
        <li className="ml-8">
          Gedetailleerde informatie over de persoon of het kunstwerk te bekijken
        </li>
        <li className="ml-8">
          Te zoeken naar andere verwijzingen naar deze persoon of kunstwerk in
          de collectie
        </li>
      </ul>
      <h2>Taal van de interface en menu&#39;s</h2>
      <ul className="list-disc text-justify">
        <li className="ml-8">
          Gebruik de taalschakelaar in de rechterbovenhoek om te schakelen
          tussen Nederlands en Engels. Deze schakelaar is van toepassing op
          zowel de gebruikersinterface (menu&#39;s, knoppen, labels) als de
          inhoud van de editie.
        </li>
        <li className="ml-8">Het menu rechtsboven biedt toegang tot:</li>
      </ul>
      <ol className="mb-4 list-decimal text-justify">
        <li className="ml-16">
          De inleidende teksten van de editie (‘Over deze editie’)
        </li>
        <li className="ml-16">
          Lijsten van alle personen, kunstwerken en de bibliografie
        </li>
      </ol>
      <h2>Navigeren tussen documenten</h2>
      <p className="mb-4 text-justify">
        Gebruik de knoppen Volgende en Vorige linksonder op de pagina om tussen
        documenten in de huidige set zoekresultaten te navigeren, volgens de
        door u geselecteerde sorteervolgorde.
      </p>
      <p className="text-justify">
        Als uw zoekopdracht bijvoorbeeld specifieke brieven oplevert,
        bijvoorbeeld brieven 11, 34 en 37, navigeert u rechtstreeks van brief 11
        naar 34 en vervolgens naar 37, waarbij u brieven die niet aan uw
        zoekopdracht voldoen overslaat.
      </p>
      <h2>Toegankelijkheid en beperkingen</h2>
      <p className="text-justify">
        De huidige versie van de site is niet geoptimaliseerd voor mobiele
        apparaten. Op tablets wordt de lay-out grotendeels correct weergegeven,
        maar sommige functies werken niet zoals bedoeld.
      </p>
      <h2>Contact</h2>
      <p className="text-justify">
        Voor opmerkingen over de inhoud van deze site of als u problemen
        ondervindt bij het raadplegen ervan, kunt u een e-mail sturen naar{" "}
        <a href="mailto:research@vangoghmuseum.nl">research@vangoghmuseum.nl</a>
        .
      </p>
    </div>
  );
};
