import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SearchResult } from "../../../model/Search";
import { createIndices } from "../../../utils/createIndices";

type HistogramProps = {
  searchResults: SearchResult;
  dateFacet: string;
  graphType: string;
  graphFrom: string;
  graphTo: string;
  showHistogram: boolean;
};

type HitsYear = {
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

  const years = createIndices(
    parseInt(props.graphFrom),
    parseInt(props.graphTo),
  );

  const yearsInData = Object.keys(
    props.searchResults.aggs[props.dateFacet],
  ).map((year) => parseInt(year));

  years.map((year) => {
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
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            width={500}
            height={300}
            data={hitsYear}
            margin={{ right: 30, bottom: 10 }}
            barCategoryGap="1%"
          >
            <CartesianGrid strokeDasharray="1 6" />
            <XAxis dataKey="year" />
            <YAxis dataKey="count" allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="count"
              name="Occurrences per year"
              fill="#8884d8"
              onClick={(event) => console.log(event)}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : null}
      {props.graphType === "line" ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={hitsYear} margin={{ right: 30, bottom: 10 }}>
            <CartesianGrid strokeDasharray="1 6" />
            <XAxis dataKey="year" />
            <YAxis dataKey="count" allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line
              dataKey="count"
              name="Occurrences per year"
              stroke="#8884d8"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : null}
    </>
  );
};
