import {Component, Input} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/core";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatSelect} from "@angular/material/select";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Survey} from "../../../repository/dto/survey";
import {Store} from "@ngrx/store";
import {map, Observable} from "rxjs";
import {AsyncPipe, NgForOf} from "@angular/common";
import {SurveyAdminState} from "../../../store/store";
import {selectSurveyState} from "../../../store/survey/reducer";
import {DialogService} from "../../../support/dialog-service";


export type PrintSurveyForm = FormGroup<{
  unit: FormControl<string | null>;
  type: FormControl<string | null>;
  surveyId: FormControl<number | null>;
  copies: FormControl<number | null>;
}>

@Component({
  selector: 'app-print-card',
  standalone: true,
  imports: [
    MatButton,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatLabel,
    MatOption,
    MatRadioButton,
    MatRadioGroup,
    MatSelect,
    TranslateModule,
    FormsModule,
    MatFormField,
    AsyncPipe,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './print-card.component.html',
  styleUrl: './print-card.component.scss'
})
export class PrintCardComponent {
  @Input({alias: "surveys", required: true}) surveys!: Array<Survey>;

  constructor(
    private store: Store<SurveyAdminState>,
    private fb: FormBuilder,
    private dialog: DialogService,
    private translate: TranslateService
  ) {
    this.printSurveyForm = this.fb.group({
      unit: new FormControl<string | null>(null),
      type: new FormControl<string | null>(null, Validators.required),
      surveyId: new FormControl<number | null>(null),
      copies: new FormControl<number>(0),
    });
  }

  printSurveyForm!: PrintSurveyForm

  state$ = this.store.select(selectSurveyState)
  disabled$: Observable<boolean> = this.state$.pipe(map(({surveys}) => !surveys.length));

  units = [
    {value: 'cardio', viewValue: 'cardio'},
  ];

  protected handleCopies(copies: number) {
    this.printSurveyForm.patchValue({copies})
  }

  protected print() {
    console.log('print ', this.printSurveyForm.value)
    const copiesValue = this.printSurveyForm.controls.copies.value
    const copiesTranslation = this.translate.instant(copiesValue === 1 ? 'copy' : 'copies').toLowerCase();
    this.dialog.info({
      buttonsType: 'confirm_cancel',
      text: this.translate.instant('admin.print-card.resume', {
        ...this.printSurveyForm.value,
        copies: `${copiesValue} ${copiesTranslation}`,
        survey: this.printSurveyForm.controls.surveyId.value
      }),
      onConfirmLabel: this.translate.instant('print'),
    })
  }
}
