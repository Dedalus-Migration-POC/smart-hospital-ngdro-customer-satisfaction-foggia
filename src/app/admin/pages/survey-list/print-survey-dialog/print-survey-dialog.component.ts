import {Component, Input, OnInit} from '@angular/core';
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
import {map, Observable, tap} from "rxjs";
import {AsyncPipe, NgForOf} from "@angular/common";
import {SurveyAdminState} from "../../../store/store";
import {selectSurveyState} from "../../../store/survey/reducer";
import {DialogService} from "../../../support/dialog-service";
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {SurveyActions} from "../../../store/survey/actions";
import {WithSubscriptionsComponent} from "../../../support/with-subscriptions-component";
import {Actions, ofType} from "@ngrx/effects";


export type PrintSurveyForm = FormGroup<{
  unit: FormControl<string | null>;
  type: FormControl<string | null>;
  surveyId: FormControl<number | null>;
  copies: FormControl<number | null>;
}>

@Component({
  selector: 'app-print-survey-dialog',
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
    NgForOf,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './print-survey-dialog.component.html',
  styleUrl: './print-survey-dialog.component.scss'
})
export class PrintSurveyDialogComponent extends WithSubscriptionsComponent implements OnInit {
  @Input({alias: "surveys", required: true}) surveys!: Array<Survey>;

  constructor(
    private matDialog: MatDialog,
    private actions: Actions,
    private store: Store<SurveyAdminState>,
    private fb: FormBuilder,
    private dialog: DialogService,
    private translate: TranslateService
  ) {
    super();
    this.printSurveyForm = this.fb.group({
      unit: new FormControl<string | null>(null),
      type: new FormControl<string | null>(null, Validators.required),
      surveyId: new FormControl<number | null>(null),
      copies: new FormControl<number>(0),
    });
  }

  ngOnInit() {
    this.addSubscriptions(
      this.actions.pipe(
        ofType(SurveyActions.printSurveySucceeded),
        tap(() => {
          this.dialog.info({text: "Stampa inviata con successo", buttonsType: 'ok'})
        })
      ).subscribe(),

      this.actions.pipe(
        ofType(SurveyActions.printSurveyFailed),
        tap(() => {
          this.dialog.error({
            buttonsType: 'retry_cancel',
            onConfirm: () => this.store.dispatch(SurveyActions.printSurvey({printSurveyForm: this.printSurveyForm.value}))
          })
        })
      ).subscribe()
    )
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
    this.addSubscriptions(
      this.dialog.info({
        buttonsType: 'confirm_cancel',
        text: this.translate.instant('admin.print-survey-dialog.resume', {
          ...this.printSurveyForm.value,
          copies: `${copiesValue} ${copiesTranslation}`,
          survey: this.printSurveyForm.controls.surveyId.value
        }),
        onConfirmLabel: this.translate.instant('print'),
        onConfirm: () => this.store.dispatch(SurveyActions.printSurvey({printSurveyForm: this.printSurveyForm.value}))
      }).afterClosed().subscribe(() => {
        this.matDialog.getDialogById("PRINT_SURVEY_DIALOG")?.close()
      })
    )
  }
}
