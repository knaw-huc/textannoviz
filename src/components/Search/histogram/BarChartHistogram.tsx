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
import { CategoricalChartState } from "recharts/types/chart/types";
import { HitsYear } from "./Histogram";
import { translateSelector, useProjectStore } from "../../../stores/project.ts";

type BarChartHistorgramProps = {
  hitsYear: HitsYear;
  filterDateQuery: (event: CategoricalChartState) => void;
};

export const BarChartHistogram = (props: BarChartHistorgramProps) => {
  const translate = useProjectStore(translateSelector);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        width={500}
        height={300}
        data={props.hitsYear}
        margin={{ right: 30, bottom: 10 }}
        barCategoryGap="1%"
        onClick={(event) => props.filterDateQuery(event)}
      >
        <CartesianGrid strokeDasharray="1 6" />
        <XAxis dataKey="year" />
        <YAxis dataKey="count" allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="count"
          name={translate("OCCURRENCES_PER_YEAR")}
          fill="hsl(32, 95%, 64%)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
