import {Component, Inject, ViewChild} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {PrintDataResponse} from "../../../repository/dto/print-data-response";
import {PrintSurveyComponent} from "../../../components/print-survey/print-survey.component";

@Component({
  selector: 'app-print-survey-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatSelect,
    MatLabel,
    MatError,
    NgIf,
    TranslateModule,
    MatOption,
    MatRadioGroup,
    MatRadioButton,
    AsyncPipe,
    NgForOf,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatProgressSpinner,
    PrintSurveyComponent
  ],
  templateUrl: './print-survey-dialog.component.html',
  styleUrl: './print-survey-dialog.component.scss'
})
export class PrintSurveyDialogComponent {
  @ViewChild(PrintSurveyComponent) printSurveyComponent!: PrintSurveyComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PrintDataResponse,
  ) {
  }
}
