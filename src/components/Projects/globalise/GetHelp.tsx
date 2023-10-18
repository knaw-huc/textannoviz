export const GetHelp = () => {
  return (
    <div className="m-4">
      <h3 className="">Help: Searching and Browsing</h3>

      <h4>Keywords</h4>

      <p className="mb-4 mt-4 block">
        The search engine searches through the entire text corpus for the exact
        term you entered. For example:{" "}
        <code className="bg-gray-300">schip</code> will show you all pages which
        include this exact search term only.
      </p>

      <p className="mb-4 mt-4 block">
        Note that keyword searches are not case sensitive. For example{" "}
        <code className="bg-gray-300">admiraal</code> and{" "}
        <code className="bg-gray-300">Admiraal</code> will produce the same
        results.
      </p>

      <h4>Multiple Keywords</h4>

      <p className="mb-4 mt-4 block">
        If you enter two or more search terms next to each other, the search
        engine finds the occurrence of either one or both terms. For example{" "}
        <code className="bg-gray-300">swarte peper</code> will show you all
        pages with <code className="bg-gray-300">swarte</code> and{" "}
        <code className="bg-gray-300">peper</code> as well as pages with{" "}
        <code className="bg-gray-300">swarte</code> or{" "}
        <code className="bg-gray-300">peper</code>.
      </p>

      <h4>Combining and Excluding Keywords</h4>

      <p className="mb-4 mt-4 block">
        If you add (in uppercase letters) the operators AND or OR between your
        keywords, the search engine will find all occurrences in the text corpus
        that contain all the keywords (AND) or else, any one of the keywords
        (OR).
      </p>

      <p className="mb-4 mt-4 block">
        For example: <code className="bg-gray-300">swarte AND peper</code> will
        only show pages that include both{" "}
        <code className="bg-gray-300">swarte</code> and{" "}
        <code className="bg-gray-300">peper</code>. Similarly,{" "}
        <code className="bg-gray-300">swarte OR peper</code> will show all pages
        that include one or the other. Note that this is different from just
        entering <code className="bg-gray-300">swarte peper</code> as we saw
        above, this will also list pages that included both search terms.
      </p>

      <p className="mb-4 mt-4 block">
        If you wish to search for a keyword but exclude another one, you can do
        this using NOT. For example,{" "}
        <code className="bg-gray-300">engelse NOT oorlog</code> will find all
        pages that include <code className="bg-gray-300">engelse</code> but only
        if these do not also include <code className="bg-gray-300">oorlog</code>
        .
      </p>

      <h4>Expanding your Keywords</h4>

      <p className="mb-4 mt-4 block">
        With the use of special wildcard characters (* and ?) you can expand
        your keyword search to include variants of your search term. This can be
        applied to single words or phrases.
      </p>

      <p className="mb-4 mt-4 block">
        For example, <code className="bg-gray-300">schip*</code> will not just
        find pages with the word <code className="bg-gray-300">schip</code> but
        also pages with the words <code className="bg-gray-300">schipper</code>{" "}
        and <code className="bg-gray-300">schippers</code>. More precisely, it
        will find any word that begins with the letters{" "}
        <code className="bg-gray-300">schip</code>.
      </p>

      <p className="mb-4 mt-4 block">
        You can also use this wildcard to search for a specific word preceded or
        followed by any other word. For example,{" "}
        <code className="bg-gray-300">* schip</code> would find pages with the
        words <code className="bg-gray-300">afgevaren schip</code>,{" "}
        <code className="bg-gray-300">geen schip</code> and{" "}
        <code className="bg-gray-300">oorlog schip</code>.
      </p>

      <p className="mb-4 mt-4 block">
        If you wish to expand your keyword by just a single character, you can
        use the ? wildcard. For example:{" "}
        <code className="bg-gray-300">cop?e</code> will show pages with{" "}
        <code className="bg-gray-300">copie</code>, but also with{" "}
        <code className="bg-gray-300">copye</code>. It will not, however, show
        results with <code className="bg-gray-300">coppere</code> since this
        requires more than one character to substitute for the ? wildcard.
      </p>

      <p className="mb-4 mt-4 block">
        You can also combine several wildcards, for example{" "}
        <code className="bg-gray-300">noodsa??kel??kheyt</code> to find{" "}
        <code className="bg-gray-300">noodsaackelyckheyt</code> and{" "}
        <code className="bg-gray-300">noodsaeckelyckheyt</code> and{" "}
        <code className="bg-gray-300">noodsaackelijkheyt</code> and{" "}
        <code className="bg-gray-300">noodsaeckelijkheyt</code>. These four
        words can also be found more simply with{" "}
        <code className="bg-gray-300">noodsa*</code> or, if the number of search
        results is too large, with{" "}
        <code className="bg-gray-300">noodsa*kel*</code>.
      </p>

      <h4>Exact Phrases</h4>

      <p className="mb-4 mt-4 block">
        Placing several search terms, such as a phrase, in double quotes will
        find the places in the text corpus where that exact phrase occurs. For
        example:{" "}
        <code className="bg-gray-300">
          &quot;copije met de bijlage geteekend&quot;
        </code>{" "}
        will find the phrase{" "}
        <code className="bg-gray-300">copije met de bijlage geteekend</code> in
        the text corpus, but not pages with{" "}
        <code className="bg-gray-300">copije geteekend</code>.
      </p>

      <h4>Keyword variants</h4>

      <p className="mb-4 mt-4 block">
        If you want to look for multiple variants of a keyword (for example,
        different spellings) but do not know where exactly these changes occur,
        you can use a wildcard (~) that determines how many changes (additions,
        deletions, or substitutions) can occur in the keyword. This wildcard,
        followed by a number, allows you to search for keywords that contain a
        certain number of character changes (&apos;edit distance&apos;).
      </p>

      <p className="mb-4 mt-4 block">
        For example: <code className="bg-gray-300">voorschreven~1</code> will
        find <code className="bg-gray-300">voorschreven</code>,{" "}
        <code className="bg-gray-300">voorschreve</code>,{" "}
        <code className="bg-gray-300">voorschteven</code>,{" "}
        <code className="bg-gray-300">veorschreven</code> but not{" "}
        <code className="bg-gray-300">veorschreve</code> because this differs
        from <code className="bg-gray-300">voorschreven</code> by two characters
        (the <code className="bg-gray-300">e</code> and the missing ending{" "}
        <code className="bg-gray-300">-n</code>).
      </p>

      <p className="mb-4 mt-4 block">
        Note that the changed characters can occur anywhere in the keyword. For
        example, <code className="bg-gray-300">suiker~1</code> will find{" "}
        <code className="bg-gray-300">sucker</code>,{" "}
        <code className="bg-gray-300">suider</code> and{" "}
        <code className="bg-gray-300">zuiker</code>.
      </p>

      <h4>Combining multiple search terms</h4>

      <p className="mb-4 mt-4 block">
        It is possible to combine several search queries with any combination of
        AND, OR and NOT operators. When doing so, you can use round brackets to
        separate search queries.
      </p>

      <p className="mb-4 mt-4 block">
        For example:{" "}
        <code className="bg-gray-300">
          trader OR merchant OR koopluyden OR schipper
        </code>{" "}
        will find results in which any one of these words occur at least once.
      </p>

      <p className="mb-4 mt-4 block">
        For example:{" "}
        <code className="bg-gray-300">
          (gecommitteerd OR gecommitteerdens) NOT gecommitteer
        </code>{" "}
        will find results which include the word{" "}
        <code className="bg-gray-300">gecommitteerd</code> or the word{" "}
        <code className="bg-gray-300">gecommitteerdens</code> at least once, but
        not <code className="bg-gray-300">gecommitteer</code>.
      </p>

      <p className="mb-4 mt-4 block">
        For example:{" "}
        <code className="bg-gray-300">
          commissie NOT &quot;seeckere commissie&quot;
        </code>{" "}
        will show results in which the word{" "}
        <code className="bg-gray-300">commissie</code> appears, but not if it is
        part of the phrase{" "}
        <code className="bg-gray-300">&quot;seeckere commissie&quot;</code>.
      </p>

      <p className="mb-4 mt-4 block">
        For example:{" "}
        <code className="bg-gray-300">
          (commis* OR gecommit*) NOT committeeren
        </code>{" "}
        will find results containing words starting with{" "}
        <code className="bg-gray-300">commis</code> or{" "}
        <code className="bg-gray-300">gecommit</code>, but not containing the
        word <code className="bg-gray-300">committeeren</code>. Note: this
        search can also be simplified to{" "}
        <code className="bg-gray-300">*commi* NOT gecommitteerden</code>.
      </p>

      <h4>Punctuation</h4>

      <p className="mb-4 mt-4 block">
        Note that when you expand a keyword search with a wildcard the search
        engine will treat all matching characters the same, including
        punctuation. For example,{" "}
        <code className="bg-gray-300">slaafbaarheijd?</code> will include pages
        with <code className="bg-gray-300">slaafbaarheijd,</code> since the
        comma at the end is being treated as part of the word. Without adding
        the ? or * wildcard at the end of the keyword,{" "}
        <code className="bg-gray-300">slaafbaarheijd</code> will not find
        instances of <code className="bg-gray-300">slaafbaarheijd,</code> with a
        comma at the end.
      </p>

      <p className="mb-4 mt-4 block">
        Since * and ? are normally used as wildcards, you need to take special
        measures to include these in your search term as regular characters.
        This is done by placing the character after a backslash (\). To search
        for all words ending in question marks, use, for example,{" "}
        <code className="bg-gray-300">??\\?</code> this will find all two letter
        words ending in a question mark, such as{" "}
        <code className="bg-gray-300">is?</code>.
      </p>

      <h3 className="">Help: Transcriptions and Page Images</h3>

      <h4>Transcriptions</h4>

      <p className="mb-4 mt-4 block">
        The keyword(s) matching your query in the search view will appear
        highlighted in the transcription next to the corresponding image of the
        original document. To move to the previous or next page, click on the
        navigation links beneath the transcription.
      </p>

      <h4>Page Images</h4>

      <p className="mb-4 mt-4 block">
        You can zoom in and out of the page image by using the + and - buttons.
        Reset the zoom view with the adjacent reset button. Please note that the
        previous and next buttons to the right of the zoom controls are not
        linked to the transcript. These only allow you to move between
        individual images. To view both the previous or next image and
        transcription simultaneously please use the navigation buttons
        underneath the transcription.
      </p>
      <p className="mb-4 mt-4 block">
        Toggling the sidebar to the top left of the page image reveals
        additional information (metadata) as well as further means to navigate
        between individual page images.
      </p>
    </div>
  );
};
