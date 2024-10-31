import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DesignAngularKitModule } from 'design-angular-kit'
import { TranslateModule } from '@ngx-translate/core'

import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-error-card',
  standalone: true,
  imports: [
    CommonModule,
    DesignAngularKitModule,
    TranslateModule,
    RouterModule,
  ],
  templateUrl: './error-card.component.html',
  styleUrls: ['./error-card.component.scss'],
})
export class ErrorCardComponent {
  @Input() type?: string // es: expired / compiled /notFound

  constructor() {}
}
