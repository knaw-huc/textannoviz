import logo from "../../../assets/logo-republic-temp.png";
import { ProjectConfig } from "../../../model/ProjectConfig";
import { AnnotationButtons } from "../AnnotationButtons.tsx";
import { AnnotationItemContent } from "../AnnotationItemContent.tsx";
import { Help } from "../Help.tsx";
import { MetadataPanel } from "../MetadataPanel.tsx";
import { SearchInfoPage } from "../SearchInfoPage.tsx";
import AnnotationItem from "../AnnotationItem.tsx";
import {defaultConfig} from "../../default/config";
import {englishMondriaanLabels} from "./englishMondriaanLabels.ts";

export const mondriaanConfig: ProjectConfig = Object.assign({}, defaultConfig,  {
  id: "mondriaan",
  relativeTo: "tf:Letter",
  annotationTypesToInclude: [
    // "nlp:Sentence",
    // "nlp:Token",
    "tei:Abbr",
    "tei:AccMat",
    "tei:Add",
    "tei:AddrLine",
    "tei:Address",
    "tei:AltIdentifier",
    "tei:Body",
    "tei:Change",
    "tei:Choice",
    "tei:Closer",
    "tei:CorrespAction",
    "tei:CorrespDesc",
    "tei:Country",
    "tei:Date",
    "tei:Dateline",
    "tei:DecoDesc",
    "tei:DecoNote",
    "tei:Del",
    "tei:Div",
    "tei:Editor",
    "tei:Expan",
    "tei:Facsimile",
    "tei:FileDesc",
    "tei:Graphic",
    "tei:Hi",
    "tei:Idno",
    "tei:Institution",
    "tei:Lb",
    "tei:ListAnnotation",
    "tei:MsDesc",
    "tei:MsIdentifier",
    "tei:Name",
    "tei:Note",
    "tei:ObjectDesc",
    "tei:Opener",
    "tei:Orig",
    "tei:P",
    "tei:PhysDesc",
    "tei:PlaceName",
    "tei:Postmark",
    "tei:Postscript",
    "tei:ProfileDesc",
    "tei:Ptr",
    "tei:PublicationStmt",
    "tei:Ref",
    "tei:Reg",
    "tei:RevisionDesc",
    "tei:Rs",
    "tei:Salute",
    "tei:Settlement",
    "tei:Signed",
    "tei:SourceDesc",
    "tei:Space",
    "tei:Sponsor",
    "tei:StandOff",
    "tei:Surface",
    "tei:TeiHeader",
    "tei:Text",
    "tei:Title",
    "tei:TitleStmt",
    "tei:Unclear",
    "tei:Zone",
    "tf:Chunk",
    "tf:Folder",
    "tf:Letter",
    "tf:Page",
  ],
  tier: ["folders", "letters"],
  scanAnnotation: "tf:Letter",
  elasticIndexName: "divs",
  initialDateFrom: "1909-01-01",
  initialDateTo: "1910-12-31",
  allPossibleTextPanels: [
    "textOrig",
    "textTrans",
    "notesEN",
    "title",
    "postalData",
  ],
  defaultTextPanels: ["textOrig", "textTrans"],
  showToggleTextPanels: true,
  logoImageUrl: logo,
  headerTitle: "MONDRIAAN",
  logoHref:
    "https://rkd.nl/nl/projecten-en-publicaties/projecten/130-mondriaan-editieproject",
  components: {
    AnnotationItem,
    AnnotationItemContent,
    AnnotationButtons,
    MetadataPanel,
    Help,
    SearchInfoPage,
  },
  labels: englishMondriaanLabels,
  mirador: {
    showTopMenuButton: true
  },
});
