export const GetAbout = () => {
  return (
    <div className="m-4">
      <h4>Introduction</h4>

      <p className="mb-4 mt-4 block">
        Welcome to the beta <i>GLOBALISE Transcriptions Viewer</i> (v0.2). This
        tool allows you to easily search and view the page images and
        machine-generated transcriptions of the{" "}
        <a href="https://globalise.huygens.knaw.nl">GLOBALISE project</a> source
        corpus side-by-side in a web browser. Please note: The Transcriptions
        Viewer is <u>not</u> an early version of the GLOBALISE research portal.
        It was designed as an interim solution for searching and exploring the
        GLOBALISE corpus until all the elements of the project’s data and
        research infrastructure can be released to the public in 2026. We will
        continue to make periodic improvements to the Transcriptions Viewer on
        an ongoing basis but we currently have no plans to substantially expand
        its functionality in the future.
      </p>

      <h4>Data</h4>

      <p className="mb-4 mt-4 block">
        The c. 4.8M transcriptions accessible from the GLOBALISE Transcriptions
        Viewer are drawn from the ‘Overgekomen brieven en papieren’ (1610-1796)
        collection of the Dutch East India Company (VOC) preserved at the
        Netherlands National Archives, The Hague, under VOC inventory numbers
        1053-4454 and 7527-11024. These transcriptions represent the first
        (v1.0) version of the machine-generated HTR created in May, 2023. A full
        copy of the transcriptions is{" "}
        <a href="https://hdl.handle.net/10622/JCTCJ2">
          freely available for download and reuse
        </a>{" "}
        under a{" "}
        <a href="http://creativecommons.org/publicdomain/zero/1.0">
          Creative Commons CC0 v1
        </a>{" "}
        license. You are free to build upon, enhance, and reuse the
        transcriptions for any purposes without restriction. Please reference
        the GLOBALISE project when using these transcriptions. The scans of the
        original documents are available on the{" "}
        <a href="https://www.nationaalarchief.nl/onderzoeken/archief/1.04.02/">
          website of the National Archives
        </a>
        , also under a CC0 v1 license.
      </p>

      <p className="mb-4 mt-4 block">
        Please note that the transcriptions will contain errors. They have not
        been manually checked for accuracy or completeness. Some labels,
        characterizations and information about persons, actions and events may
        be offensive and troubling to individuals and communities. Be careful
        when relying on these transcriptions and be aware of their limitations.
      </p>

      <h4>Credits</h4>

      <p className="mb-4 mt-4 block">
        <a href="https://globalise.huygens.knaw.nl">GLOBALISE</a> is a project
        based at the <a href="https://huygens.knaw.nl">Huygens Institute</a>{" "}
        (KNAW Humanities Cluster) in the Netherlands funded by the Dutch
        Research Council (NWO) under grant no. 175.2019.003.
      </p>

      <p className="mb-4 mt-4 block">
        Handwriting Recognition:{" "}
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
        Ground truth: Reference transcriptions and region layout data for the
        HTR process were created by Globalise team members: Kay Pepping, Maartje
        Hids, and Femke Brink.
      </p>

      <h4>Known Issues</h4>

      <p className="mb-4 mt-4 block">v0.2 (3 Oct 2023)</p>

      <ul className="mb-4 mt-4 block list-disc pl-10">
        <li className="list-item">
          The zoom and navigation icons for the image viewer sometimes appear in
          the wrong place. You can fix this by reloading the page in your
          browser.
        </li>
        <li className="list-item">
          The navigation icons in the image viewer are not linked to the
          transcripts (i.e. they can only be used to browse the page images). To
          browse the transcripts and page images, please use the ‘Prev’ and
          ‘Next’ page controls next to the transcript.
        </li>
      </ul>
    </div>
  );
};
