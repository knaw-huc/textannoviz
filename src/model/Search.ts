export interface SearchResult {
  total: {
    value: number;
    relation: string;
  };
  results: SearchResultBody[];
}

export interface SearchResultBody {
  _id: string;
  bodyType: string;
  sessionDate: string;
  sessionDay: number;
  sessionMonth: number;
  sessionYear: number;
  sessionWeekday: string;
  propositionType: string;
  _hits: {
    preview: string;
    locations: {
      start: {
        line: number;
        offset: number;
      };
      end: {
        line: number;
        offset: number;
      };
    }[];
  }[];
}

export interface FacetType {
  sessionWeekday: {
    Veneris: number;
    Lunae: number;
    Martis: number;
    Jovis: number;
    Sabbathi: number;
    Mercurii: number;
  };
  propositionType: {
    missive: number;
    requeste: number;
    rapport: number;
    memorie: number;
    resolutie: number;
    onbekend: number;
    oraal: number;
    voordracht: number;
    rekening: number;
    declaratie: number;
    advies: number;
    conclusie: number;
    instructie: number;
  };
}
