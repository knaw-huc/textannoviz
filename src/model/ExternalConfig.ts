export type ExternalConfig = {
  indexName: string;
  initialDateFrom?: string;
  initialDateTo?: string;
  initialRangeFrom?: string;
  initialRangeTo?: string;
  maxRange?: number;
  broccoliUrl?: string;
  annotationTypesToInclude?: string[];
};
