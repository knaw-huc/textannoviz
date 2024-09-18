import merge from "lodash/merge";
import logo from "../../../assets/logo-republic-temp.png";
import { ProjectConfig } from "../../../model/ProjectConfig";
import { defaultConfig } from "../../default/config";
import { MetadataPanel } from "../MetadataPanel";
import { SearchItem } from "../SearchItem";
import { englishVanGoghLabels } from "./englishVanGoghLabels";

export const vangoghConfig: ProjectConfig = merge({}, defaultConfig, {
  id: "vangogh",
  relativeTo: "tf:File",
  annotationTypesToInclude: [
    // "tei:Artworklist",
    // "tei:Bibliolist",
    // "tei:Biolist",
    // "tei:ListBibl",
    // "tei:ListObject",
    // "tei:ListPerson",
    // "tei:Supplied",
    // "tei:Figure",
    // "tei:Settlement",
    // "tei:Availability",
    // "tei:CorrespDesc",
    // "tei:Facsimile",
    // "tei:Institution",
    // "tei:Licence",
    // "tei:MsDesc",
    // "tei:MsIdentifier",
    // "tei:Name",
    // "tei:PlaceName",
    // "tei:ProfileDesc",
    // "tei:PubPlace",
    // "tei:StandOff",
    "tf:Letter",
    // "tei:Body",
    // "tei:FileDesc",
    // "tei:PublicationStmt",
    // "tei:SourceDesc",
    // "tei:TeiHeader",
    // "tei:Text",
    // "tei:TitleStmt",
    "tf:File",
    // "tei:Bibl",
    // "tei:Label",
    // "tei:Measure",
    // "tei:Death",
    // "tei:Birth",
    // "tei:Forename",
    // "tei:PersName",
    // "tei:Person",
    // "tei:Surname",
    // "tei:CorrespAction",
    // "tei:Div",
    // "tei:Publisher",
    // "tei:Title",
    // "tei:Surface",
    // "tei:Relation",
    // "tei:AltIdentifier",
    // "tei:Editor",
    // "tei:ListAnnotation",
    // "tei:Artwork",
    // "tei:Head",
    // "tei:Date",
    // "tei:Idno",
    // "tei:Zone",
    // "tei:Space",
    "tf:Page",
    // "tei:Graphic",
    // "tei:Ref",
    // "tei:Note",
    // "tei:Ptr",
    // "tei:Hi",
    // "tei:Rs",
    // "tei:C",
    // "tei:P",
  ],
  allPossibleTextPanels: ["textOrig", "textTrans", "self"],
  defaultTextPanels: ["textOrig"],
  elasticIndexName: "letters-vangogh-0.2.1",
  initialDateFrom: "1600-01-01",
  initialDateTo: "2000-01-01",
  initialRangeFrom: "0",
  initialRangeTo: "30000",
  maxRange: 30000,
  logoImageUrl: logo,
  headerColor: "bg-brand1-100 text-brand1-700",
  headerTitle: "Correspondence of Vincent van Gogh",
  showSearchResultsButtonFooter: false,
  useExternalConfig: true,
  showToggleTextPanels: true,
  defaultCheckboxAggsToRender: [
    "correspondent",
    "institution",
    "location",
    "msid",
    "period",
    "periodlong",
    "sender",
  ],
  components: {
    SearchItem,
    MetadataPanel,
  },
  selectedLanguage: "en",
  languages: [{ code: "en", labels: englishVanGoghLabels }],
});
