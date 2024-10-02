import {
  Aggregation,
  Aggregations,
  SimpleAggregation,
} from "../../../model/Search";

export function isSimpleAggregation(
  aggregation: Aggregation,
): aggregation is SimpleAggregation {
  return (
    typeof aggregation === "object" &&
    aggregation !== null && // Ensure it's not null
    "order" in aggregation &&
    "size" in aggregation
  );
}

export function getSortOrder(
  aggs: Aggregations[],
  labelName: string,
  facetName: string,
): string | undefined {
  function findAggs(aggs: Aggregations[], keyName: string) {
    for (const agg of aggs) {
      const matchingKey = Object.keys(agg).find((key) => {
        return keyName.startsWith(key);
      });
      if (matchingKey) {
        return {
          label: matchingKey,
          value: agg[matchingKey],
        };
      }
    }
    return;
  }
  const foundAggs = findAggs(aggs, labelName);

  if (!foundAggs) {
    return undefined;
  }

  const aggValue = foundAggs.value;

  if (isSimpleAggregation(aggValue)) {
    return aggValue.order;
  }

  if (typeof aggValue === "object") {
    return Object.entries(aggValue)
      .filter(([name]) => {
        return name === facetName;
      })
      .map(([, value]) => {
        return value.order;
      })
      .join(", ");
  }

  return undefined;
}
