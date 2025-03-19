import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms'
import { debounceTime, distinctUntilChanged, map, take } from 'rxjs'
import { SurveyActions } from '../../../../store/survey/actions'
import { Store } from '@ngrx/store'
import { SurveyAdminState } from '../../../../store/store'
import {
  selectSurveyState,
  SurveyFilterForm,
} from '../../../../store/survey/reducer'
import { WithSubscriptionsComponent } from '../../../../support/with-subscriptions-component'
import { SurveyStatus } from '../../../../repository/dto/survey'
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { MatOption, MatSelect } from '@angular/material/select'
import { AsyncPipe, DatePipe, NgForOf } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker'
import { MatButton } from '@angular/material/button'
import { MatTooltip } from '@angular/material/tooltip'
import { MatIcon } from '@angular/material/icon'

@Component({
  selector: 'app-survey-filter',
  standalone: true,
  providers: [DatePipe],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatSelect,
    MatOption,
    NgForOf,
    TranslateModule,
    AsyncPipe,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatButton,
    MatTooltip,
    MatLabel,
    MatIcon,
    MatSuffix,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent
  extends WithSubscriptionsComponent
  implements OnInit
{
  protected form: SurveyFilterForm = this.fb.group({
    name: new FormControl<string | null>(null),
    status: new FormControl<SurveyStatus | null>(null),
    version: new FormControl<number | null>(null),
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
  })

  constructor(
    private store: Store<SurveyAdminState>,
    private fb: FormBuilder,
  ) {
    super()
  }

  ngOnInit() {
    this.store.dispatch(SurveyActions.fetchAllSurveys())
    this.state$
      .pipe(
        take(1),
        map((state) => {
          const { searchCriteria } = state

          searchCriteria.filter.name &&
            this.form.controls.name.setValue(searchCriteria.filter.name)
          searchCriteria.filter.version &&
            this.form.controls.version.setValue(searchCriteria.filter.version)
          searchCriteria.filter.status &&
            this.form.controls.status.setValue(searchCriteria.filter.status)

          searchCriteria.filter.startDate &&
            this.form.controls.startDate.setValue(
              searchCriteria.filter.startDate,
            )
          searchCriteria.filter.endDate &&
            this.form.controls.endDate.setValue(searchCriteria.filter.endDate)
        }),
      )
      .subscribe(),
      this.addSubscriptions(
        this.form.valueChanges
          .pipe(debounceTime(500), distinctUntilChanged())
          .subscribe(() => {
            console.log('survey filter form changed')
            this.search()
          }),
      )
  }

  state$ = this.store.select(selectSurveyState)
  versions$ = this.state$.pipe(map((s) => s.versions))

  protected search() {
    this.store.dispatch(
      SurveyActions.fetchSurveys({
        form: this.form.value,
        tablePagination: {
          page: 0,
          size: 5,
        },
      }),
    )
  }

  protected readonly SurveyStatus = SurveyStatus
  protected readonly Object = Object
}
