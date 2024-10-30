import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogClose} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";
import {NgIf, NgOptimizedImage, NgSwitch, NgSwitchCase, NgSwitchDefault, NgTemplateOutlet} from "@angular/common";

export type DialogProps = {
  dialogType: 'info' | 'success' | 'attention' | 'error';
  buttonsType: 'yes_no' | 'confirm_cancel' | 'retry_cancel' | 'ok';
  title?: string;
  text?: string;
  onConfirmLabel?: string;
  onCancelLabel?: string;
  onConfirm?: VoidFunction;
  onCancel?: VoidFunction;
};

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    MatButton,
    TranslateModule,
    NgOptimizedImage,
    NgIf,
    MatDialogClose,
    NgSwitchCase,
    NgSwitch,
    NgTemplateOutlet,
    NgSwitchDefault
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogProps
  ) {
  }

  protected confirm() {
    if (this.data.onConfirm)
      this.data.onConfirm();
  }

  protected cancel() {
    if (this.data.onCancel)
      this.data.onCancel();

  }
}
