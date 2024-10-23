import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import {map, Observable, tap} from "rxjs";
import {SurveyAdminState} from "../../../store/store";
import {selectSurveyState} from "../../../store/survey/reducer";
import {DialogService} from "../../../support/dialog-service";
import {SurveyActions} from "../../../store/survey/actions";
import {WithSubscriptionsComponent} from "../../../support/with-subscriptions-component";
import {Actions, ofType} from "@ngrx/effects";
import {Section} from "../../../repository/dto/section";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatButton} from "@angular/material/button";


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
    MatDialogClose
  ],
  templateUrl: './print-survey-dialog.component.html',
  styleUrl: './print-survey-dialog.component.scss'
})
export class PrintSurveyDialogComponent extends WithSubscriptionsComponent implements OnInit {

  constructor(
    private actions: Actions,
    private store: Store<SurveyAdminState>,
    private fb: FormBuilder,
    private dialog: DialogService,
  ) {
    super();
    this.printSurveyForm = this.fb.group({
      unit: new FormControl<string | null>(null, Validators.required),
      type: new FormControl<string | null>(null, Validators.required),
      surveyId: new FormControl<number | null>(null, Validators.required),
      copies: new FormControl<number>(0),
    });
  }

  surveys$: Observable<Array<Section>> = this.store.select(selectSurveyState).pipe(map(({surveys}) => surveys?.content ?? []));

  ngOnInit() {
    this.addSubscriptions(
      this.actions.pipe(
        ofType(SurveyActions.printSurveySucceeded),
        tap(() => {
          //FIXME
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
  disabled$: Observable<boolean> = this.state$.pipe(map(({surveys}) => !surveys?.content?.length));

  units = [
    {value: 'cardio', viewValue: 'cardio'},
  ];

  protected handleCopies(copies: number) {
    this.printSurveyForm.patchValue({copies})
  }

  protected print() {
    if (this.printSurveyForm.valid) {
      this.store.dispatch(SurveyActions.printSurvey({printSurveyForm: this.printSurveyForm.value}))
    }
  }
}
