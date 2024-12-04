import { Component, ElementRef, Input, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DesignAngularKitModule, IconName } from 'design-angular-kit'
import { TranslateModule } from '@ngx-translate/core'
import { map } from 'rxjs'
import { LanguageService } from 'src/app/i18n/language.service'
import { languages } from 'src/app/i18n/language.model'
import { Languages } from 'src/app/layout/layout.component'

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, DesignAngularKitModule, TranslateModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  @Input() languages!: Array<Languages>

  @ViewChild('skipper', { static: false }) skipper: ElementRef | undefined
  public skipToMainContent(): void {
    this.skipper?.nativeElement.focus()
  }

  selectedLang$ = this.languageService.selectedLanguage.pipe(
    map((l) => this.languages.find((lang) => l.localeId === lang.code)),
  )

  constructor(private languageService: LanguageService) {}

  switchLanguage(lang: { name: string; code: string }) {
    const language = languages.find((l) => l.localeId === lang.code)
    if (language) {
      this.languageService.select(language)
    }
  }

  focusNext(id: string) {
    document.getElementById(id)?.click()
  }
}
