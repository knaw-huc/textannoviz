import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MouseHandlerDataParam } from "recharts/types/synchronisation/types";
import { HitsYear } from "./Histogram";

type LineChartHistorgramProps = {
  hitsYear: HitsYear;
  filterDateQuery: (event: MouseHandlerDataParam) => void;
};

export const LineChartHistogram = (props: LineChartHistorgramProps) => (
  <ResponsiveContainer width="100%" height={400}>
    <LineChart
      width={500}
      height={300}
      data={props.hitsYear}
      margin={{ right: 30, bottom: 10 }}
      onClick={(event) => props.filterDateQuery(event)}
    >
      <CartesianGrid strokeDasharray="1 6" />
      <XAxis dataKey="year" />
      <YAxis dataKey="count" allowDecimals={false} />
      <Tooltip />
      <Legend />
      <Line
        dataKey="count"
        name="Occurrences per year"
        stroke="hsl(32, 95%, 64%)"
      />
    </LineChart>
  </ResponsiveContainer>
);
