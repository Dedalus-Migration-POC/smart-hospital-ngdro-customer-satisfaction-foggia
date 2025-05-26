import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { AsyncPipe, NgForOf, NgIf } from '@angular/common'
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
import { TranslateModule, TranslateService } from '@ngx-translate/core'
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
import printJS from 'print-js-updated'
import { Store } from '@ngrx/store'
import { SurveyAdminState } from '../../store/store'
import { DialogService } from '../../support/dialog-service'
import { PrintDataResponse } from '../../repository/dto/print-data-response'
import { User } from '../../repository/dto/user'
import { AppActions } from '../../store/application/actions'

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

  @Output() healthcareUnitEmitted = new EventEmitter<HealthcareUnit>();

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
    survey: new FormControl<Survey | null>(
      { value: null, disabled: true },
      Validators.required,
    ),
    copies: new FormControl<number>(0),
  })

  state$ = this.store.select(selectSurveyState)
  printing$ = this.state$.pipe(
    map(
      ({ operatingStatus }) =>
        operatingStatus?.status === SurveyOperatingStatus.PRINTING,
    ),
  )

  filteredSurveys: Survey[] = []

  isOperator = false
  unitsOperator: HealthcareUnit[] = [];

  constructor(
    private actions: Actions,
    private store: Store<SurveyAdminState>,
    private fb: FormBuilder,
    private dialog: DialogService,
    private matDialog: MatDialog,
    private translate: TranslateService,
  ) {
    super()
  }

  ngOnInit() {
    this.isOperator =
      this.user?.roles?.length === 1 && this.user.roles.includes('OPERATOR')

    if (this.isOperator) {
      this.unitsOperator = this.data.healthcareUnits.filter((unit) =>
          this.user?.unit?.includes(unit.name),
        ).sort((a, b) => a.name.localeCompare(b.name));
    }

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
    const userHealthcareUnit = this.getUnit()

    if (userHealthcareUnit) {
      if (this.isOperator) {
        this.healthcareUnitEmitted.emit(userHealthcareUnit);
      }

      this.form.patchValue({
        healthcareUnit: userHealthcareUnit,
      })
      // !this.canChooseType(this.getUnit())
      if (userHealthcareUnit.departments.length === 1) {
        this.setStructureAndSurvey(true, userHealthcareUnit)
      } else {
        this.setStructureAndSurvey(false, userHealthcareUnit)
      }

      this.addSubscription(
        this.form.controls.structure.valueChanges
          .pipe(
            tap(() => {
              this.enableSurveys()
              this.filterSurveys('structure')
            }),
          )
          .subscribe(),
      )
    }
    if (
      (this.user && this.isOperator && !this.user.unit) ||
      (this.user &&
        this.isOperator &&
        this.user.unit &&
        !this.user.unit?.length)
    ) {
      this.dialog.info({
        buttonsType: 'ok',
        text: this.translate.instant(
          'admin.print-survey-dialog.no-units-error',
        ),
        onConfirm: () => this.store.dispatch(AppActions.logout()),
      })
    }
   
      this.addSubscription(
        this.form.controls.healthcareUnit.valueChanges
          .pipe(
            tap((healthcareUnit) => {
              if (!healthcareUnit) {
                return
              }

              if (this.isOperator) {
                this.healthcareUnitEmitted.emit(this.form.controls.healthcareUnit?.value!);
              }

              // !this.canChooseType(healthcareUnit)
              if (healthcareUnit.departments.length === 1) {
                this.setStructureAndSurvey(true, healthcareUnit)
              } else {
                this.setStructureAndSurvey(false, healthcareUnit)
              }
            }),
          )
          .subscribe(),
      )

      this.addSubscription(
        this.form.controls.structure.valueChanges
          .pipe(
            tap(() => {
              this.enableSurveys()
              this.filterSurveys('structure')
            }),
          )
          .subscribe(),
      )
 
  }

  // protected canChooseType(unit: HealthcareUnit | undefined): boolean {
  //   return !!unit && unit.departments.length > 1
  // }

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
  getUnit() {
    if (this.user?.unit && this.user?.unit !== undefined) {
      return this.data?.healthcareUnits.find(
        (healthcareUnit) => healthcareUnit.name === this.user?.unit![0],
      )
    }
    return
  }

  private filterSurveys(triggeredBy: 'healthcareUnit' | 'structure') {
    let selectedStructureType: string | null = null

    if (triggeredBy === 'healthcareUnit') {
      const healthcareUnit = this.form.controls.healthcareUnit.value
      selectedStructureType = healthcareUnit?.departments?.[0] || null
    }

    if (triggeredBy === 'structure') {
      const structure = this.form.controls.structure.value
      selectedStructureType = structure
    }

    if (!selectedStructureType) {
      this.filteredSurveys = []
      return
    }

    this.filteredSurveys = this.data.surveys.filter(
      (survey) => survey.structureType === selectedStructureType,
    )
  }

  private enableSurveys() {
    const surveyControl = this.form.controls.survey
    surveyControl?.enable({ emitEvent: false })
    surveyControl?.reset(null, { emitEvent: false })
  }

  private setStructureAndSurvey(
    isSingleDepartment: boolean,
    healthcareUnit: HealthcareUnit,
  ) {
    if (isSingleDepartment) {
      this.form.patchValue(
        {
          structure: healthcareUnit.departments[0] as HealthcareUnitStructure,
        },
        { emitEvent: false },
      )

      this.form.controls.structure.disable({ emitEvent: false })
      this.enableSurveys()
    } else {
      this.form.controls.structure.patchValue(null, {
        emitEvent: false,
      })
      this.form.controls.structure.enable({ emitEvent: false })

      this.form.controls.survey.patchValue(null, {
        emitEvent: false,
      })
      this.form.controls.survey.disable({ emitEvent: false })
    }

    this.filterSurveys('healthcareUnit')
  }
}
