import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { defaultLanguage, Language, languages } from './language.model'
import { TranslateService } from '@ngx-translate/core'

import { HttpClient } from '@angular/common/http'
import { LocalStorageKey, LocalStorageUtils } from '../utils/local-storage-utils'

@Injectable({ providedIn: 'root' })
export class LanguageService {
  constructor(
    private translate: TranslateService,
    private http: HttpClient,
  ) { }

  private current: Language = defaultLanguage

  private language: BehaviorSubject<Language> = new BehaviorSubject<Language>(
    this.current,
  )

  selectedLanguage = this.language.asObservable()

  select(update: Language): void {
    this.current = update
    LocalStorageUtils.setItem(LocalStorageKey.localeId, this.current.localeId)
    this.translate.setDefaultLang(this.current.localeId)
    this.translate.use(this.current.localeId)
    this.language.next(this.current)
  }

  example() {
    return this.http.get('api/user-profile')
  }

  get currentLanguage(): Language {
    return this.current
  }

  init() {
    const storedLocaleId = LocalStorageUtils.getItem(LocalStorageKey.localeId)
    const storedLanguage = languages.find(
      (lang) => lang.localeId === storedLocaleId,
    )
    if (storedLanguage) {
      this.select(storedLanguage)
    } else {
      this.select(defaultLanguage)
    }
  }
}
