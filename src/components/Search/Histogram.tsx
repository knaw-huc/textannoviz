import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SearchResult } from "../../model/Search";
import { createIndices } from "../../utils/createIndices";

type HistogramProps = {
  searchResults: SearchResult;
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
*/

export const Histogram = (props: HistogramProps) => {
  const hitsYear: HitsYear = [];

  const years = createIndices(1705, 1795);

  const yearsInData = Object.keys(props.searchResults.aggs.sessionYear).map(
    (year) => parseInt(year),
  );

  years.map((year) => {
    Object.entries(props.searchResults.aggs.sessionYear).map(([key, value]) => {
      if (year === parseInt(key)) {
        hitsYear.push({
          name: "year",
          count: value,
          year: parseInt(key),
        });
      }
    });

    if (!yearsInData.includes(year)) {
      hitsYear.push({
        name: "year",
        count: 0,
        year: year,
      });
    }
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        width={500}
        height={300}
        data={hitsYear}
        margin={{ right: 30, bottom: 10 }}
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
  );
};
