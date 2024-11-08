import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import {BehaviorSubject, EMPTY, finalize, map, Observable, of, switchMap, take, tap} from "rxjs";
import {SurveyAdminState} from "../../../store/store";
import {selectSurveyState} from "../../../store/survey/reducer";
import {DialogService} from "../../../support/dialog-service";
import {SurveyActions} from "../../../store/survey/actions";
import {WithSubscriptionsComponent} from "../../../support/with-subscriptions-component";
import {Actions, ofType} from "@ngrx/effects";
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatButton} from "@angular/material/button";
import {SurveyUtils} from "../../../support/survey-utils";
import {Survey} from "../../../repository/dto/survey";
import {HealthcareUnitService} from "../../../repository/healthcare-unit-service";
import {HealthcareUnit, HealthcareUnitStructure} from "../../../repository/dto/healthcare-unit";
import {catchError} from "rxjs/operators";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import printJS from "print-js";


export type PrintSurveyForm = FormGroup<{
  healthcareUnit: FormControl<HealthcareUnit | null>;
  structure: FormControl<HealthcareUnitStructure | null>;
  survey: FormControl<Survey | null>;
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
    MatDialogClose,
    MatProgressSpinner
  ],
  templateUrl: './print-survey-dialog.component.html',
  styleUrl: './print-survey-dialog.component.scss'
})
export class PrintSurveyDialogComponent extends WithSubscriptionsComponent implements OnInit, AfterViewInit {

  protected readonly SurveyUtils = SurveyUtils;

  protected loading$ = new BehaviorSubject(false);
  protected error$ = new BehaviorSubject(false);
  protected healthcareUnits: Array<HealthcareUnit> = []

  form: PrintSurveyForm = this.fb.group({
    healthcareUnit: new FormControl<HealthcareUnit | null>(null, Validators.required),
    structure: new FormControl<HealthcareUnitStructure | null>(null, Validators.required),
    survey: new FormControl<Survey | null>(null, Validators.required),
    copies: new FormControl<number>(0),
  });

  state$ = this.store.select(selectSurveyState)
  disabled$: Observable<boolean> = this.state$.pipe(map(({surveys}) => !surveys?.content?.length));

  constructor(
    private actions: Actions,
    private store: Store<SurveyAdminState>,
    private fb: FormBuilder,
    private dialog: DialogService,
    private matDialog: MatDialog,
    private healthcareUnitService: HealthcareUnitService
  ) {
    super();
  }

  surveys$: Observable<Array<Survey>> = this.store.select(selectSurveyState).pipe(map(({surveys}) => surveys?.content ?? []));

  ngOnInit() {
    of(EMPTY).pipe(
      take(1),
      tap(() => {
        console.log('tap')
        this.error$.next(false)
        this.loading$.next(true)
      }),
      switchMap(() =>
        this.healthcareUnitService.find().pipe(
          map(healthcareUnits => (this.healthcareUnits = healthcareUnits)),
          catchError(() => {
            this.error$.next(true);
            return EMPTY
          }),
          finalize(() => (this.loading$.next(false)))
        )
      )
    )
      .subscribe();

    this.addSubscriptions(
      this.actions.pipe(
        ofType(SurveyActions.printSurveySucceeded),
        tap(({document}) => {
          this.matDialog.getDialogById('print_survey_dialog_id')?.close()
          printJS({
            printable: URL.createObjectURL(document),
            type: 'pdf',
            base64: false,
          })
        })
      ).subscribe(),

      this.actions.pipe(
        ofType(SurveyActions.printSurveyFailed),
        tap(() => {
          this.dialog.error({
            buttonsType: 'retry_cancel',
            onConfirm: () => this.store.dispatch(SurveyActions.printSurvey({printSurveyForm: this.form.value}))
          })
        })
      ).subscribe()
    )
  }

  ngAfterViewInit() {
    this.addSubscription(
      this.form.valueChanges.subscribe(({healthcareUnit}) => {
        if (healthcareUnit && !this.canChooseType(healthcareUnit)) {
          this.form.patchValue({structure: healthcareUnit.departments.at(0)}, {emitEvent: false})
        }
        console.log(this.form.getRawValue())
      })
    )
  }

  protected canChooseType(unit: HealthcareUnit | null): boolean {
    return !!unit && unit.departments.length > 1
  }

  protected handleCopies(copies: number) {
    this.form.patchValue({copies})
  }

  protected print() {
    if (this.form.valid) {
      this.store.dispatch(SurveyActions.printSurvey({printSurveyForm: this.form.value}))
    }
  }
}
