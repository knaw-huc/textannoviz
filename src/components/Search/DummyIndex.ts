export const dummyIndex: Record<string, string | Record<string, string>> = {
  bodyType: "keyword",
  propositionType: "keyword",
  resolutionType: "keyword",
  textType: "keyword",
  sessionDate: "date",
  sessionDay: "byte",
  sessionMonth: "byte",
  sessionYear: "short",
  attendants: {
    id: "keyword",
    name: "keyword",
  },
  entities: {
    category: "keyword",
    id: "keyword",
    labels: "keyword",
    name: "keyword",
  },
  sessionWeekday: "keyword",
};
