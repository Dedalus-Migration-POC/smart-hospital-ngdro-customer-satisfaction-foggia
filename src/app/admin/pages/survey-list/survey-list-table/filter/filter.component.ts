import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, distinctUntilChanged, map} from "rxjs";
import {SurveyActions} from "../../../../store/survey/actions";
import {Store} from "@ngrx/store";
import {SurveyAdminState} from "../../../../store/store";
import {selectSurveyState, SurveyFilterForm} from "../../../../store/survey/reducer";
import {WithSubscriptionsComponent} from "../../../../support/with-subscriptions-component";
import {SurveyStatus} from "../../../../repository/dto/survey";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatStartDate
} from "@angular/material/datepicker";
import {MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatIcon} from "@angular/material/icon";
import {ToggleButtonComponent} from "../../../../components/toggle-button/toggle-button.component";
import {selectUser} from "../../../../store/application/reducer";

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
    MatIconButton,
    MatTooltip,
    MatLabel,
    MatIcon,
    ToggleButtonComponent,
    MatDateRangeInput,
    MatDateRangePicker,
    MatStartDate,
    MatSuffix,
    NgIf
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent extends WithSubscriptionsComponent implements OnInit {
  protected form: SurveyFilterForm = this.fb.group({
    name: new FormControl<string | null>(null),
    status: new FormControl<SurveyStatus | null>(null),
    version: new FormControl<number | null>(null),
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
  });

  showDeleted$ = this.store.select(s => s.survey.showDeleted)
  canShowDeleted$ = this.store.select(selectUser).pipe(map((user) => user?.roles.includes('ROLE_ADMIN') ?? false))

  constructor(
    private store: Store<SurveyAdminState>,
    private fb: FormBuilder,
  ) {
    super();
  }

  ngOnInit() {
    this.addSubscriptions(
      this.form.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
        )
        .subscribe(() => {
          console.log('survey filter form changed')
          this.search()
        })
    )
  }

  state$ = this.store.select(selectSurveyState)
  versions$ = this.state$.pipe(map(s => s.versions));

  protected search() {
    this.store.dispatch(SurveyActions.fetchSurveys({form: this.form.value}));
  }

  protected toggleShowDeleted() {
    this.store.dispatch(SurveyActions.toggleShowDeleted())
  }

  protected readonly SurveyStatus = SurveyStatus;
  protected readonly Object = Object;
}
