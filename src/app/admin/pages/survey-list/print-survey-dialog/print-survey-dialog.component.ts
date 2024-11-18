import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import {map, Observable, tap} from "rxjs";
import {SurveyAdminState} from "../../../store/store";
import {selectSurveyState, SurveyOperatingStatus} from "../../../store/survey/reducer";
import {DialogService} from "../../../support/dialog-service";
import {SurveyActions} from "../../../store/survey/actions";
import {WithSubscriptionsComponent} from "../../../support/with-subscriptions-component";
import {Actions, ofType} from "@ngrx/effects";
import {
  MAT_DIALOG_DATA,
  MatDialog,
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
import {SurveyUtils} from "../../../support/survey-utils";
import {Survey} from "../../../repository/dto/survey";
import {HealthcareUnit, HealthcareUnitStructure} from "../../../repository/dto/healthcare-unit";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import printJS from "print-js";
import {PrintDataResponse} from "../../../repository/dto/print-data-response";


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

  form: PrintSurveyForm = this.fb.group({
    healthcareUnit: new FormControl<HealthcareUnit | null>(null, Validators.required),
    structure: new FormControl<HealthcareUnitStructure | null>(null, Validators.required),
    survey: new FormControl<Survey | null>(null, Validators.required),
    copies: new FormControl<number>(0),
  });

  state$ = this.store.select(selectSurveyState)
  disabled$: Observable<boolean> = this.state$.pipe(map(({surveys}) => !surveys?.content?.length));
  printing$ = this.state$.pipe(map(({operatingStatus}) => operatingStatus?.status === SurveyOperatingStatus.PRINTING));

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PrintDataResponse,
    private actions: Actions,
    private store: Store<SurveyAdminState>,
    private fb: FormBuilder,
    private dialog: DialogService,
    private matDialog: MatDialog,
  ) {
    super();
  }

  ngOnInit() {
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
