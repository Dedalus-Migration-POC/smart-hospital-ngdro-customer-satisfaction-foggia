import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import { DesignAngularKitModule, IconName } from 'design-angular-kit'

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslateModule, DesignAngularKitModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  tenant = {
    name: 'Azienda Ospedaliero Universitaria Policlinico Riuniti di Foggia',
    link: 'https://www.sanita.puglia.it/web/ospedaliriunitifoggia',
    logoFooter: {
      path: 'assets/images/logo-foggia.png',
      width: '185',
      height: null,
    },
  }
  smallPrints = [
    { name: 'footer.small-prints.media-policy', link: '#' },
    { name: 'footer.small-prints.legal-notes', link: '#' },
    { name: 'footer.small-prints.privacy-policy', link: '#' },
    { name: 'footer.small-prints.site-map', link: '#' },
  ]

  constructor() {}
}
