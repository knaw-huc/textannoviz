import merge from "lodash/merge";
import logo from "../../../assets/logo-mondrian-papers.png";
import {
  ProjectConfig,
  ProjectSpecificConfig,
} from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import AnnotationItem from "../AnnotationItem.tsx";
import { AnnotationItemContent } from "../AnnotationItemContent.tsx";
import { MetadataPanel } from "../MetadataPanel.tsx";
import { SearchItem } from "../SearchItem.tsx";
import { englishMondriaanLabels } from "./englishMondriaanLabels.ts";

export const mondriaanConfig: ProjectConfig = merge({}, defaultConfig, {
  id: "mondriaan",
  relativeTo: "tf:Letter",
  annotationTypesToInclude: [
    // "nlp:Sentence",
    // "nlp:Token",
    // "tei:Abbr",
    // "tei:AccMat",
    // "tei:Add",
    // "tei:AddrLine",
    // "tei:Address",
    // "tei:AltIdentifier",
    // "tei:Body",
    // "tei:Change",
    // "tei:Choice",
    // "tei:Closer",
    // "tei:CorrespAction",
    // "tei:CorrespDesc",
    // "tei:Country",
    // "tei:Date",
    // "tei:Dateline",
    // "tei:DecoDesc",
    // "tei:DecoNote",
    // "tei:Del",
    // "tei:Div",
    // "tei:Editor",
    // "tei:Expan",
    // "tei:Facsimile",
    // "tei:FileDesc",
    // "tei:Graphic",
    // "tei:Hi",
    // "tei:Idno",
    // "tei:Institution",
    // "tei:Lb",
    // "tei:ListAnnotation",
    // "tei:MsDesc",
    // "tei:MsIdentifier",
    // "tei:Name",
    // "tei:Note",
    // "tei:ObjectDesc",
    // "tei:Opener",
    // "tei:Orig",
    // "tei:P",
    // "tei:PhysDesc",
    // "tei:PlaceName",
    // "tei:Postmark",
    // "tei:Postscript",
    // "tei:ProfileDesc",
    // "tei:Ptr",
    // "tei:PublicationStmt",
    // "tei:Ref",
    // "tei:Reg",
    // "tei:RevisionDesc",
    // "tei:Rs",
    // "tei:Salute",
    // "tei:Settlement",
    // "tei:Signed",
    // "tei:SourceDesc",
    // "tei:Space",
    // "tei:Sponsor",
    // "tei:StandOff",
    // "tei:Surface",
    // "tei:TeiHeader",
    // "tei:Text",
    // "tei:Title",
    // "tei:TitleStmt",
    // "tei:Unclear",
    // "tei:Zone",
    // "tf:Chunk",
    "tf:Folder",
    "tf:Letter",
    // "tf:Page",
  ],
  elasticIndexName: "divs-mondriaan-0.9.0",
  initialDateFrom: "1909-01-01",
  initialDateTo: "1910-12-31",
  initialRangeFrom: "0",
  initialRangeTo: "30000",
  maxRange: 30000,
  allPossibleTextPanels: [
    "textOrig",
    "textTrans",
    "notesEN",
    "title",
    "postalData",
  ],
  defaultTextPanels: ["textOrig", "textTrans"],
  annotationTypesToHighlight: ["tei:Rs"],
  showToggleTextPanels: true,
  logoImageUrl: logo,
  headerColor: "bg-brand1-100 text-brand1-700",
  headerTitle: "MONDRIAAN",
  logoHref:
    "https://rkd.nl/nl/projecten-en-publicaties/projecten/130-mondriaan-editieproject",
  histogramFacet: "period",
  showHistogram: true,
  defaultKeywordAggsToRender: [
    "anno",
    "bodyType",
    "correspondent",
    "country",
    "institution",
    "lang",
    "letterId",
    "location",
    "msid",
    "period",
    "periodLong",
    "sender",
    "type",
  ],
  components: {
    AnnotationItem,
    AnnotationItemContent,
    MetadataPanel,
    SearchItem,
  },
  selectedLanguage: "en",
  languages: [
    {
      code: "en",
      labels: englishMondriaanLabels,
    },
  ],
  mirador: {
    showTopMenuButton: true,
  },
} as ProjectSpecificConfig);
