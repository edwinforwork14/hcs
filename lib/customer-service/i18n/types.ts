export type Language = 'en' | 'es'

export type Translations = Record<string, string>
export type TranslationBundle = Record<Language, Translations>
