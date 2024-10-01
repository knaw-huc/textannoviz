export const dummyAnno = {
  "@context": [
    "http://www.w3.org/ns/anno.jsonld",
    {
      nlp: "https://ns.tt.di.huc.knaw.nl/nlp",
      pagexml: "https://ns.tt.di.huc.knaw.nl/pagexml",
      tf: "https://ns.tt.di.huc.knaw.nl/tf",
      tt: "https://ns.tt.di.huc.knaw.nl/tt",
      tei: "https://ns.tt.di.huc.knaw.nl/tei",
    },
  ],
  type: "Annotation",
  id: "https://annorepo.suriano.huygens.knaw.nl/w3c/suriano-0.7.0e-026/ed775f09-c936-44a3-ad72-68e723ff8195",
  purpose: "tagging",
  generated: "2024-09-19T10:21:10.398712",
  body: {
    id: "urn:suriano:ent:2109407-dummy",
    type: "tf:Ent",
    "tf:textfabricNode": "2109407",
    metadata: {
      type: "tt:EntMetadata",
      eid: "pieter.jansz",
      kind: "PER",
      entityId: "urn:suriano:entity:pieter.jansz-PER",
      details: [
        {
          label: "PRIMARY NAME",
          value: "Pieter Jansz. Dummy",
        },
        {
          label: "OCCUPATIONS, ROLES, and/or TITLES",
          value:
            "Skipper on one of the ships that was part of the fleet hired by Venice",
        },
        {
          label: "Bibliography: secondary literature and websites",
          value:
            '<a href="https://resources.huygens.knaw.nl/retroboeken/statengeneraal/#page=648&accessor=searchText&source=3&view=pdfPane">resources.huygens.knaw.nl</a>',
        },
      ],
    },
  },
  target: [
    {
      source:
        "https://textrepo.suriano.huygens.knaw.nl/api/rest/versions/e7430269-a2aa-4555-8cbf-ec111cbf2447/contents",
      type: "Text",
      selector: {
        type: "tt:TextAnchorSelector",
        start: 88880,
        end: 88881,
      },
    },
    {
      source:
        "https://textrepo.suriano.huygens.knaw.nl/api/view/versions/e7430269-a2aa-4555-8cbf-ec111cbf2447/segments/index/88880/88881",
      type: "Text",
    },
    {
      source:
        "https://textrepo.suriano.huygens.knaw.nl/api/rest/versions/b0ecba9d-289b-4736-ba15-f0d5134388b9/contents",
      type: "LogicalText",
      selector: {
        type: "tt:TextAnchorSelector",
        start: 6333,
        end: 6333,
        beginCharOffset: 144,
        endCharOffset: 157,
      },
    },
    {
      source:
        "https://textrepo.suriano.huygens.knaw.nl/api/view/versions/b0ecba9d-289b-4736-ba15-f0d5134388b9/segments/index/6333/144/6333/157",
      type: "LogicalText",
    },
  ],
};

export const dummyViewAnno = {
  bodyId: "urn:suriano:ent:2109407-dummy",
  start: {
    line: 6,
    offset: 1232,
  },
  end: {
    line: 6,
    offset: 1249,
  },
};
