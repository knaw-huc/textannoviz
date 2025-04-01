import { CategoricalChartState } from "recharts/types/chart/types";

import { SearchResult } from "../../../model/Search";
import { createIndices } from "../../../utils/createIndices";
import { BarChartHistogram } from "./BarChartHistogram";
import { LineChartHistogram } from "./LineChartHistogram";

type HistogramProps = {
  searchResults: SearchResult;
  dateFacet: string;
  graphType: string;
  graphFrom: string;
  graphTo: string;
  showHistogram: boolean;
  filterDateQuery: (event: CategoricalChartState) => void;
};

export type HitsYear = {
  name: string;
  count: number;
  year: number;
}[];

/*
  TODO:
  - parameters: oorspronkelijke data, begin, end
  - in component: switchen staaf/line, inzoomen, uitzoomen
  - met speciale klik dan waarde omhoog naar TAV voor filter search query
  - views: alles tussen eerste en laatste jaar in data, volledige breedte project, inzoomen, uitzoomen, per eeuw/decennia/jaar/kwartaal/maand/week/dag
  - verschillende soorten datatypes op de x-as? Bv. voorkomens van hits in de verschillende propositietypes?
*/

export const Histogram = (props: HistogramProps) => {
  if (!props.dateFacet.length) return null;
  if (!props.searchResults.aggs[props.dateFacet]) return null;
  if (!props.showHistogram) return null;

  const hitsYear: HitsYear = [];

  const yearsXAsis = createIndices(
    parseInt(props.graphFrom),
    parseInt(props.graphTo),
  );

  const yearsInData = Object.keys(
    props.searchResults.aggs[props.dateFacet],
  ).map((year) => parseInt(year));

  yearsXAsis.map((year) => {
    if (!props.dateFacet.length) return;
    Object.entries(props.searchResults.aggs[props.dateFacet]).map(
      ([key, value]) => {
        if (year === parseInt(key)) {
          hitsYear.push({
            name: "year",
            count: value,
            year: parseInt(key),
          });
        }
      },
    );

    if (!yearsInData.includes(year)) {
      hitsYear.push({
        name: "year",
        count: 0,
        year: year,
      });
    }
  });

  return (
    <>
      {props.graphType === "bar" ? (
        <BarChartHistogram
          hitsYear={hitsYear}
          filterDateQuery={props.filterDateQuery}
        />
      ) : null}
      {props.graphType === "line" ? (
        <LineChartHistogram
          hitsYear={hitsYear}
          filterDateQuery={props.filterDateQuery}
        />
      ) : null}
    </>
  );
};
