export type LanguageCode = 'en' | 'nl';

export type Language = {
  code: LanguageCode,
  labels: Record<string, string>,
}
