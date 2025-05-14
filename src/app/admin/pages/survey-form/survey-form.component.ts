import { Component, OnInit } from '@angular/core'
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { BehaviorSubject, combineLatest, map, take, tap } from 'rxjs'
import { Store } from '@ngrx/store'
import { Actions, ofType } from '@ngrx/effects'
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { SubmitSurveyOption, SurveyActions } from '../../store/survey/actions'
import { MatButton, MatIconButton } from '@angular/material/button'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import {
  MatError,
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { MatCard } from '@angular/material/card'
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common'
import { MatIcon } from '@angular/material/icon'
import { DialogService } from '../../support/dialog-service'
import { Section } from '../../repository/dto/section'
import { Survey } from '../../repository/dto/survey'
import { MatOption } from '@angular/material/core'
import { MatSelect } from '@angular/material/select'
import { MatProgressSpinner } from '@angular/material/progress-spinner'
import { WithSubscriptionsComponent } from '../../support/with-subscriptions-component'
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker'
import { SurveyAdminState } from '../../store/store'
import {
  selectAllSectionList,
  selectSectionList,
  selectSectionState,
} from '../../store/section/reducer'
import {
  selectSurveyState,
  SurveyOperatingStatus,
} from '../../store/survey/reducer'
import { withLatestFrom } from 'rxjs/operators'
import { MatTooltip } from '@angular/material/tooltip'
import { SurveyNameValidator } from '../../support/form-validators'
import { SectionUtils } from '../../support/section-utils'
import { SectionActions } from '../../store/section/actions'
import { UnitsListActions } from '../../store/units/actions'
import { selectStructureTypes } from '../../store/units/reducer'

export type SurveyForm = FormGroup<{
  id: FormControl<string | null>
  name: FormControl<string | null>
  version: FormControl<number | null>
  description: FormControl<string | null>
  startDate: FormControl<Date | null>
  endDate: FormControl<Date | null>
  sections: FormArray<FormControl<Section | null>>
  structureType: FormControl<string | null>
}>

type DateRange = {
  minStartDate: string | null
  minEndDate: string | null
}

@Component({
  selector: 'app-survey-form',
  standalone: true,
  providers: [DatePipe],
  imports: [
    MatButton,
    TranslateModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatCard,
    NgForOf,
    MatIcon,
    NgIf,
    MatLabel,
    MatError,
    AsyncPipe,
    MatOption,
    MatSelect,
    MatSuffix,
    MatProgressSpinner,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatTooltip,
    MatIconButton,
    RouterLink,
    MatButton,
  ],
  templateUrl: './survey-form.component.html',
  styleUrl: './survey-form.component.scss',
})
export class SurveyFormComponent
  extends WithSubscriptionsComponent
  implements OnInit
{
  editMode?: string

  form: SurveyForm = this.fb.group({
    id: new FormControl<string | null>(null),
    name: new FormControl<string | null>(null, {
      validators: [Validators.required],
      asyncValidators: [this.nameValidator.validate.bind(this.nameValidator)],
      updateOn: 'blur',
    }),
    version: new FormControl<number | null>({ value: 1, disabled: true }),
    description: new FormControl<string | null>(null),
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
    sections: this.fb.array<Section | null>([]),
    structureType: new FormControl<string | null>(null, Validators.required),
  })

  state$ = this.store.select(selectSurveyState)
  surveys$ = this.state$.pipe(map(({ surveys }) => surveys))
  sections$ = this.store
    .select(selectAllSectionList)
    .pipe(map(({ allSections }) => allSections?.content ?? []))
  sectionResponse$ = this.store
    .select(selectSectionState)
    .pipe(map(({ sections }) => sections))
  selectableSections$ = new BehaviorSubject<Array<Section>>([])
  operatingStatus$ = this.state$.pipe(
    map(({ operatingStatus }) => operatingStatus?.status),
  )
  structureTypes$ = this.store.select(selectStructureTypes)

  protected dateRange$: BehaviorSubject<DateRange> =
    new BehaviorSubject<DateRange>({
      minStartDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      minEndDate: new Date().toISOString().slice(0, 10),
    })

  constructor(
    private store: Store<SurveyAdminState>,
    private actions: Actions,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: DialogService,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private nameValidator: SurveyNameValidator,
  ) {
    super()
  }

  protected get versions() {
    const length = this.form.controls.version.value!
    return Array.from({ length }, (_, i) => i + 1).sort((a, b) =>
      a > b ? 1 : -1,
    )
  }

  protected hasError(
    field: FormControl<any>,
    error: string,
    translationSuffix: string,
  ) {
    if (
      (field.touched || field.dirty) &&
      field.errors &&
      Object.keys(field.errors as Record<string, boolean>).includes(error)
    ) {
      console.log(field.errors, error, translationSuffix)
      return this.translate.instant(
        `admin.survey-form.validators.${translationSuffix}`,
      )
    }
  }

  ngOnInit() {
    this.startActionsSubscription()
    this.store.dispatch(SectionActions.fetchAllSections())
    this.store.dispatch(UnitsListActions.fetchStructureTypes())

    this.subscriptions.push(
      combineLatest([this.form.valueChanges, this.sections$])
        .pipe(
          map(([form, sections]) => {
            this.selectableSections$.next(
              (sections ?? []).filter(
                (section) => !form.sections?.find((s) => s?.id === section.id),
              ),
            )
            if (form.startDate) {
              this.dateRange$
                .pipe(
                  take(1),
                  map((range) => {
                    this.dateRange$.next({
                      minStartDate: range.minStartDate,
                      minEndDate: this.datePipe.transform(
                        form.startDate,
                        'yyyy-MM-dd',
                      ),
                    })
                  }),
                )
                .subscribe()
            }
          }),
        )
        .subscribe(),
    )

    const surveyId = this.activatedRoute.snapshot.paramMap.get('surveyId')
    if (surveyId) {
      this.editMode = this.activatedRoute.snapshot.paramMap.get(
        'mode',
      ) as string

      if (this.editMode === 'clone') {
        this.form.controls.name.disable()
      }

      this.form.get('name')?.clearAsyncValidators()
      this.surveys$
        .pipe(
          take(1),
          map((surveys) => {
            const survey = (surveys?.content ?? []).find(
              ({ id }) => id?.toString() === surveyId,
            )
            if (survey) {
              this.initializeForm(survey)
            } else {
              const text = `Survey with id [${surveyId}] not found`
              this.addSubscription(
                this.dialog
                  .error({ text, buttonsType: 'ok' })
                  .afterClosed()
                  .subscribe(() => this.router.navigate(['/'])),
              )
              throw new Error(text)
            }
          }),
        )
        .subscribe()
    } else {
      this.form.controls.sections.push(
        new FormControl<Section | null>(null, Validators.required),
      )
    }

    this.form.clearValidators()
  }

  goBack() {
    this.router.navigate(['/'])
  }

  private initializeForm(survey: Survey) {
    this.form.patchValue({
      id: survey.id!.toString(),
      name: survey.name,
      version: survey.version,
      description: survey.description,
      startDate: survey.dateRange?.startDate,
      endDate: survey.dateRange?.endDate,
      structureType: survey.structureType,
    })

    survey.sections?.map((section) => {
      this.form.controls.sections.push(
        new FormControl(section, [Validators.required]),
      )
    })
  }

  private startActionsSubscription() {
    this.addSubscriptions(
      this.actions
        .pipe(
          ofType(SurveyActions.submitSurveySucceeded),
          tap(() => {
            const translation = !!this.editMode ? 'edited' : 'created'
            this.dialog
              .success({
                buttonsType: 'ok',
                onConfirmLabel: 'Vai alla dashboard',
                showIcon: true,
                title: this.translate.instant(
                  `admin.survey-form.survey-${translation}-dialog-title`,
                ),
                text: this.translate.instant(
                  `admin.survey-form.survey-${translation}-dialog`,
                ),
              })
              .afterClosed()
              .subscribe(() => this.router.navigate(['/']))
          }),
        )
        .subscribe(),

      this.actions
        .pipe(
          ofType(SurveyActions.submitSurveyFailed),
          tap(() => this.dialog.error({ buttonsType: 'ok' })),
        )
        .subscribe(),
    )
  }

  protected getTitlePlaceholder() {
    const prefix = 'admin.survey-form.title'
    const suffix = !this.editMode ? 'new' : this.editMode
    return `${prefix}-${suffix}`
  }

  protected addSection() {
    this.form.controls.sections.push(
      new FormControl(null, [Validators.required]),
    )
    window.setTimeout(() => {
      window.scroll({ behavior: 'smooth', top: document.body.scrollHeight })
    }, 100)
  }

  protected removeQuestion(index: number) {
    this.form.controls.sections.removeAt(index)
    this.form.markAsDirty()
  }

  protected submit(submitOption: SubmitSurveyOption) {
    this.form.markAllAsTouched()
    if (this.form.valid) {
      // console.log('VALID', this.form.getRawValue())
      this.store.dispatch(
        SurveyActions.submitSurvey({
          surveyForm: this.form.getRawValue(),
          submitOption,
        }),
      )
    }
  }

  protected moveSection(idx: number, newIdx: number) {
    const section = this.form.controls.sections.at(idx)
    this.form.controls.sections.removeAt(idx)
    this.form.controls.sections.insert(newIdx, section)
  }

  protected readonly SurveyOperatingStatus = SurveyOperatingStatus
  protected readonly document = document
  protected readonly SectionUtils = SectionUtils
}
