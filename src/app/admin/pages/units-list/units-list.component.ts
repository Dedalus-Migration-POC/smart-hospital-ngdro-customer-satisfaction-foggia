import { Component, inject } from '@angular/core'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { MatButton } from '@angular/material/button'
import { UnitsListTableComponent } from './units-list-table/units-list-table.component'
import { MatIcon } from '@angular/material/icon'
import { HealthcareUnit } from '../../repository/dto/healthcare-unit'
import { DialogService } from '../../support/dialog-service'
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { NewUnitDialog } from './new-unit-dialog/new-unit-dialog'
import { MatDialog } from '@angular/material/dialog'
import { Store } from '@ngrx/store'
import { SurveyAdminState } from '../../store/store'
import { UnitsListActions } from '../../store/units/actions'

@Component({
  selector: 'app-units-list',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    TranslateModule,
    UnitsListTableComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './units-list.component.html',
  styleUrl: './units-list.component.scss',
})
export class UnitsListComponent {
  constructor(
    private dialog: DialogService,
    private translate: TranslateService,
    private store: Store<SurveyAdminState>,
  ) {}

  unitForm = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    type: new FormControl<string>('', Validators.required),
    department: new FormControl<boolean>(true, { nonNullable: true }),
    ambulatory: new FormControl<boolean>(false, { nonNullable: true }),
  })

  onEdit(unit: HealthcareUnit) {
    this.unitForm.controls.name.setValue(unit.name)
    this.unitForm.controls.type.setValue(unit.type)
    this.unitForm.controls.department.setValue(
      unit.departments.find((dep) => dep === 'DEPARTMENT') ? true : false,
    )
    this.unitForm.controls.ambulatory.setValue(
      unit.departments.find((dep) => dep === 'AMBULATORY') ? true : false,
    )
    this.unitDialog.open(NewUnitDialog, {
      data: {
        form: this.unitForm,
        id: unit.id,
      },
    })
  }

  onDelete(unit: HealthcareUnit) {
    this.dialog.attention({
      buttonsType: 'yes_no',
      text:
        this.translate.instant('admin.units-list.dialog-confirm-delete') +
        unit.name +
        '?',
      onConfirm: () =>
        this.store.dispatch(UnitsListActions.deleteUnit({ id: unit.id })),
    })
  }

  readonly unitDialog = inject(MatDialog)
  onCrate(): void {
    this.unitDialog.open(NewUnitDialog, {
      data: {
        form: this.unitForm,
      },
    })
  }
}
