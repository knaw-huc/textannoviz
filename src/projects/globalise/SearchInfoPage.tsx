export const SearchInfoPage = () => {
  return (
    <>
      <h4>Introduction</h4>

      <p className="mb-4 mt-4 block">
        Welcome to the beta <i>GLOBALISE Transcriptions Viewer</i>. This tool
        allows you to easily search and view the machine-generated
        transcriptions and page images of the{" "}
        <a href="https://globalise.huygens.knaw.nl">GLOBALISE project&apos;s</a>{" "}
        Dutch East India Company (VOC) source corpus in a web browser. A
        detailed explanation of how to use this viewer, with search tips, is
        available via the{" "}
        <a href="https://transcriptions.globalise.huygens.knaw.nl/help">Help</a>{" "}
        link at the top of the screen.
      </p>

      <p className="mb-4 mt-4 block">
        Please note: the Transcriptions Viewer is <u>not</u> an early version of
        the GLOBALISE research portal. It was designed as an interim solution
        for searching and exploring the GLOBALISE corpus until the research
        infrastructure is released to the public in mid-2026.
      </p>

      <p className="mb-4 mt-4 block">
        We will continue to make small improvements to the Transcriptions Viewer
        on an ongoing basis but we currently have no plans to substantially
        expand its functionality in the future. In the period leading up to the
        release of the research infrastructure we will, continue to publish data
        on the{" "}
        <a href="https://datasets.iisg.amsterdam/dataverse/globalise">
          GLOBALISE Dataverse
        </a>{" "}
        repository and experiment with ways to make our data and transcriptions
        more accessible. These experiments are shared on the{" "}
        <a href="http://lab.globalise.huygens.knaw.nl/">GLOBALISE Lab</a> page.
      </p>

      <h4>Data and License</h4>

      <p className="mb-4 mt-4 block">
        The c. 4.8M transcriptions accessible from the GLOBALISE Transcriptions
        Viewer are drawn from the
        <i>
          {" "}
          <a href="https://www.nationaalarchief.nl/onderzoeken/archief/1.04.02/">
            Overgekomen brieven en papieren
          </a>
        </i>{" "}
        (1610-1796) collection of the Dutch East India Company (VOC) preserved
        at the Netherlands National Archives, The Hague, under VOC inventory
        numbers 1053-4454 and 7527-11024. These transcriptions represent the
        second version (v2.0) of the machine-generated HTR created in March
        2024.
      </p>

      <p className="mb-4 mt-4 block">
        All versions of the transcriptions are available under a{" "}
        <a href="http://creativecommons.org/publicdomain/zero/1.0">
          Creative Commons CC0
        </a>{" "}
        license. You are free to build upon, enhance, and reuse the
        transcriptions for any purposes without restriction. A full copy of the
        GLOBALISE transcriptions is{" "}
        <a href="https://hdl.handle.net/10622/LVXSBW">
          freely available for download
        </a>
        . The scans of the original documents are available on the{" "}
        <a href="https://www.nationaalarchief.nl/onderzoeken/archief/1.04.02/">
          website of the National Archives
        </a>
        , also under a CC0 license. Please reference the GLOBALISE project and
        the National Archives when using the v2.0 transcriptions using this
        format:{" "}
        <code className="bg-gray-300 text-[95%]">
          NL-HaNA, VOC, [inv.nr.], [scan nr.], transcription GLOBALISE project
          (https://globalise.huygens.knaw.nl/), March 2024.
        </code>
      </p>

      <p className="mb-4 mt-4 block">
        Please note that these machine-generated transcriptions will contain
        errors. They have not been manually checked for accuracy or
        completeness. Be careful when relying on the transcriptions and be aware
        of their limitations.
      </p>

      <p className="mb-4 mt-4 block">
        In order to diagnose errors, and to improve the quality and stability of
        the Transcriptions Viewer, we may temporarily log search queries in
        compliance with the relevant Dutch privacy regulations.
      </p>

      <h4>Discriminatory Content Advisory</h4>

      <p className="mb-4 mt-4 block">
        The records and metadata within this collection contain language or
        descriptions that are offensive, biased, or distorted. The language of
        the archive reflects the period in which the records were created and
        the prevailing societal attitudes of the time. While we are working to
        address and contextualize these issues, please approach these materials
        with care and consideration.
      </p>

      <h4>Feedback</h4>

      <p className="mb-4 mt-4 block">
        We greatly value your feedback. Please share general comments and
        questions about the Globalise project via our{" "}
        <a href="https://globalise.huygens.knaw.nl/contact-us/">contact page</a>
        . Questions about the Transcriptions Viewer, ideas for improvement, and
        bug reports can be shared with us via our{" "}
        <a href="https://globalise.canny.io/transcriptions-viewer/">
          feedback page
        </a>
        . Here you&apos;ll also have an opportunity to vote on features
        suggested by others, and to suggest new features of your own.
      </p>

      <h4>Credits</h4>

      <p className="mb-4 mt-4 block">
        <a href="https://globalise.huygens.knaw.nl">GLOBALISE</a> is a project
        based at the <a href="https://huygens.knaw.nl">Huygens Institute</a>{" "}
        (KNAW Humanities Cluster) in the Netherlands funded by the Dutch
        Research Council (NWO) under grant no. 175.2019.003.
      </p>

      <p className="mb-4 mt-4 block">
        Page Layout and Handwritten Text Recognition:{" "}
        <a href="https://di.huc.knaw.nl/computer-vision-en.html">
          Computer Vision
        </a>{" "}
        group (Rutger van Koert, Stefan Klut, Martijn Maas), Digital
        Infrastructure Department, KNAW Humanities Cluster using the{" "}
        <a href="https://github.com/knaw-huc/loghi">
          Loghi open-source HTR platform
        </a>
        .
      </p>

      <p className="mb-4 mt-4 block">
        Transcriptions Viewer:{" "}
        <a href="https://di.huc.knaw.nl/text-analysis-en.html">Text Analysis</a>{" "}
        group (Hennie Brugman, Sebastiaan van Daalen, Hayco de Jong, Bram
        Buitendijk), Digital Infrastructure Department, KNAW Humanities Cluster
        using the open-source{" "}
        <a href="https://github.com/knaw-huc/textannoviz">TextAnnoViz</a>,{" "}
        <a href="https://github.com/knaw-huc/textrepo">TextRepo</a>,{" "}
        <a href="https://github.com/knaw-huc/annorepo">AnnoRepo</a>, and{" "}
        <a href="https://github.com/knaw-huc/broccoli">Broccoli</a>{" "}
        infrastructure.
      </p>

      <p className="mb-4 mt-4 block">
        Ground truth: The page layout and handwritten text recognition models
        used to generate the transcriptions build on a large collection of
        ground truth. We especially wish to thank the Netherlands National
        Archives, the Amsterdam City Archives, and the Huygens Institute for
        their prior work in this area. Reference transcriptions and region
        layout data to finetune the HTR models for the GLOBALISE corpus were
        created by GLOBALISE team members Kay Pepping, Maartje Hids, Merve
        Tosun, and Femke Brink.
      </p>

      <h4>Release Notes</h4>

      <p className="mb-4 mt-4 block">v0.3 (June 2024)</p>

      <ul className="mb-4 mt-4 block list-disc pl-10">
        <li className="list-item">
          New (v2.0) HTR with more accurate transcriptions and improved
          (PageXML) layout elements.
        </li>
        <li className="list-item">
          {" "}
          <a href="https://transcriptions.globalise.huygens.knaw.nl/help">
            Filter search results
          </a>{" "}
          by VOC archive{" "}
          <a href="https://www.nationaalarchief.nl/onderzoeken/archief/1.04.02">
            inventory numbers
          </a>
          .
        </li>
        <li className="list-item">
          Ability to goto a specific page in the search results.
        </li>
        <li className="list-item">
          Searching without a search term now displays an alert message.
        </li>
        <li className="list-item">
          Icons in the Mirador image view now always appear in the correct
          position.
        </li>
        <li className="list-item">
          Search results with more than 10,000 items now show the correct
          totals.
        </li>
        <li className="list-item">
          Added inventory no. to page titles in search results.
        </li>
      </ul>

      <p className="mb-4 mt-4 block">v0.2 (Oct 2023)</p>

      <ul className="mb-4 mt-4 block list-disc pl-10">
        <li className="list-item">
          The zoom and navigation icons for the image viewer sometimes appear in
          the wrong place. You can fix this by reloading the page in your
          browser.
        </li>
        <li className="list-item">
          The navigation icons in the image viewer are not linked to the
          transcripts (i.e. they can only be used to browse the page images). To
          browse the transcripts and page images, please use the
          &apos;Previous&apos; and &apos;Next&apos; page controls beneath the
          transcription.
        </li>
        <li className="list-item">
          You may not be able to see the image viewer on a mobile device.
        </li>
        <li className="list-item">
          The accessibility of the Viewer is currently insufficient for people
          with, for example, sight impairment.
        </li>
      </ul>
    </>
  );
};
