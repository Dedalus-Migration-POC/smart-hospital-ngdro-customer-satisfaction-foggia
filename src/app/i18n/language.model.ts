import localeEn from '@angular/common/locales/en'
import localeIt from '@angular/common/locales/it'
import { it, enUS, Locale } from 'date-fns/locale'
import { registerLocaleData } from '@angular/common'

export interface Language {
  name: string
  localeId: string
  locale: any
  dateFnsLocale: Locale
  parseInputFormat: string
}

export const languages: Language[] = [
  {
    name: 'Italiano',
    localeId: 'it',
    locale: localeIt,
    dateFnsLocale: it,
    parseInputFormat: 'dd/MM/yyyy',
  },
  {
    name: 'English',
    localeId: 'en',
    locale: localeEn,
    dateFnsLocale: enUS,
    parseInputFormat: 'dd/MM/yyyy',
  },
]

languages.forEach((language) => registerLocaleData(language.locale))

export const defaultLanguage = languages[0]
export const defaultLocale = defaultLanguage.dateFnsLocale
