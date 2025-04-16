import { Component, inject } from '@angular/core'
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { TranslateModule } from '@ngx-translate/core'
import { Store } from '@ngrx/store'
import { SurveyAdminState } from 'src/app/admin/store/store'
import { UnitsListActions } from 'src/app/admin/store/units/actions'
import { MatOption, MatSelect } from '@angular/material/select'
import { NgForOf } from '@angular/common'

export interface DialogData {
  form: FormGroup
  id?: string
}

@Component({
  selector: 'new-unit-dialog',
  templateUrl: 'new-unit-dialog.html',
  styleUrl: 'new-unit-dialog.scss',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatFormField,
    TranslateModule,
    MatCheckboxModule,
    MatSelect,
    MatOption,
    NgForOf,
  ],
})
export class NewUnitDialog {
  readonly dialogRef = inject(MatDialogRef<NewUnitDialog>)
  readonly data = inject<DialogData>(MAT_DIALOG_DATA)

  constructor(private store: Store<SurveyAdminState>) {}
  unitTypes = ['SC', 'SS', 'SSD']
  onNoClick(): void {
    this.dialogRef.close()
    this.data.form.reset()
  }

  protected confirm() {
    this.store.dispatch(
      UnitsListActions.createUnit({
        unit: { ...this.data.form.value, id: this.data.id },
      }),
    )
    this.data.form.reset()
  }
}
