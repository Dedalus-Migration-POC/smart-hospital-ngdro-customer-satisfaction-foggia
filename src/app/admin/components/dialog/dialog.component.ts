import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog'
import { MatButton } from '@angular/material/button'
import { TranslateModule } from '@ngx-translate/core'
import {
  CommonModule,
  NgIf,
  NgOptimizedImage,
  NgSwitch,
  NgSwitchCase,
  NgSwitchDefault,
  NgTemplateOutlet,
} from '@angular/common'
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'

export type DialogProps = {
  dialogType: 'info' | 'success' | 'attention' | 'error'
  buttonsType: 'yes_no' | 'confirm_cancel' | 'retry_cancel' | 'ok'
  showIcon?: boolean
  title?: string
  text?: string
  form?: FormGroup
  fields?: string[]
  onConfirmLabel?: string
  onCancelLabel?: string
  onConfirm?: VoidFunction
  onCancel?: VoidFunction
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButton,
    TranslateModule,
    NgOptimizedImage,
    NgIf,
    MatDialogClose,
    NgSwitchCase,
    NgSwitch,
    NgTemplateOutlet,
    NgSwitchDefault,
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogProps) {}

  protected confirm() {
    if (this.data.onConfirm) this.data.onConfirm()
  }

  protected cancel() {
    if (this.data.onCancel) this.data.onCancel()
  }
}
