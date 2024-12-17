import { AfterViewInit, Component, Input, OnInit } from '@angular/core'
import { NgForOf, NgIf } from '@angular/common'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle'
import { MatDialog } from '@angular/material/dialog'
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field'
import { MatOption } from '@angular/material/core'
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio'
import { MatSelect } from '@angular/material/select'
import { TranslateModule } from '@ngx-translate/core'
import {
  HealthcareUnit,
  HealthcareUnitStructure,
} from '../../repository/dto/healthcare-unit'
import { Survey } from '../../repository/dto/survey'
import {
  selectSurveyState,
  SurveyOperatingStatus,
} from '../../store/survey/reducer'
import { SurveyUtils } from '../../support/survey-utils'
import { map, tap } from 'rxjs'
import { WithSubscriptionsComponent } from '../../support/with-subscriptions-component'
import { Actions, ofType } from '@ngrx/effects'
import { SurveyActions } from '../../store/survey/actions'
import printJS from 'print-js'
import { Store } from '@ngrx/store'
import { SurveyAdminState } from '../../store/store'
import { DialogService } from '../../support/dialog-service'
import { PrintDataResponse } from '../../repository/dto/print-data-response'
import { User } from '../../repository/dto/user'

export type PrintSurveyForm = FormGroup<{
  healthcareUnit: FormControl<HealthcareUnit | null>
  structure: FormControl<HealthcareUnitStructure | null>
  survey: FormControl<Survey | null>
  copies: FormControl<number | null>
}>

@Component({
  selector: 'app-print-survey',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatError,
    MatFormField,
    MatLabel,
    MatOption,
    MatRadioButton,
    MatRadioGroup,
    MatSelect,
    NgForOf,
    NgIf,
    TranslateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './print-survey.component.html',
  styleUrl: './print-survey.component.scss',
})
export class PrintSurveyComponent
  extends WithSubscriptionsComponent
  implements OnInit, AfterViewInit
{
  @Input({ alias: 'user', required: true }) user!: User | null
  @Input({ alias: 'data', required: true }) data!: PrintDataResponse

  protected readonly SurveyUtils = SurveyUtils

  form: PrintSurveyForm = this.fb.group({
    healthcareUnit: new FormControl<HealthcareUnit | null>(
      null,
      Validators.required,
    ),
    structure: new FormControl<HealthcareUnitStructure | null>(
      { value: null, disabled: true },
      Validators.required,
    ),
    survey: new FormControl<Survey | null>(null, Validators.required),
    copies: new FormControl<number>(0),
  })

  state$ = this.store.select(selectSurveyState)
  printing$ = this.state$.pipe(
    map(
      ({ operatingStatus }) =>
        operatingStatus?.status === SurveyOperatingStatus.PRINTING,
    ),
  )

  isOperator = false

  constructor(
    private actions: Actions,
    private store: Store<SurveyAdminState>,
    private fb: FormBuilder,
    private dialog: DialogService,
    private matDialog: MatDialog,
  ) {
    super()
  }

  ngOnInit() {
    this.isOperator =
      this.user?.roles?.length === 1 &&
      this.user.roles.includes('ROLE_OPERATOR')

    this.addSubscriptions(
      this.actions
        .pipe(
          ofType(SurveyActions.printSurveySucceeded),
          tap(({ document }) => {
            this.matDialog.getDialogById('print_survey_dialog_id')?.close()
            printJS({
              printable: URL.createObjectURL(document),
              type: 'pdf',
              base64: false,
            })
          }),
        )
        .subscribe(),

      this.actions
        .pipe(
          ofType(SurveyActions.printSurveyFailed),
          tap(() => {
            this.dialog.error({
              buttonsType: 'retry_cancel',
              onConfirm: () =>
                this.store.dispatch(
                  SurveyActions.printSurvey({
                    printSurveyForm: this.form.value,
                  }),
                ),
            })
          }),
        )
        .subscribe(),
    )
  }

  ngAfterViewInit() {
    this.addSubscription(
      this.form.valueChanges
        .pipe(
          tap(({ healthcareUnit }) => {
            if (healthcareUnit && !this.canChooseType(healthcareUnit)) {
              this.form.patchValue(
                { structure: healthcareUnit.departments[0] },
                { emitEvent: false },
              )
              this.form.controls.structure.disable({ emitEvent: false })
            } else {
              // this.form.controls.structure.patchValue(null, {emitEvent: false})
              this.form.controls.structure.enable({ emitEvent: false })
            }
          }),
        )
        .subscribe(),
    )
  }

  protected canChooseType(unit: HealthcareUnit | null): boolean {
    return !!unit && unit.departments.length > 1
  }

  protected handleCopies(copies: number) {
    this.form.patchValue({ copies })
  }

  protected onCopiesChange(event: any) {
    if (event.target) this.form.patchValue({ copies: event.target.value })
  }

  public print() {
    this.form.markAllAsTouched()
    if (this.form.valid) {
      this.store.dispatch(
        SurveyActions.printSurvey({ printSurveyForm: this.form.getRawValue() }),
      )
    }
  }
}
