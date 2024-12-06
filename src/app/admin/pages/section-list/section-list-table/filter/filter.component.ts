import {Component, OnInit} from '@angular/core'
import {MatFormField, MatLabel} from '@angular/material/form-field'
import {MatInput} from '@angular/material/input'
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule,} from '@angular/forms'
import {MatButton} from '@angular/material/button'
import {MatIcon} from '@angular/material/icon'
import {AsyncPipe, NgForOf} from '@angular/common'
import {TranslateModule} from '@ngx-translate/core'
import {combineLatest, debounceTime, distinctUntilChanged, map} from 'rxjs'
import {Store} from '@ngrx/store'
import {SurveyAdminState} from '../../../../store/store'
import {WithSubscriptionsComponent} from '../../../../support/with-subscriptions-component'
import {MatOption, MatSelect} from '@angular/material/select'
import {SectionFilterForm, selectSectionList, selectSectionState,} from '../../../../store/section/reducer'
import {SectionActions} from '../../../../store/section/actions'
import {selectSurveyState} from '../../../../store/survey/reducer'
import {MatTooltip} from '@angular/material/tooltip'
import {SurveyUtils} from '../../../../support/survey-utils'
import {Survey} from '../../../../repository/dto/survey'

@Component({
  selector: 'app-section-filter',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    FormsModule,
    MatLabel,
    MatIcon,
    TranslateModule,
    AsyncPipe,
    MatButton,
    MatSelect,
    MatOption,
    NgForOf,
    ReactiveFormsModule,
    MatTooltip,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent extends WithSubscriptionsComponent implements OnInit {

  protected form: SectionFilterForm = this.fb.group({
    name: new FormControl<string | null>(null),
    version: new FormControl<number | null>(null),
    presentIn: new FormControl<number | null>(null),
  })

  constructor(
    private store: Store<SurveyAdminState>,
    private fb: FormBuilder,
  ) {
    super()
  }

  ngOnInit() {
    this.store.dispatch(SectionActions.fetchAllSections())

    this.addSubscriptions(
      this.form.valueChanges
        .pipe(debounceTime(500), distinctUntilChanged())
        .subscribe(() => {
          this.store.dispatch(
            SectionActions.fetchSections({form: this.form.value}),
          )
        }),

      this.surveys$.subscribe((surveys) => {
        if ((surveys?.content ?? []).length) {
          this.form.controls.presentIn.enable()
        } else {
          this.form.controls.presentIn.disable()
        }
      }),
    )
  }

  state$ = this.store.select(selectSectionState)
  surveyState$ = this.store.select(selectSurveyState)
  versions$ = this.state$.pipe(map((s) => s.versions))
  surveys$ = this.surveyState$.pipe(map((s) => s.surveys))
  surveysFullList$ = this.surveyState$.pipe(map((s) => s.allSurveys))
  sections$ = this.store.select(selectSectionList)

  presentInOptions$ = combineLatest([this.sections$, this.surveysFullList$]).pipe(
    map(([{sections}, surveys]) =>
      (sections?.content ?? [])
        .map((section) =>
          (section.associatedSurveys ?? []).map((ass) => ({
            id: ass.id,
            value: SurveyUtils.getNameAndVersion(
              surveys?.content!,
              ass as Survey,
            ),
          })),
        )
        .flat()
        .sort((a, b) => (a.value < b.value ? -1 : 1)),
    ),
    map((data) => [
      ...new Map(data.map((item) => [item['id'], item])).values(),
    ]),
  )
}
