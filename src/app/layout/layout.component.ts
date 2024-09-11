import { Component, OnInit } from '@angular/core'
import { IconName } from 'design-angular-kit'

export interface Languages {
  name: string
  code: string
  icon?: IconName
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})

export class LayoutComponent implements OnInit {
  languages!: Array<Languages>

  constructor() { }

  ngOnInit(): void {
    this.languages = [
      { name: 'ITA', code: 'it' },
      { name: 'EN', code: 'en' },
    ]
  }

}
