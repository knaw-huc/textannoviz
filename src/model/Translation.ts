export type Language = 'en' | 'nl';

export type Translation = {
  code: Language,
  labels: Record<string, string>,
}
