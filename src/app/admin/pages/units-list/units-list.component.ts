import { Component } from '@angular/core'
import { TranslateModule, TranslateService } from '@ngx-translate/core'

import { MatButton } from '@angular/material/button'
import { UnitsListTableComponent } from './units-list-table/units-list-table.component'
import { MatIcon } from '@angular/material/icon'
import { HealthcareUnit } from '../../repository/dto/healthcare-unit'
import { DialogService } from '../../support/dialog-service'

@Component({
  selector: 'app-units-list',
  standalone: true,
  imports: [MatButton, MatIcon, TranslateModule, UnitsListTableComponent],
  templateUrl: './units-list.component.html',
  styleUrl: './units-list.component.scss',
})
export class UnitsListComponent {
  constructor(
    private dialog: DialogService,
    private translate: TranslateService,
  ) {}

  protected async onEdit(unit: HealthcareUnit) {
    console.log(unit)
  }

  protected onDelete(unit: HealthcareUnit) {
    this.dialog.attention({
      buttonsType: 'yes_no',
      text:
        this.translate.instant('admin.units-list.dialog-confirm-delete') +
        unit.name +
        '?',
      onConfirm: () => console.log('+++delete', unit),

      // this.store.dispatch(SectionActions.deleteSection({ section })),
    })
  }
}
