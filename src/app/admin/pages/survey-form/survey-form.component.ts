import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {BehaviorSubject, combineLatest, map, take, tap} from "rxjs";
import {Store} from "@ngrx/store";
import {Actions, ofType} from "@ngrx/effects";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {SubmitSurveyOption, SurveyActions} from "../../store/survey/actions";
import {MatButton, MatIconButton} from "@angular/material/button";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MatError, MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatCard} from "@angular/material/card";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {DialogService} from "../../support/dialog-service";
import {Section} from "../../repository/dto/section";
import {Survey} from "../../repository/dto/survey";
import {MatOption, provideNativeDateAdapter} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {WithSubscriptionsComponent} from "../../support/with-subscriptions-component";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker
} from "@angular/material/datepicker";
import {SurveyAdminState} from "../../store/store";
import {selectSectionList, selectSectionState} from "../../store/section/reducer";
import {selectSurveyState, SurveyOperatingStatus} from "../../store/survey/reducer";
import {withLatestFrom} from "rxjs/operators";
import {MatTooltip} from "@angular/material/tooltip";

export type SurveyForm = FormGroup<{
  id: FormControl<string | null>;
  name: FormControl<string | null>;
  version: FormControl<number | null>;
  description: FormControl<string | null>;
  startDate: FormControl<Date | null>;
  endDate: FormControl<Date | null>;
  sections: FormArray<FormControl<Section | null>>
}>

type DateRange = {
  minStartDate: string | null;
  minEndDate: string | null;
}

@Component({
  selector: 'app-survey-form',
  standalone: true,
  providers: [provideNativeDateAdapter(), DatePipe],
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
    MatHint,
    MatError,
    AsyncPipe,
    MatOption,
    MatSelect,
    MatSuffix,
    MatProgressSpinner,
    MatDateRangeInput,
    MatDateRangePicker,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatTooltip,
    MatIconButton,
    RouterLink,
  ],
  templateUrl: './survey-form.component.html',
  styleUrl: './survey-form.component.scss'
})
export class SurveyFormComponent extends WithSubscriptionsComponent implements OnInit {
  editMode = false;

  form: SurveyForm = this.fb.group({
    id: new FormControl<string | null>(null),
    name: new FormControl<string | null>(null, Validators.required),
    version: new FormControl<number | null>({value: 1, disabled: true}),
    description: new FormControl<string | null>(null),
    startDate: new FormControl<Date | null>(null, Validators.required),
    endDate: new FormControl<Date | null>(null),
    sections: this.fb.array<Section | null>([])
  });

  state$ = this.store.select(selectSurveyState)
  surveys$ = this.state$.pipe(map(({surveys}) => surveys));
  sections$ = this.store.select(selectSectionList).pipe(map(({sections}) => sections?.content ?? []))
  sectionResponse$ = this.store.select(selectSectionState).pipe(map(({sections}) => sections));
  selectableSections$ = new BehaviorSubject<Array<Section>>([]);
  operatingStatus$ = this.state$.pipe(map(({operatingStatus}) => operatingStatus?.status))

  protected dateRange$: BehaviorSubject<DateRange> = new BehaviorSubject<DateRange>({
    minStartDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
    minEndDate: new Date().toISOString().slice(0, 10),
  });

  constructor(
    private store: Store<SurveyAdminState>,
    private actions: Actions,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: DialogService,
    private translate: TranslateService,
    private datePipe: DatePipe
  ) {
    super();
  }

  protected get versions() {
    const length = this.form.controls.version.value!;
    return Array.from({length}, (_, i) => i + 1).sort((a, b) => a > b ? 1 : -1)
  }

  ngOnInit() {
    this.startActionsSubscription()

    combineLatest([this.form.valueChanges, this.dateRange$]).subscribe(([value, range]) => {
      console.log('form: ', this.form)
      console.log(value, range)
    })

    this.subscriptions.push(
      this.form.valueChanges.pipe(
        withLatestFrom(this.sectionResponse$),
        tap(([form, sections]) => {
          console.log('Selected sections:', this.form.get('sectionIds')?.value);
          this.selectableSections$.next(
            (sections?.content ?? []).filter(section => !form.sections?.find(s => s?.id === section.id))
          )
          this.dateRange$.next({
            minStartDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
            minEndDate: !form.startDate ? null : this.datePipe.transform(form.startDate, 'yyyy-MM-dd'),
          })
        })
      ).subscribe()
    )

    const surveyId = this.activatedRoute.snapshot.paramMap.get('surveyId');
    if (surveyId) {
      this.editMode = true
      this.surveys$.pipe(
        take(1),
        map(surveys => {
          const survey = (surveys?.content ?? []).find(({id}) => id?.toString() === surveyId);
          if (survey) {
            this.initializeForm(survey);
          } else {
            const text = `Survey with id [${surveyId}] not found`
            this.addSubscription(
              this.dialog.error({text, buttonsType: 'ok'}).afterClosed().subscribe(
                () => this.router.navigate(["/"])
              )
            )
            throw new Error(text);
          }
        })
      ).subscribe()
    } else {
      this.form.controls.sections.push(
        new FormControl<Section | null>(null, Validators.required)
      )
    }

    this.form.clearValidators()
  }

  private initializeForm(survey: Survey) {
    this.form.patchValue({
      id: survey.id!.toString(),
      name: survey.name,
      version: survey.version,
      description: survey.description,
      startDate: survey.dateRange?.startDate,
      endDate: survey.dateRange?.endDate,
    })

    survey.sections?.map((section) => {
      this.form.controls.sections.push(
        new FormControl(section, [Validators.required])
      )
    })
  }

  private startActionsSubscription() {
    this.addSubscriptions(
      this.actions.pipe(
        ofType(SurveyActions.submitSurveySucceeded),
        tap(() => {
          const translation = this.editMode ? 'edited' : 'created'
          this.dialog.success({
            buttonsType: 'ok',
            text: this.translate.instant(`admin.survey-form.survey-${translation}-dialog`)
          })
            .afterClosed().subscribe(() => this.router.navigate(['/']))
        })
      ).subscribe(),

      this.actions.pipe(
        ofType(SurveyActions.submitSurveyFailed),
        tap(() => this.dialog.error({buttonsType: 'ok'}))
      ).subscribe()
    )
  }

  protected getTitlePlaceholder() {
    const prefix = 'admin.survey-form.title'
    const suffix = !this.editMode ? 'new' : 'edit'
    return `${prefix}-${suffix}`
  }

  protected addSection() {
    this.form.controls.sections.push(new FormControl(null, [Validators.required]))
    window.setTimeout(() => {
      window.scroll({behavior: 'smooth', top: document.body.scrollHeight})
    }, 100)
  }

  protected removeQuestion(index: number) {
    this.form.controls.sections.removeAt(index)
    this.form.markAsDirty()
  }

  protected submit(submitOption: SubmitSurveyOption) {
    this.form.markAllAsTouched()
    if (this.form.valid) {
      console.log('VALID', this.form.getRawValue())
      this.store.dispatch(SurveyActions.submitSurvey({
        surveyForm: this.form.getRawValue(),
        submitOption
      }))
    }
  }

  protected moveSection(idx: number, newIdx: number) {
    const section = this.form.controls.sections.at(idx)
    this.form.controls.sections.removeAt(idx)
    this.form.controls.sections.insert(newIdx, section)
  }

  protected readonly SurveyOperatingStatus = SurveyOperatingStatus;
  protected readonly document = document;
}
